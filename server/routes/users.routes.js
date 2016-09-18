(function() {
  'use strict';

  var userController = require('./../controllers/user.controller'),
    auth = require('./../middlewares/auth');

  function userRoutes(router) {

    //route to login a user
    router.route('/users/login')
      .post(userController.login);

    //route to create a new user
    router.route('/user')
  .post(userController.createUser);

//route to get all available users
router.route('/users')
  .get(auth.middleware, userController.getAllUsers);

//route to get, edit and delete a user specified by its Id
router.route('/user/:id')
  .get(auth.middleware, userController.getUserById)
  .put(auth.middleware, userController.updateUser)
  .delete(auth.middleware, userController.deleteUser);
  }

  module.exports = userRoutes;
})();
