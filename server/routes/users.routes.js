(function () {
  'use strict';

  var userController = require('./../controllers/user.controller'),
    auth = require('./../middlewares/auth');

    function userRoutes(router) {

      //route to login a user

      router.route('/users/login')
        .post(userController.login);

      //route to create a new user
      router.route('/users')
        .post(userController.createUser);

      //route to get all available users
      router.route('/users')
        .get(auth.authMiddleware, userController.getAllUsers);

      //route to get, edit and delete a user specified by its Id
      router.route('/user/:id')
        .get(auth.authMiddleware, userController.getUserById)
        .put(auth.authMiddleware, userController.updateUser)
        .delete(auth.authMiddleware, userController.deleteUser);
    }

    module.exports = userRoutes;
})();
