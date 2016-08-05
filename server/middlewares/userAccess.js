(function () {
  'use strict';

  var documents = require('./../models/document'),
    config = require('./../../config/adminConfig');

    exports.userAccess = function (req, res, next) {
      documents.findOne(req.params.id, function (err, doc) {
        if (err) {
          res.send(err);
        } else if (!doc) {
          res.status(404).json({
            success: false,
            message: 'Document not found'
          });
        } else {
          // console.log('here', req.decoded._doc._id);
          console.log(doc, 'doc body');
          console.log(req.decoded, 'request body');

          if (req.decoded._doc._id !== doc.userId.toString() &&
            req.decoded._doc.roleId !== config.role &&
            req.decoded._doc.roleId !== doc.roleId.toString()){
              res.status(403).json({
                success: false,
                message: 'Access Denied'
              });
            } else {
              next();
            }
        }
      });
    };
})();
