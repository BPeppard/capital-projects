/**
 * Defines an endpoint that returns a list of users. You must be signed in and
 * have "admin": true set in your profile to be able to call the /admin/users
 * end point (you will need to configure persistant Mongo database to do that).
 *
 * Note: These routes only work if you have actually configured a MONGO_URI!
 * They do not work if you are using the fallback in-memory database.
 **/
'use strict';

const uuid = require('uuid');

const MongoClient = require('mongodb').MongoClient;
const MongoObjectId = process.env.MONGO_URI
  ? require('mongodb').ObjectId
  : id => {
      return id;
    };

let usersCollection;
if (process.env.MONGO_URI) {
  // Connect to MongoDB Database and return user connection
  MongoClient.connect(
    process.env.MONGO_URI,
    (err, mongoClient) => {
      if (err) throw new Error(err);
      const dbName = process.env.MONGO_URI.split('/')
        .pop()
        .split('?')
        .shift();
      const db = mongoClient.db(dbName);
      usersCollection = db.collection('users');
    }
  );
}

module.exports = (expressApp, functions) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance');
  }

  expressApp.get('/admin/users', (req, res) => {
    // Check user is logged in and has admin access
    if (!req.user || !req.user.admin || req.user.admin !== true)
      return res.status('403').end();

    const page =
      req.query.page && parseInt(req.query.page) > 0
        ? parseInt(req.query.page)
        : 1;
    const sort = req.query.sort ? { [req.query.sort]: 1 } : {};

    let size = 10;
    if (
      req.query.size &&
      parseInt(req.query.size) > 0 &&
      parseInt(req.query.size) < 500
    ) {
      size = parseInt(req.query.size);
    }

    const skip = size * (page - 1) > 0 ? size * (page - 1) : 0;

    let response = {
      users: [],
      page: page,
      size: size,
      sort: req.params.sort,
      total: 0
    };

    if (req.params.sort) response.sort = req.params.sort;

    let result;
    return new Promise(function(resolve, reject) {
      result = usersCollection
        .find()
        .skip(skip)
        .sort(sort)
        .limit(size);

      result.toArray((err, users) => {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
    })
      .then(users => {
        response.users = users;
        return result.count();
      })
      .then(count => {
        response.total = count;
        return res.json(response);
      })
      .catch(err => {
        return res.status(500).json(err);
      });
  });

  // Expose a route to set resetPassword flag for users making them change
  // their password on next login.
  expressApp.post('/admin/user/resetpassword', (req, res) => {
    // Check user is logged in and has admin access
    if (!req.user || !req.user.admin || req.user.admin !== true)
      return res.status('403').end();

    console.log(`Looking for id: ${MongoObjectId(req.body.userId)}`);

    usersCollection.findOne(
      { _id: MongoObjectId(req.body.userId) },
      (err, user) => {
        if (err) {
          console.log('Error finding user');
          return res
            .status(500)
            .json({ error: 'Error finding user to update' });
        }
        if (!user) {
          console.log('Could not find user to update');
          return res
            .status(500)
            .json({ error: 'Could not find user to update' });
        }
        const token = uuid();
        const url = `${req.protocol}://${
          req.headers.host
        }/auth/email/signin/${token}`;
        user.resetPassword = true;
        user.emailToken = token;
        usersCollection.update(
          { _id: MongoObjectId(user._id) },
          user,
          (err, updatedUser) => {
            if (err) {
              console.log('Error updating users password');
              console.log(err);
              return res
                .status(500)
                .json({ error: 'Error reseting users password' });
            }
            functions.sendSignInEmail({
              email: updatedUser.email,
              url: url,
              req: req
            });
            return res.json({ message: 'User password reset' });
          }
        );
      }
    );
  });

  // Expose a route to allow users to delete their profile.
  expressApp.post('/admin/delete', (req, res) => {
    // Check user is logged in and has admin access
    if (!req.user || !req.user.admin || req.user.admin !== true)
      return res.status('403').end();

    usersCollection
      .remove({ _id: MongoObjectId(req.body.userId) })
      .then(() => {
        return res.status(200).json({ message: 'User deleted' });
      })
      .catch(err => {
        return res.status(500).json({ error: 'Unable to delete profile' });
      });
  });
};
