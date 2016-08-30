
(function () {
  'use strict';

  var documentController = require('./../controllers/document.controller'),
    auth = require('./../middlewares/auth'),
    userAccess = require('./../middlewares/userAccess');

    function documentRoutes(router) {

      //route to create a new document
      router.route('/documents')
        .post(auth.authMiddleware, documentController.createDocument);

      //route to get all documents
      router.route('/documents')
        .get(auth.authMiddleware, documentController.getAllDocuments);

      //route to get all documents with a specified limit
      router.route('/documents?limit:limit')
        .get(auth.authMiddleware, documentController.getAllDocuments);

      //route to get all documents with a specific role
      router.route('/documents/role/:role/:limit')
        .get(auth.authMiddleware, documentController.getDocumentByRole);

      //route to get all documents of a specific user
      router.route('/user/:userId/documents')
        .get(auth.authMiddleware, documentController.getDocumentByUser);

      //route to get a document by its Id
      router.route('/documents/:id')
        .get(auth.authMiddleware, documentController.getADocument);

      //route to edit and delete a documet with a specific Id
      router.route('/documents/:id')
        .put(auth.authMiddleware, userAccess.userAccess,
          documentController.editDocument)
        .delete(auth.authMiddleware, userAccess.userAccess,
          documentController.deleteDocument);

    }

    module.exports = documentRoutes;
})();
