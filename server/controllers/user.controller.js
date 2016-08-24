(function () {
  'use strict';


  var User = require('./../models/user.js'),
  Role = require('./../models/role.js'),
  Document = require('./../models/document.js'),
  helper = require('./../helper/helper'),
  config = require('./../../config/config'),
  jwt = require('jsonwebtoken');

/**
 * [function to login a valid user]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[json]}     [success message that user is logged in]
 */
  exports.login = function(req, res) {
    //check if user exists
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) {
        res.send(err);
        //if user is not found
      } else if (!user) {
        res.status(404).json({
          success: false,
          message: 'Authentication failed. user not found'
        });
      } else {
        //check if password matches
          if(helper.comparePassword(req.body.password, user.password)) {
            // if user was found and password matches
            // create a token
            var token = jwt.sign(user, config.secret, {
              expiresIn : 60*60*24
            });
            res.json({
              success: true,
              message: 'Successfully logged in',
              token: token,
              user: user
            });
          } else {
            res.status(404).json({
              success: false,
              message: 'Authentication failed. Wrong password'
            });
          }
      }
    });
  };

/**
 * [function to create a user]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[json]}     [success message that user has been created]
 */
  exports.createUser = function(req, res) {
    //checkif role exists
    Role.findOne({
      _id: req.body.role
    }, function(err, role) {
      if(err) {
        res.send(err);
        //if role does not exists
      } else if(!role) {
        res.status(400).json({
          success: false,
          message: 'Role not found. Create first'
        });
      } else {
        //check is user exists
        User.findOne({
          username: req.body.username
        }, function(err, user) {
          if(err) {
            res.send(err);
          } else if(user) {
            //if user is found
            res.status(409).json({
              success: false,
              message: 'user already exists'
            });
          } else {
            //ensuring all parameters are entered before creating user
              if (!req.body.firstName && !req.body.lastName) {
                res.status(406).json({
                  success: false,
                  message: 'Please enter your first name and last name'
                });
              } else if (!req.body.email) {
                res.status(406).json({
                  success: false,
                  message: 'Please enter your email'
                });
              } else if (!req.body.username) {
                res.status(406).json({
                  success: false,
                  message: 'Please enter your username'
                });
              } else if (!req.body.password) {
                res.status(406).json({
                  success: false,
                  message: 'Please enter your password'
                });
              } else if (!req.body.role) {
                res.status(406).json({
                  success: false,
                  message: 'Please enter a role'
                });
              } else {
                var newUser = new User({
                  name: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                  },
                  username: req.body.username,
                  email: req.body.email,
                  password: req.body.password,
                  role: req.body.role
                });
                //create new user
                newUser.save(function(err) {
                  if(err) {
                    res.send(err);
                  } else {
                    res.status(200).json({
                      success: true,
                      message: 'User successfully created'
                    });
                  }
                });
              }
          }
        });
      }
    });
  };

/**
 * [function to return all users]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[json]}     [all available users in the database]
 */
  exports.getAllUsers = function (req, res) {
    //search for all users
    User.find({}).exec(function (err, users) {
      if(err) {
        res.send(err);
        //if no user exists
      } else if (!users) {
        res.status(404).json({
          success: true,
          message: 'No Users exist yet.'
        });
        } else {
          res.status(200).send(users);
        }
    });
  };

/**
 * [function to get a user with a specific Id ]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[json]}     [user with specific Id]
 */
  exports.getUserById = function (req, res) {
    // find a user with a specific Id
    User.findById(req.params.id, function (err, user) {
      if(err) {
        res.send(err);
        //if user is not found
      } else if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.send(user);
      }
    });
  };

/**
 * [function to update a user]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[json]}     [success message that the user has been updated]
 */
  exports.updateUser = function (req, res) {
    req.body.name = {
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };
    //check if role exists
    Role.findOne({
      _id: req.body.role
    }, function(err, role) {
      if(err) {
        res.send(err);
        //if role doesn't exist
      } else if(!role) {
        res.status(404).json({
          success: false,
          message: 'Role does not exist'
        });
      } else {
        req.body.role = role;
        //find user with a specific Id and update its details
        User.findByIdAndUpdate(
          req.params.id, req.body,
          function (err, user) {
            if(err){
              res.send(err);
              //if user is not found
            } else if (!user) {
              res.status(404).json({
                success:false,
                message: 'User not found'
              });
            } else {
              res.status(200).json({
                success:true,
                message: 'User Successfully Updated!'
              });
            }
          });
      }
    });
  };

/**
 * [function to delete a user]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[json]}     [success message that user has deleted]
 */
  exports.deleteUser = function(req, res) {
    //find user with a specific Id and delete
    User.findByIdAndRemove(req.params.id, function(err, user) {
      if(err) {
        res.send(err);
        //if user is not found
      } else if (!user) {
        res.status(404).json({
          message: 'User not found'
        });
      } else {
        res.status(200).json({
          message: 'User deleted'
        });
      }
    });
  };

/**
 * [function to get a user by a document the user has]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[josn]}     [user with specific document]
 */
  exports.findUserByDoc = function (req, res) {
    //check if document exists
    Document.find({
      ownerId: req.params.id
    }, function (err, docs) {
      if(err){
        res.send(err);
        //if document is not found
      } else if (!docs) {
        res.status(404).json({
          success: false,
          message: 'Documents not found'
        });
      } else {
        res.status(200).json(docs);
      }
    });
  };

})();
