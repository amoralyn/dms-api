(function () {
  'use strict';

  var Role = require('./../models/role.js');

  /**
   * [funtion to return error message]
   * @param  {[http response object]} res  [used to respond back to client]
   * @param  {[Number]} code [status code]
   * @param  {[String]} msg  [error message]
   * @param  {[Boolean]} bool [success state]
   * @return {[JSON]}      [Error Object]
   */
  function sendError(res, code, msg, bool) {
    res.status(code).json({
      success: bool,
      message: msg
    });
  }

  /**
   * [function to return success message]
   * @param  {[http response object]} res   [used to respond back to client]
   * @param  {[String]} msg   [success message]
   * @return {[JSON]}       [Success Object]
   */
  function sendSuccess(res, msg) {
    res.status(200).json({
      success: true,
      message: msg,
    });
  }

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
          sendError(res, 409, 'Role already exists', false);
      } else {
        var newRole = new Role({
          title: req.body.title
        });
        //create new role
        newRole.save(function(err) {
          if (err) {
            res.send(err);
          } else {
              sendSuccess(res, 'Role successfully created', true);
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
    console.log('Man down');
    Role.find({}).exec(function (err, roles) {
      // console.log(roles, 'roles');
      if(err) {
        res.send(err);
        // if no role is found
      } else if (!roles) {
        sendError(res, 404, 'No roles exists yet', false);
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
        sendError(res, 404, 'Role not found', false);
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
          sendError(res, null, 'Role update failed', false);
          //if role is not found
        } else if (!role) {
          sendError(res, 404, 'Role not found', false);
        } else {
            sendSuccess(res, 'Role successfully updated', true);
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
        sendError(res, null, 'Role delete failed', false);
        //if role is not found
      } else if (!role) {
        sendError(res, 404, 'Role not found', false);
      } else {
        sendSuccess(res, 'Role successfully deleted', true);
      }
    });
  };
})();
