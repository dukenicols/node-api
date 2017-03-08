let User = require('./userModel');
let _ = require('lodash');
let signToken = require('../../auth/auth').signToken;

exports.params = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new Error('No user with that id'));
      } else {
        req.user = user;
        next();
      }
    }, (err) => {
      next(err);
    });
};

exports.get = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.json(users);
    }, (err) => {
      next(err);
    });
};

exports.getOne = (req, res, next) => {
  let user = req.user;
  res.json(user);
};

exports.put = (req, res, next) => {
  let user = req.user;

  let update = req.body;

  _.merge(user, update);

  user.save((err, saved) => {
    if (err) {
      next(err);
    } else {
      res.json(saved);
    }
  })
};

exports.post = (req, res, next) => {
  let newUser = new User(req.body);

  newUser.save((err, user) => {
    if(err) {next(err);}

    let token = signToken(user._id);
    res.json({token: token});
  });
};

exports.delete = (req, res, next) => {
  req.user.remove((err, removed) => {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};
