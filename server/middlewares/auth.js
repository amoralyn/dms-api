(function () {
  'use strict';

  var config = require('./../../config/config'),
  jwt = require('jsonwebtoken');

  exports.authMiddleware = function (req, res, next) {
    var token = req.body.token || req.query.token ||
     req.headers['x-access-token'];

    if (token) {
     //verify secret and check exp
     jwt.verify(token, config.secret, function(err, decoded) {
       if (err) {
         return res.json({
           success: false,
           message: 'Failed to authenticate token'
         });
       } else {
         //if everything is good
         req.decoded = decoded;
         next();
       }
     });
   } else {
     //if no token is found
     return res.status(403).send({
       success: false,
       message: 'No token provided'
     });
   }
  };
})();
