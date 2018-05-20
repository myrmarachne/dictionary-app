var utils = require('../utils');

module.exports = {
  getAll: function(model, req, res) {
    const words = model.words.slice(0);
    const type = req.query.type;
    const limit = parseInt(req.query.limit || String(words.length));
    let result;
    switch (type) {
      case 'last':
        result = words.sort(function(a, b) {
          return new Date(b.creationTime) - new Date(a.creationTime);
        });
        break;
      case 'hard':
        result = words.filter(w => !w.learnedTime);
        break;
      default:
        result = words;
    }
    result = result.slice(0, limit).map(w => w.id);
    res.json(result);
  },

  getById: function(model, req, res) {
    const result = utils.findModelInCollection(model.words, parseInt(req.params.wordId));
    if (!result) {
      res.statusCode = 404;
    }
    res.json(result);
  },

  add: function(model, req, res) {
    const ids = model.words.map(c => c.id);
    const id = ids.length ? Math.max(...ids) + 1 : 0;
    const word = req.body;
    word.id = id;
    word.creationTime = (new Date()).toString();
    model.words.push(word);
    word.categories.map(categoryId => {
      const category = utils.findModelInCollection(model.categories, categoryId);
      category.words.push(id);
    });
    word.translations = [];
    res.json(word);
  },

  modify: function(model, req, res) {
    const wordId = parseInt(req.params.wordId);
    const wordIndex = utils.findModelIndexInCollection(model.words, wordId);
    if (wordIndex === -1) {
      res.statusCode = 404;
      res.send('');
      return;
    }
    const newWord = req.body;
    const oldWord = model.words[wordIndex];

    model.categories.forEach(category => {
      const indexInCategory = category.words.indexOf(wordId);
      const indexInWord = newWord.categories.indexOf(category.id);
      if (indexInCategory !== -1 && indexInWord === -1) {
        category.words.splice(indexInCategory, 1);
      } else if (indexInCategory === -1 && indexInWord !== -1) {
        category.words.push(wordId);
      }
    });

    const translationsToDelete = oldWord.translations
      .filter(tid => newWord.translations.indexOf(tid) === -1);
    if (translationsToDelete.length) {
      model.wordTranslations = model.wordTranslations
        .filter(wt => translationsToDelete.indexOf(wt.id) === -1);
    }

    model.words[wordIndex] = newWord;
    res.json(newWord);
  },

  deleteById: function(model, req, res) {
    const id = parseInt(req.params.wordId);
    const wordIndex = utils.findModelIndexInCollection(model.words, id);
    if (wordIndex !== -1) {
      const word = model.words[wordIndex];
      word.categories.forEach(categoryId => {
        const category = utils.findModelInCollection(model.categories, categoryId);
        if (category) {
          const indexInCategory = category.words.indexOf(id);
          if (indexInCategory !== -1) {
            category.words.splice(indexInCategory, 1);
          }
        }
      });
      model.wordTranslations = model.wordTranslations
        .filter(wt => word.translations.indexOf(wt.id) === -1);
      model.words.splice(wordIndex, 1);
    }
    res.json('');
  }
}
