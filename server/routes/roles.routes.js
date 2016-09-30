(function () {
  'use strict';

  var roleController = require('./../controllers/role.controller'),
    auth = require('./../middlewares/auth');

    function roleRoutes(router) {


      //route to get, edit and delete a role with a specific Id
      router.route('/role/superAdministrator/:id')
        .get(roleController.getRoleById)
        .put(roleController.editRole)
        .delete(roleController.deleteRole);

        //route to create and return all available role(s)
        router.route('/role/superAdministrator/username/:username')
          .post(auth.verifyAdmin, auth.roleAccess,
            roleController.createRole)
          .get(auth.verifyAdmin, roleController.getAllRoles);

    }

    module.exports = roleRoutes;
})();
