(function() {
  'use strict';

  var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    routes = require('./../server/routes/index'),
    router = express.Router();

    routes(router);

    app.use(methodOverride());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(morgan('dev'));

    app.use('/api', router);

    app.get('/', function(req, res) {
      res.status(200).json({
        message: 'Api is here'
      });
    });

    module.exports = {
      app
    };
})();
