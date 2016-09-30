(function() {
  'use strict';

  var documentController = require('./../controllers/document.controller'),
    auth = require('./../middlewares/auth');

  function documentRoutes(router) {

    //route to create a new document
    router.route('/documents')
      .post(auth.middleware, documentController.createDocument)
      .get(auth.middleware, documentController.getAllDocuments);

    //route to get all documents of a specific user
    router.route('/user/:userId/documents')
      .get(auth.middleware, documentController.getDocumentByUser);

    //route to get a document by its Id
    router.route('/documents/:id')
      .get(auth.middleware, documentController.getADocument)
      .put(auth.middleware, auth.userAccess,
        documentController.editDocument)
      .delete(auth.middleware, auth.userAccess,
        documentController.deleteDocument);

    //   router.route('/document/:role')
    //     .get(auth.middleware, documentController.getDocumentByRole)
  }
  module.exports = documentRoutes;
})();
