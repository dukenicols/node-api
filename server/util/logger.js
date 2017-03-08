// no let needed here, colors will attached colors
// to String.prototype
require('colors');
let _ = require('lodash');

let config = require('../config/config');

// create a noop (no operation) function for when loggin is disabled
let noop = function(){};
// check if loggin is enabled in the config
// if it is, then use console.log
// if not then noop
let consoleLog = config.logging ? console.log.bind(console) : noop;

let logger = {
  log: function() {
    let tag = '[ ✨ LOG ✨ ]'.green;
    // arguments is an array like object with all the passed
    // in arguments to this function
    let args = _.toArray(arguments)
      .map((arg) => {
        if(typeof arg === 'object') {
          // turn the object to a string so we
          // can log all the properties and color it
          let string = JSON.stringify(arg, null, 2);
          return tag + '  ' + string.cyan;
        } else {
          return tag + '  ' + arg.cyan;
        }
      });

    // call either console.log or noop here
    // with the console object as the context
    // and the new colored args :)
    consoleLog.apply(console, args);
  },

  error: () => {
    let args = _.toArray(arguments)
      .map((arg) => {
        arg = arg.stack || arg;
        let name = arg.name || '[ ❌ ERROR ❌ ]';
        let log = name.yellow + '  ' + arg.red;
        return log;
      });

    consoleLog.apply(console, args);
  }
};

module.exports = logger;
