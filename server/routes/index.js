(function() {
  'use strict';

  var userRoutes = require('./users.routes'),
    documentRoutes = require('./documents.routes'),
    roleRoutes = require('./roles.routes');

  var routes = function(router) {
    userRoutes(router);
    documentRoutes(router);
    roleRoutes(router);
  };

  module.exports = routes;
})();
