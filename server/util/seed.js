let User = require('../api/user/userModel');
let Post = require('../api/post/postModel');
let Category = require('../api/category/categoryModel');
let _ = require('lodash');
let logger = require('./logger');

logger.log('Seeding the Database');

let users = [
  {username: 'Jimmylo', password: 'test'},
  {username: 'Xoko', password: 'test'},
  {username: 'katamon', password: 'test'}
];

let categories = [
  {name: 'intros'},
  {name: 'angular'},
  {name: 'UI/UX'}
];

let posts = [
  {title: 'Learn angular 2 today', text: 'Angular to is so dope'},
  {title: '10 reasons you should love IE7', text: 'IE7 is so amazing'},
  {title: 'Why we switched to Go', text: 'go is dope'}
];

let createDoc = (model, doc) => {
  return new Promise((resolve, reject) => {
    new model(doc).save((err, saved) => err ? reject(err) : resolve(saved) );
  });
};

let cleanDB = () => {
  logger.log('... cleaning the DB');
  let cleanPromises = [User, Category, Post]
    .map( (model) => model.remove().exec() );
  return Promise.all(cleanPromises);
}

let createUsers = (data) => {

  let promises = users.map( (user) => createDoc(User, user) );

  return Promise.all(promises)
    .then((users) => _.merge({users: users}, data || {}) );
};

let createCategories = (data) => {
  let promises = categories.map((category) => createDoc(Category, category ));

  return Promise.all(promises)
    .then((categories) => _.merge({categories: categories}, data || {}));
};

let createPosts = (data) => {
  let addCategory = (post, category) => {
    post.categories.push(category);

    return new Promise((resolve, reject) => {
      post.save( (err, saved) => err ? reject(err) : resolve(saved) );
    });
  };

  let newPosts = posts.map((post, i) => {
    post.author = data.users[i]._id;
    return createDoc(Post, post);
  });

  return Promise.all(newPosts)
    .then((savedPosts) => {
      return Promise.all(savedPosts.map((post, i) => {
        return addCategory(post, data.categories[i])
      }));
    })
    .then(() => 'Seeded DB with 3 Posts, 3 Users, 3 Categories');
};

cleanDB()
  .then(createUsers)
  .then(createCategories)
  .then(createPosts)
  .then(logger.log.bind(logger))
  .catch(logger.log.bind(logger));
