(() => {
  'use strict';

  var mongoose = require('mongoose'),
    db = require('./config/database'),
    app = require('./config/express'),
    port = process.env.PORT || 9000;

    mongoose.Promise = Promise;

  mongoose.connect(db.url || process.env.DATABASE_URL);

  app.listen(port);
  console.log('Successfully connected to ' + port);

  module.exports = app;
})();
