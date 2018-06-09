var utils = require('../utils');

module.exports = {
  getAll: function(model, req, res) {
    const result = model.categories.map(c => c.id);
    res.json(result);
  },

  getById: function(model, req, res) {
    let result;
    if (req.params.categoryId === 'all') {
      result = {
        id: 'all',
        name: 'All words',
        words: model.words.map(word => word.id),
      }
    } else {
      result = utils.findModelInCollection(model.categories, parseInt(req.params.categoryId));
    }
    if (!result) {
      res.statusCode = 404;
    } else {
      result = calculateLearnedWords(model, result);
    }
    res.json(result);
  },

  add: function(model, req, res) {
    const ids = model.categories.map(c => c.id);
    const id = ids.length ? Math.max(...ids) + 1 : 0;
    const category = req.body;
    category.id = id;
    category.words = [];
    delete category.learnedWordsThisWeek;
    delete category.learnedWordsBeforeThisWeek;
    model.categories.push(category);
    res.json(category);
  },

  modify: function(model, req, res) {
    const category = req.body;
    delete category.learnedWordsThisWeek;
    delete category.learnedWordsBeforeThisWeek;
    const categoryId = parseInt(req.params.categoryId);
    const index = utils.findModelIndexInCollection(model.categories, categoryId);
    if (index === -1) {
      res.statusCode = 404;
      res.send('error');
      return;
    }

    model.words.forEach(word => {
      const indexInCategory = category.words.indexOf(word.id);
      const indexInWord = word.categories.indexOf(categoryId);
      if (indexInCategory !== -1 && indexInWord === -1) {
        word.categories.push(categoryId);
      } else if (indexInCategory === -1 && indexInWord !== -1) {
        word.categories.splice(indexInWord, 1);
      }
    });
    model.categories[index] = category;
    res.json(calculateLearnedWords(model, category));
  },

  deleteById: function(model, req, res) {
    const id = parseInt(req.params.categoryId);
    const index = model.categories.map(c => c.id).indexOf(id);
    if (index !== -1) {
      const category = model.categories[index];
      category.words.forEach(wordId => {
        const word = utils.findModelInCollection(model.words, wordId);
        if (word) {
          const indexInWord = word.categories.indexOf(id);
          if (indexInWord !== -1) {
            word.categories.splice(indexInWord, 1);
          }
        }
      });
      model.categories.splice(index, 1);
    }
    res.json('');
  }
}

function calculateLearnedWords(model, category) {
  const learnedWords = category.words
    .map(wordId => utils.findModelInCollection(model.words, wordId))
    .filter(word => word.learnedTime);
  const weekAgo = new Date((new Date()).getTime() - (60*60*24*7*1000));
  const thisWeekWords = learnedWords.filter(word => new Date(word.learnedTime) - weekAgo >= 0);
  category = Object.assign({}, category, {
    learnedWordsThisWeek: thisWeekWords.length,
    learnedWordsBeforeThisWeek: learnedWords.length - thisWeekWords.length
  });
  return category;
}
