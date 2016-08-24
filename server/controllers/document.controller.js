(function () {
  'use strict';

  var User = require('./../models/user.js'),
  Role = require('./../models/role.js'),
  Document = require('./../models/document.js');

/**
 * [function to create a document]
 * @param  {[http request object]} req [used to get the request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[json]}     [success message that document has been created]
 */
  exports.createDocument = function(req, res) {
    // checks if role exists
    Role.findOne({
      _id: req.body.role
    }, function(err, role) {
        if(err) {
          res.send(err);
          // if role is not found
        } else if(!role) {
            res.status(400).json({
              success: false,
              message: 'Role not found. Create first'
            });
          } else {
            //checks if user exists
            User.findOne({
              _id: req.body.userId
            }, function(err, user) {
                if(err) {
                  res.send(err);
                  // if user is not found
                } else if(!user) {
                  res.status(404).json({
                    success: false,
                    message: 'user not found'
                  });
                } else {
                  //check if document already exists
                  Document.findOne({
                    title: req.body.title
                  }, function (err, doc) {
                      if (err) {
                        res.json({
                          success: false,
                          message: err
                        });
                        // if document is found
                      } else if (doc) {
                          res.status(409).json({
                            success: false,
                            message: 'Document already exists'
                          });
                        } else {
                            var newDoc = new Document({
                              title: req.body.title,
                              content: req.body.content,
                              userId: req.body.userId,
                              role: req.body.role
                            });
                            //create new document
                            newDoc.save(function (err, doc) {
                              if (err) {
                                res.send(err);
                              } else {
                                res.status(200).json({
                                  success: true,
                                  message: 'Document successfully created',
                                  doc: doc
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

  /**
   * [function to return all available documents]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http response object]} res [used to respond back to client]
   * @return {[json]}     [all documents available in the database]
   */
  exports.getAllDocuments = function (req, res) {
    //find all available document(s)
    Document.find({})
    //parsing the limit
    .limit(parseInt(req.params.limit))
    .exec(function (err, docs) {
      if (err) {
        res.send(err);
        // if no document(s) exists
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

  /**
   * [function to get a document]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http response object]} res [used to respond back to client]
   * @return {[json]}     [document with a specific Id]
   */
  exports.getADocument = function (req, res) {
    // find a document with a specific id
    Document.findById(req.params.id, function (err, doc) {
      if (err) {
        res.send(err);
        //if no document is found
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

  /**
   * [function to get documents by its role]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http response object]} res [used to respond back to client]
   * @return {[json]}     [documents created by a specific role]
   */
  exports.getDocumentByRole = function (req, res) {
    //find documents with a specific role
    Document.find({
      role: req.params.role
    })
    //parsing the limit
    .limit(parseInt(req.params.limit))
    .exec(function (err, doc){
      if (err) {
        res.send(err);
      //if no document is found
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

  /**
   * [function to get documents of a specific user]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http response object]} res [used to respond back to client]
   * @return {[json]}     [documents created by a specific user]
   */
  exports.getDocumentByUser = function (req, res) {
    //find documents with a specific user
    Document.find({
      ownerId: req.params.ownerId
    })
    //parsing the limit
    .limit(parseInt(req.params.limit))
    .exec(function (err, doc) {
      if (err) {
        res.send(err);
        //if no document is found
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

  /**
   * [function to edit a document]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http response object]} res [used to respond back to client]
   * @return {[json]}     [success message that document has been edited]
   */
  exports.editDocument = function (req, res) {
    //find a document with a specific id and update
    Document.findByIdAndUpdate(
      req.params.id, req.body,
      function (err, doc) {
        if(err){
          res.json({
            success: false,
            message: 'Document update failed'
          });
          //if no document is found
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

  /**
   * [function to deletr a document]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http response object]} res [used to respond back to client]
   * @return {[json]}     [success message that document has been deleted ]
   */
  exports.deleteDocument = function (req, res) {
    //find a document with a specific id and delete it
    Document.findByIdAndRemove(req.params.id, function (err, doc) {
      if (err) {
        res.send(err);
        //if no document is found
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
