(function () {
  'use strict';


  var User = require('./../models/user.js'),
  Role = require('./../models/role.js'),
  Document = require('./../models/document.js');

  exports.createUser = function(req, res) {
    Role.findOne({
      _id: req.body.role
    }, function(err, role) {
      if(err) {
        res.send(err);
      } else if(!role) {
        res.status(400).json({
          success: false,
          message: 'Role not found'
        });
      } else {
        User.findOne({
          username: req.body.username
        }, function(err, user) {
          if(err) {
            res.send(err);
          } else if(user) {
            res.status(409).json({
              success: false,
              message: 'user already exists'
            });
          } else {
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
  exports.getAllUsers = function (req, res) {
    User.find({}).exec(function (err, users) {
      if(err) {
        res.send(err);
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
  exports.getAUser = function (req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if(err) {
        res.send(err);
      } else if(!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.status.send(user);
      }
    });
  };
  exports.getUserById = function (req, res) {
    User.findById(req.params.id, function (err, user) {
      if(err) {
        res.send(err);
      } else if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.status.send(user);
      }
    });
  };
  exports.updateUser = function (req, res) {
    req.body.name = {
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };
    Role.findOne({
      _id: req.body.role
    }, function(err, role) {
      if(err) {
        res.send(err);
      } else if(!role) {
        res.status(404).json({
          success: false,
          message: 'Role does not exist'
        });
      } else {
        req.body.role = role;
        User.findByIdAndUpdate(
          req.params.id, req.body,
          function (err, user) {
            if(err){
              res.send(err);
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
  exports.findUserByDoc = function (req, res) {
    Document.find({
      ownerId: req.params.id
    }, function (err, docs) {
      if(err){
        res.send(err);
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
