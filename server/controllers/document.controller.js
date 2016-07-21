(function () {
  'use strict';

  var User = require('./../models/user.js'),
  Role = require('./../models/role.js'),
  Document = require('./../models/document.js');

  exports.createDocument = function(req, res) {
    Role.findOne({
      _id: req.body.role
    }, function(err, role) {
        if(err) {
          res.send(err);
        } else if(!role) {
            res.status(400).json({
              success: false,
              message: 'Role not found'
            });
          } else {
            User.findOne({
              username: req.body.username
            }, function(err, user) {
                if(err) {
                  res.send(err);
                } else if(!user) {
                  res.status(404).json({
                    success: false,
                    message: 'user not found'
                  });
                } else {
                  Document.findOne({
                    title: req.body.title
                  }, function (err, doc) {
                      if (err) {
                        res.json({
                          success: false,
                          message: err
                        });
                      } else if (doc) {
                          res.status(409).json({
                            success: false,
                            message: 'Document already exists'
                          });
                        } else {
                            var newDoc = new Document({
                              title: req.body.title,
                              content: req.body.content,
                              ownerId: user.id,
                              role: role
                            });
                            newDoc.save(function (err) {
                              if (err) {
                                res.send(err);
                              } else {
                                res.status(200).json({
                                  success: true,
                                  message: 'Document successfully created'
                                });
                              }
                            });
                          }
                     });
                  }
               });
            }
      });
  };
  exports.getAllDocuments = function (req, res) {
    Document.find({})
    .limit(parseInt(req.params.limit))
    .exec(function (err, docs) {
      if (err) {
        res.send(err);
      } else if (!docs) {
        res.status(404).json({
          success: false,
          message: 'No documents available'
        });
      } else {
          res.status(200).json(docs);
      }
    });
  };
  exports.getADocument = function (req, res) {
    Document.findById(req.params.id, function (err, doc) {
      if (err) {
        res.send(err);
      } else if (!doc) {
        res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      } else {
        res.status(200).json(doc);
      }
    });
  };
  exports.getDocumentByRole = function (req, res) {
    Document.find({
      role: req.params.role
    })
    .limit(parseInt(req.params.limit))
    .exec(function (err, doc){
      if (err) {
        res.send(err);
      } else if (!doc) {
        res.status(404).json({
          success: false,
          message: 'Role has no document'
        });
      } else {
        res.status(200).json(doc);
      }
    });
  };
  exports.getDocumentByUser = function (req, res) {
    Document.find({
      ownerId: req.params.ownerId
    })
    .limit(parseInt(req.params.limit))
    .exec(function (err, doc) {
      if (err) {
        res.send(err);
      } else if (doc.length < 1) {
        res.status(404).json({
          success: false,
          message: 'User has no document'
        });
      } else {
        res.status(200).json(doc);
      }
    });
  };
  exports.editDocument = function (req, res) {
    Document.findByIdAndUpdate(
      req.params.id, req.body,
      function (err, doc) {
        if(err){
          res.json({
            success: false,
            message: 'Document update failed'
          });
        } else if (!doc) {
          res.status(404).json({
            success:false,
            message: 'Document not found'
          });
        } else {
          res.status(200).json({
            success:true,
            message: 'Document successfully Updated!'
          });
        }
      });
  };
  exports.deleteDocument = function (req, res) {
    Document.findByIdAndDelete(req.params.id, function (err, doc) {
      if (err) {
        res.send(err);
      } else if (!doc) {
          res.status(404).json({
            success: false,
            message: 'Document not found'
          });
      } else {
        res.status(200).json({
          success: true,
          message: 'Document successfully deleted'
        });
      }
    });
  };
})();
