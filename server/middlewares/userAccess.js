(function () {
  'use strict';

  var documents = require('./../models/document'),
    config = require('./../../config/adminConfig');

    /**
     * [function description]
     * @param  {[http request object]} req [used to get the request query]
     * @param  {[http response object]} res [used to respond back to client ]
     * @param  {Function} next [pass control to the next handler]
     * @return {[json]}        [message that permission has been denied]
     */
    exports.userAccess = function (req, res, next) {
      documents.findOne( { '_id': req.params.id }, function (err, doc) {
        if (err) {
          res.send(err);
        } else if (!doc) {
          res.status(404).json({
            success: false,
            message: 'Document not found'
          });
        } else {
          console.log('here now', req.decoded._doc._id);
          if (req.decoded._doc._id !== doc.userId.toString() &&
            req.decoded._doc.role !== config.role &&
            req.decoded._doc.role !== doc.role.toString()){
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
