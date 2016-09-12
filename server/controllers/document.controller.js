(function () {
  'use strict';

  var User = require('./../models/user.js'),
  Role = require('./../models/role.js'),
  Document = require('./../models/document.js');

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
   * @param  {[JSON]} doc  [document object]
   * @return {[JSON]}       [Success Object]
   */
  function sendSuccess(res, msg, doc) {
    res.status(200).json({
      success: true,
      message: msg,
      doc: doc
    });
  }

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
            sendError(res, 404, 'Role not found. Create first', false);
          } else {
            //checks if user exists
            getUser(req, res);
            }
      });
  };
/**
 * [function to check if user exists]
 * @param  {[http request object]} req [used to get request query]
 * @param  {[http response object]} res [used to respond back to client]
 * @return {[void]}     [...]
 */
  function getUser(req, res) {
    User.findOne({
      _id: req.body.userId
    }, function(err, user) {
        if(err) {
          res.send(err);
          // if user is not found
        } else if(!user) {
          sendError(res, 404, 'User not found', false);
        } else {
          //check if document already exists
          getDocument(req, res);
          }
       });
  }
  /**
   * [function to check if user exists]
   * @param  {[http request object]} req [used to get request query]
   * @param  {[http response object]} res [used to respond back to client]
   * @return {[void]}     [...]
   */
  function getDocument(req, res) {
    Document.findOne({
      title: req.body.title
    }, function (err, doc) {
        if (err) {
          sendError(res, null, err, false);
          // if document is found
        } else if (doc) {
          sendError(res, 409, 'Document already exists', false);
          } else {
              //create new document
              createNewDoc(req).save(function (err, doc) {
                if (err) {
                  res.send(err);
                } else {
                  sendSuccess(res,
                     'Document successfully created', doc);
                }
              });
            }
       });
  }
/**
 * [function to create new document]
 * @param  {[http request object]} req [used to get request query]
 * @return {[json]}     [returns Document Object]
 */
  function createNewDoc(req) {
     var newDoc = new Document({
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId,
      role: req.body.role
     });

     return newDoc;
  }


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
        sendError(res, 404, 'No documents available', false);
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
        sendError(res, 404, 'Document not found', false);

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
    .limit(parseInt(req.param.limit))
    .exec(function (err, doc){
      if (err) {
        res.send(err);
      //if no document is found
      } else if (!doc) {
        sendError(res, 404, 'Role has no document', false);
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
  exports.getDocumentByTitle = function (req, res) {
    //find documents with a specific role
    Document.find({
      title: req.params.title
    })
    //parsing the limit
    .limit(parseInt(req.params.limit))
    .exec(function (err, doc) {
      if (err) {
        res.send(err);
        //if no document is found
      } else if (doc.length < 1) {
        sendError(res, 404, 'No documents found', false);
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
      userId: req.params.userId
    })
    //parsing the limit
    .limit(parseInt(req.params.limit))
    .exec(function (err, doc) {
      if (err) {
        res.send(err);
        //if no document is found
      } else if (doc.length < 1) {
        sendError(res, 404, 'User has no document', false);
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

  exports.getDocumentByDate = function(req, res) {
    Document.find({
      dateCreated: {
            $gte: new Date(req.params.from),
            $lt: new Date(req.params.to)
          }
    })
    //parsing the limit
    .limit(parseInt(req.params.limit))
    .exec(function (err, doc) {
      if (err) {
        res.send(err);
        //if no document is found
      } else if (doc.length < 1) {
        sendError(res, 404, 'No documents found', false);
      } else {
        res.status(200).json(doc);
      }
    });
  };

  exports.getDocumentByDescendingDate = function(req, res) {
    Document.find({
      dateCreated: {
            $gte: new Date(req.params.from),
            $lt: new Date(req.params.to)
          }
    })
    //parsing the limit
    .limit(parseInt(req.params.limit).sort({
      dateCreated: 'descending'
    }))
    .exec(function (err, doc) {
      if (err) {
        res.send(err);
        //if no document is found
      } else if (doc.length < 1) {
        sendError(res, 404, 'No documents found', false);
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
          sendError(res, null, 'Document update failed', false);
          //if no document is found
        } else if (!doc) {
            sendError(res, 404, 'Document not found', false);
        } else {
            sendSuccess(res, 'Document successfully updated', true);
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
        sendError(res, 404, 'Document not found', false);
      } else {
        sendSuccess(res, 'Document successfully deleted', true);
      }
    });
  };

 })();
