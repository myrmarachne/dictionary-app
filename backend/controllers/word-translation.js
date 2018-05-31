var utils = require('../utils');

module.exports = {
  getAll: function(model, req, res) {
    res.json(model.wordTranslations.map(wt => wt.id));
  },

  getById: function(model, req, res) {
    const result = utils.findModelInCollection(model.wordTranslations, parseInt(req.params.translationId));
    if (!result) {
      res.statusCode = 404;
    }
    res.json(result);
  },

  add: function(model, req, res) {
    const ids = model.wordTranslations.map(c => c.id);
    const id = ids.length ? Math.max(...ids) + 1 : 0;
    const translation = req.body;
    translation.id = id;
    const word = utils.findModelInCollection(model.words, translation.wordId);
    if (!word) {
      res.statusCode = 400;
      res.send('');
      return;
    }
    word.translations.push(id);
    model.wordTranslations.push(translation);
    res.json(translation);
  },

  modify: function(model, req, res) {
    const newTranslation = req.body;
    const translationId = parseInt(req.params.translationId);
    const translationIndex = utils.findModelIndexInCollection(model.wordTranslations, translationId);
    if (translationIndex === -1 || translationId !== newTranslation.id) {
      res.statusCode = 404;
      res.send('');
      return;
    }
    
    model.wordTranslations[translationIndex] = newTranslation;
    res.json(newTranslation);
  },

  deleteById: function(model, req, res) {
    const id = parseInt(req.params.translationId);
    const translationIndex = utils.findModelIndexInCollection(model.wordTranslations, id);
    if (translationIndex !== -1) {
      const translation = model.wordTranslations[translationIndex];
      const word = utils.findModelInCollection(model.words, translation.wordId);
      if (word) {
        const indexInWord = word.translations.indexOf(id);
        if (indexInWord !== -1) {
          word.translations.splice(indexInWord, 1);
        }
      }
      model.wordTranslations.splice(translationIndex, 1);
    }
    res.json('');
  }
}
