let router = require('express').Router();
let verifyUser = require('./auth').verifyUser;
let controller = require('./controller');

// before we send back a jwt, lets check
// the password and username match what is in the DB
router.post('/signin', verifyUser(), controller.signin);

module.exports = router;
