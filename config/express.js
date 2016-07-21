(function() {
  'use strict';

  var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override');
    //router = express.Router();

    app.use(methodOverride());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(morgan('dev'));

    module.exports = app;
})();
 
