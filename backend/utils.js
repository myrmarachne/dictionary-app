exports.findModelIndexInCollection = function(collection, id) {
  return collection.map(c => c.id).indexOf(id);
}

exports.findModelInCollection = function(collection, id) {
  const index = exports.findModelIndexInCollection(collection, id);
  return index !== -1 ? collection[index] : null;
}
