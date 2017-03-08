let Category = require('./categoryModel');
let _ = require('lodash');

exports.params = (req, res, next, id) => {
  Category.findById(id)
    .then((category) => {
      if (!category) {
        next(new Error('No category with that id'));
      } else {
        req.category = category;
        next();
      }
    }, (err) => {
      next(err);
    });
};

exports.get = (req, res, next) => {
  Category.find({})
    .then((categories) => {
      res.json(categories);
    }, (err) => {
      next(err);
    });
};

exports.getOne = (req, res, next) => {
  let category = req.category;
  res.json(category);
};

exports.put = (req, res, next) => {
  let category = req.category;

  let update = req.body;

  _.merge(category, update);

  category.save((err, category) => {
    if (err) {
      next(err);
    } else {
      res.json({ message: "Category updated!", category });
    }
  })
};

exports.post = (req, res, next) => {
  let newcategory = new Category(req.body);
  newcategory.save((err, category) => {
    if(err) {
      next(err);
    } else {
      res.status(201).json({ message: "Category successfully added!", category });
    }
  });
};

exports.delete = (req, res, next) => {
  req.category.remove((err, result) => {
    if(err) {
      next(err);
    } else {
      res.json({ message: 'Category successfully deleted!', result });
    }
  })
}
