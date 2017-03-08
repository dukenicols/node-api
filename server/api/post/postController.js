let Post = require('./postModel');
let _ = require('lodash');
let logger = require('../../util/logger');

exports.params = (req, res, next, id) => {
  Post.findById(id)
    .populate('author')
    .exec()
    .then((post) => {
      if (!post) {
        next(new Error('No post with that id'));
      } else {
        req.post = post;
        next();
      }
    }, (err) => {
      next(err);
    });
};

exports.get = (req, res, next) => {
  Post.find({})
    .populate('author categories')
    .exec()
    .then((posts) => {
      res.json(posts);
    }, (err) => {
      next(err);
    });
};

exports.getOne = (req, res, next) => {
  let post = req.post;
  res.json(post);
};

exports.put = (req, res, next) => {
  let post = req.post;

  let update = req.body;

  _.merge(post, update);

  post.save((err, post) => {
    if (err) {
      next(err);
    } else {
      res.json({ message: "Post updated!", post });
    }
  })
};

exports.post = (req, res, next) => {
  let newpost = req.body;
  Post.create(newpost)
    .then(function(post) {
      res.status(201).json({ message: "Post successfully added!", post });
    }, function(err) {
      logger.error(err);
      next(err);
    });
};

exports.delete = (req, res, next) => {
  req.post.remove((err, result) => {
    if (err) {
      next(err);
    } else {
      res.json({ message: "Post successfully deleted!", result });
    }
  });
};
