(function () {
  'use strict';

  var Role = require('./../models/role.js');

  exports.createRole = function(req, res) {
    Role.findOne({
      title: req.body.title
    }, function(err, role) {
      if(err) {
        res.send(err);
      } else if (role){
        res.status(409).json({
          success: false,
          message: "Role already exists"
        });
      } else {
        var newRole = new Role({
          title: req.body.title
        });
        console.log(newRole);
        newRole.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.status(200).json({
              success: true,
              message: 'Role successfully created!'
            });
          }
        });
      }
    });
  };

  exports.getAllRoles = function (req, res) {
    Role.find({}).exec(function (err, roles) {
      if(err) {
        res.send(err);
      } else if (!roles) {
        res.status(404).json({
          success: true,
          message: "No Roles exist yet."
        });
        } else {
          res.status(200).send(roles);
        }
    });
  };
  exports.getRoleById = function (req, res) {
    User.findById(req.params.id, function (err, role) {
      if(err) {
        res.send(err);
      } else if (!role) {
        res.status(404).json({
          success: false,
          message: "Role not found"
        });
      } else {
        res.status.send(role);
      }
    });
  };
  exports.editRole = function (req, res) {
    Role.findByIdAndUpdate(
      req.params.id, req.body,
      function (err, role) {
        if(err){
          res.json({
            success: false,
            message: 'Role update failed'
          });
        } else if (!role) {
          res.status(404).json({
            success:false,
            message: 'Role not found'
          });
        } else {
          res.status(200).json({
            success:true,
            message: 'Role successfully Updated!'
          });
        }
      });
  };
  exports.deleteRole = function (req, res) {
    Role.findById(req.params.id).remove(function (err, role) {
      if (err) {
        res.json({
          success: false,
          message: 'Role delete failed'
        });
      } else if (!role) {
        res.status(404).json({
          success:false,
          message: 'Role not found'
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Role successfully deleted'
        });
      }
    });
  };
})();
