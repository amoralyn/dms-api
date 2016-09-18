(function() {
  'use strict';
  if (!process.env.NODE_ENV) {
    var dotenv = require('dotenv')

    dotenv.load();
  }
  var mongoose = require('mongoose');
  var express = require('express');
  var bodyParser = require('body-parser');
  var morgan = require('morgan');
  var methodOverride = require('method-override');
  var config = require('./config/environment.js');
  var connect = require('./config/connections.js');
  var app = express();
  var routes = require('./server/routes/index.js');
  var router = express.Router();
  routes(router);

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(methodOverride());

  app.use('/api', router);

  // app.get('/api', function(req, res) {
  //   if (req.url.indexOf('/api') == 0) {
  //     console.log('yes i have done it');
  //   }
  // });


  app.get('/', function(req, res) {
    res.send({
      message: 'You have reached the DMS-API'
    });
  });

  // connect to database
  connect(mongoose, config.database);

  // Listen to port
  app.listen(config.port, function(err) {
    if (err) {
      throw err;
    };

    console.log('Successfully connected to ' + config.port);
  });


  module.exports = app;

})();
