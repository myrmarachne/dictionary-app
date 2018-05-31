var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  port = process.env.PORT || 3000,
  fakeModel = require('./fake-model'),
  categoryController = require('./controllers/category'),
  wordTranslationController = require('./controllers/word-translation')
  wordController = require('./controllers/word');

function injectModel(controllerMethod) {
  return function () {
    return controllerMethod.call(
      null,
      ...[fakeModel].concat(Array.prototype.slice.call(arguments))
    );
  }
}

app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.route('/categories')
  .get(injectModel(categoryController.getAll))
  .post(injectModel(categoryController.add));
app.route('/categories/:categoryId')
  .get(injectModel(categoryController.getById))
  .put(injectModel(categoryController.modify))
  .delete(injectModel(categoryController.deleteById));

app.route('/words')
  .get(injectModel(wordController.getAll))
  .post(injectModel(wordController.add));

app.route('/words/:wordId')
  .get(injectModel(wordController.getById))
  .put(injectModel(wordController.modify))
  .delete(injectModel(wordController.deleteById));

app.route('/word-translations')
  .get(injectModel(wordTranslationController.getAll))
  .post(injectModel(wordTranslationController.add));

app.route('/word-translations/:translationId')
  .get(injectModel(wordTranslationController.getById))
  .put(injectModel(wordTranslationController.modify))
  .delete(injectModel(wordTranslationController.deleteById));

app.listen(port);

console.log('adDICT server started on: ' + port);
