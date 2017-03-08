let router = require('express').Router();

// api router will mount other routers
// for all our resources
router.use('/user', require('./user/userRoutes'));
router.use('/category', require('./category/categoryRoutes'));
router.use('/post', require('./post/postRoutes'));

module.exports = router;
