(function () {
  'use strict';

  var Role = require('./../models/role.js');

/**
 * [function to create a role]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[json]}     [success messagethat role has been created]
 */
  exports.createRole = function(req, res) {
    //check if role already exists
    Role.findOne({
      title: req.body.title
    }, function(err, role) {
      if(err) {
        res.send(err);
        //if role exists
      } else if (role){
        res.status(409).json({
          success: false,
          message: "Role already exists"
        });
      } else {
        var newRole = new Role({
          title: req.body.title
        });
        //create new role
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

/**
 * [function to return all available roles]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[json]}     [all available roles in the database]
 */
  exports.getAllRoles = function (req, res) {
    //find all available roles
    Role.find({}).exec(function (err, roles) {
      if(err) {
        res.send(err);
        // if no role is found
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

  /**
   * [function to get a role with a specific Id]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http response object]} res [used to respond back to client]
   * @return {[json]}     [a role with specific Id]
   */
  exports.getRoleById = function (req, res) {
    //find a role with a specific Id
    Role.findById(req.params.id, function (err, role) {
      if(err) {
        res.send(err);
        // if role is not found
      } else if (!role) {
        res.status(404).json({
          success: false,
          message: "Role not found"
        });
      } else {
        res.send(role);
      }
    });
  };

  /**
   * [function to edit a role's details]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http response object]} res [used to respond back to client]
   * @return {[json]}     [success message that role has been updated]
   */
  exports.editRole = function (req, res) {
    //find a role with a specific id  and update
    Role.findByIdAndUpdate(
      req.params.id, req.body,
      function (err, role) {
        if(err){
          res.json({
            success: false,
            message: 'Role update failed'
          });
          //if role is not found
        } else if (!role) {
          res.status(404).json({
            success:false,
            message: 'Role not found'
          });
        } else {
          res.status(200).json({
            success:true,
            message: 'Role successfully updated'
          });
        }
      });
  };

  /**
   * [function to delete a role]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http respond object]} res [used to respond back to client]
   * @return {[json]}     [success message that role has been deleted]
   */
  exports.deleteRole = function (req, res) {
    //find a role with a specific id and delete
    Role.findById(req.params.id).remove(function (err, role) {
      if (err) {
        res.json({
          success: false,
          message: 'Role delete failed'
        });
        //if role is not found
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
