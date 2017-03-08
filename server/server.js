let express = require('express');
let app = express();
let api = require('./api/api');
let config = require('./config/config');
let logger = require('./util/logger');
let auth = require('./auth/routes');
// db.url is different depending on NODE_ENV
require('mongoose').connect(config.db.url);

if (config.seed) {
  require('./util/seed');
}
// setup the app middlware
require('./middleware/appMiddlware')(app);

// setup the api
app.use('/api', api);
app.use('/auth', auth);

// set up global error handling
app.use((err, req, res, next) => {
  // if error thrown from jwt validation check
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
    return;
  }

  logger.error(err.stack);
  res.send(err);
});

// export the app for testing
module.exports = app;
