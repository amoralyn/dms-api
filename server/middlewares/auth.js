(function() {
  'use strict';

  var config = require('./../../config/environment.js'),
    jwt = require('jsonwebtoken'),
    adminConfig = require('./../../config/adminConfig'),
    Documents = require('./../models/document'),
    Role = require('./../models/role');

  /**
   * [function to generate a token]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @param  {Function} next [pass control to the next handler]
   * @return {[json]}     [success message that token has been created]
   */
  exports.middleware = function(req, res, next) {
    //check header, url parameters or post parameters for token
    var token = req.body.token || req.query.token ||
      req.headers['x-access-token'];

    if (token) {
      //verify secret and check exp
      jwt.verify(token, config.secretKey, function(err, decoded) {
        if (err) {
          return res.status(401).json({
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

  /**
   * [function to verify the status of a user]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @param  {Function} next [pass control to the next handler]
   * @return {[json]}     [allows only the admin entry]
   */
  exports.verifyAdmin = function(req, res, next) {
    //checking if the user is an admin
    if (req.params.username !== adminConfig.adminName) {
      res.status(403).json({
        success: false,
        message: 'Access Denied'
      });
    } else {
      next();
    }
  };

  /**
   * [function description]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @param  {Function} next [pass control to the next handler]
   * @return {[json]}        [message that permission has been denied]
   */
  exports.userAccess = function(req, res, next) {
    Documents.findOne({ '_id': req.params.id }, function(err, doc) {
      if (err) {
        res.send(err);
      } else if (!doc) {
        res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      } else {
        if (req.decoded._id !== doc.userId.toString() &&
          req.decoded.role !== adminConfig.role &&
          req.decoded.role !== doc.role.toString()) {
          res.status(403).json({
            message: 'Access Denied'
          });
        } else {
          next();
        }
      }
    });
  };

  /**
   * [function description]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @param  {Function} next [pass control to the next handler]
   * @return {[json]}        [message that permission has been denied]
   */
  exports.roleAccess = function(req, res, next) {
    //check if the role equals that of the superAdministrator
    if (req.body.title === adminConfig.role) {
      res.status(403).json({
        success: false,
        message: 'Access Denied'
      });
    } else {
      next();
    }
  };

  /**
   * [function description]
   * @param  {[http request object]} req [used to get the request query]
   * @param  {[http response object]} res [used to respond back to client ]
   * @param  {Function} next [pass control to the next handler]
   * @return {[json]}        [message that permission has been denied]
   */
  exports.roleAuth = function(req, res, next) {
    Role.findOne({ _id: req.params.id }, function(err, role) {
      console.log(role, 'role');

      if (err) {
        res.send(err);
      } else if (!role) {
        res.status(404).json({
          success: false,
          message: 'Role not found'
        });
      } else {
        if (role.title !== adminConfig.role) {
          res.status(403).json({
            success: false,
            message: 'Access Denied'
          });
        } else {
          next();
        }
      }
    });

  };


})();
