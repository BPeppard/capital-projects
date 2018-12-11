const MongoClient = require('mongodb').MongoClient;
const MongoObjectId = process.env.MONGO_URI
  ? require('mongodb').ObjectId
  : id => {
      return id;
    };

let requestTypesCollection;
if (process.env.MONGO_URI) {
  MongoClient.connect(
    process.env.MONGO_URI,
    (err, mongoClient) => {
      if (err) throw new Error(err);
      const dbName = process.env.MONGO_URI.split('/')
        .pop()
        .split('?')
        .shift();
      const db = mongoClient.db(dbName);
      requestTypesCollection = db.collection('requestTypes');
    }
  );
}

module.exports = (expressApp, functions) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance');
  }

  // Create route to return all requestTypes
  expressApp.get('requestTypes', (req, res) => {
    if (!req.user) {
      return res.status('403').end();
    }
    let result;
    return new Promise(function(resolve, reject) {
      result = requestTypesCollection.find();
      result
        .toArray((err, requestTypes) => {
          if (err) {
            reject(err);
          } else {
            resolve(requestTypes);
          }
        })
        .catch(err => {
          return res.status(500).json(err);
        });
    });
  });
};
