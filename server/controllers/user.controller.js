(function () {
  'use strict';


  var User = require('./../models/user.js'),
    Role = require('./../models/role.js'),
    Document = require('./../models/document.js'),
    helper = require('./../helper/helper'),
    config = require('./../../config/config'),
    jwt = require('jsonwebtoken');

  function sendError(res, code, msg, bool) {
    res.status(code).json({
      success: bool,
      message: msg
    });
  }

  function sendSuccess(res, msg, token, user) {
    res.status(200).json({
      success: true,
      message: msg,
      token: token,
      user: user
    });
  }


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
        sendError(res, 404, 'Authentication failed. User not found', false);

      } else {
        //check if password matches
          if(helper.comparePassword(req.body.password, user.password)) {
            // if user was found and password matches
            // create a token
            var token = jwt.sign(user, config.secret, {
              expiresIn : 60*60*24
            });
            sendSuccess(res, 'Successfully logged in', true, token, user);
          } else {
            sendError(res, 404, 'Authentication failed. Wrong password', false);
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
        sendError(res, 404, 'Role not found. Create first', false);
      } else {
        //check is user exists
        getUser(req, res);
      }
    });
  };

  function getUser(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if(err) {
        res.send(err);
      } else if(user) {
        //if user is found
        sendError(res, 409, 'user already exists', false);
      } else {
        //ensuring all parameters are entered before creating user
          if (!req.body.firstName && !req.body.lastName) {
            sendError(res, 406,
              'Please enter your first name and last name', false);
          } else if (!req.body.email) {
            sendError(res, 406, 'Please enter your email', false);
          } else if (!req.body.username) {
            sendError(res, 406, 'Please enter your username', false);
          } else if (!req.body.password) {
            sendError(res, 406, 'Please enter your password', false);
          } else if (!req.body.role) {
            sendError(res, 406, 'Please enter a role',false);
          } else {
            //create new user
            createNewUser(req).save(function(err) {
              if(err) {
                res.send(err);
              } else {
                sendSuccess(res, 'User successfully created', true);
              }
            });
          }
      }
    });
  }

/**
 * [createNewUser description]
 * @param  {[http request object]} req [used to get request query]
 * @return {[json]}     [returns User Object]
 */
function createNewUser(req) {
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

  return newUser;
}
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
        sendError(res, 404, 'No Users exist yet', false);
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
        sendError(res, 404, 'User not found', false);
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
        sendError(res, 404, 'Role does not exist', false);
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
              sendError(res, 404, 'User not found', false);
            } else {
              sendSuccess(res, 'User successfully updated', true);
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
        sendError(res, 404, 'User not found', false);
      } else {
        sendSuccess(res, 'User deleted', true);
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
        sendError(res, 404, 'Documents not found', false);
      } else {
        res.status(200).json(docs);
      }
    });
  };

})();
