(function() {
  'use strict';


  var jwt = require('jsonwebtoken'),
    expect = require('expect.js'),
    server = require('./../../server.js'),
    app = require('./../../server.js'),
    request = require('supertest')(app),
    user = require('./../../server/models/user.js'),
    role = require('./../../server/models/role.js'),
    docs = require('./../../server/models/document.js'),
    config = require('./../../config/environment.js'),
    userSeeders = require('./../../server/seeders/user.seeder.json'),
    roleSeeders = require('./../../server/seeders/role.seeder.json'),
    docSeeders = require('./../../server/seeders/document.seeder.json');

  describe('Documents', function() {
    describe('Creating document(s)', function() {
      var userToken;
      beforeEach(function(done) {
        //creating a role using the content of the role seeder
        role.create(roleSeeders[1]).then(function(Role) {
          //creating a user using the content of the user seeder
          userSeeders[1].role = Role._id;
          user.create(userSeeders[1]).then(function(users) {
            //generating a token for the user created
            userToken = jwt.sign({
              _id: user._id,
              role: user.role
            }, config.secretKey, {
              expiresIn: 60 * 60 * 24
            });
            docSeeders[1].role = Role._id;
            docSeeders[1].userId = users._id;
            docSeeders[2].role = Role._id;
            docSeeders[2].userId = users._id;
            //creating a document using the content of the document seeder
            docs.create(docSeeders[1]).then(function() {}, function(err) {
              if (err) {
                console.log(err);
                done();
              }
            });
            done();
          }, function(err) {
            console.log(err);
            done();
          });
        }, function(err) {
          console.log(err);
          done();
        });
      });

      afterEach(function(done) {
        //deleting the document created
        docs.remove({}).exec(function() {
          //deleting the user created
          user.remove({}).exec(function() {
            //deleting the role created
            role.remove({}).exec(function(err) {
              if (err) {
                console.log(err);
              }
              done();
            });
          });
        });
      });

      it('creates unique documents', function(done) {
        request.post('/api/documents')
          .set('x-access-token', userToken)
          .send(docSeeders[1])
          .end(function(err, res) {
            expect(res.status).to.be(409);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Document already exists');
            done();
          });
      });

      it('should not create document for unauthenticated user', function(done) {
        request.post('/api/documents')
          .send(docSeeders[0])
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('No token provided');
            done();
          });
      });

      it('should not create doc without role', function(done) {
        request.post('/api/documents')
          .set('x-access-token', userToken)
          .send({
            title: docSeeders[1].title,
            content: docSeeders[1].content,
          })
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found. Create first');
          });
        done();
      });

      it('should create a new document', function(done) {
        request.post('/api/documents')
          .set('x-access-token', userToken)
          .send(docSeeders[2])
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Document successfully created');
            done();
          });
      });

    });

    describe('Performing CRUD operations', function() {
      var userToken,
        docRole,
        doc_user,
        docId,
        title,
        limit = 1;
      beforeEach(function(done) {
        //creating a role using the content of the role seeder
        role.create(roleSeeders[2]).then(function(Role) {
          //creating a user using the content of the user seeder
          userSeeders[2].role = Role._id;
          user.create(userSeeders[2]).then(function(users) {
            userToken = jwt.sign({
              id: users.id,
              role: users.role
            }, config.secretKey, {
              expiresIn: 60 * 60 * 24
            });

            //assigning the role and ownerId of docSeeders[2] to an Id
            docSeeders[2].role = Role._id;
            docSeeders[2].userId = users._id;

            //assigning the role and ownerId of docSeeders[0] to an Id
            docSeeders[0].userId = users._id;
            docSeeders[0].role = Role._id;

            docRole = Role._id;
            doc_user = users._id;
            //creating a document using the content of the document seeder
            docs.create(docSeeders[2]).then(function(doc) {
              docId = doc._id;
              title = doc.title;
              done();
            }, function(err) {
              if (err) {
                console.log(err);
                done();
              }
            });
          }, function(err) {
            console.log(err);
            done();
          });
        }, function(err) {
          console.log(err);
          done();
        });
      });

      afterEach(function(done) {
        //deleting the document created
        docs.remove({}).exec(function() {
          //deleting the user created
          user.remove({}).exec(function() {
            //deleting the role created
            role.remove({}).exec(function(err) {
              if (err) {
                console.log(err);
                done();
              }
              done();
            });
          });
        });
      });

      it('should return a limited amount of documents', function(done) {
        request.get('/api/documents?limit=' + limit)
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.eql(limit);
            expect(res.body[0].title).to.be('third');
            done();
          });
      });

      it('return all documents', function(done) {
        var newdoc = new docs(docSeeders[0]);
        newdoc.save();

        request.get('/api/documents/')
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.not.be(0);
            expect(res.body[0].title).to.be('first');
            expect(res.body[1].title).to.be('third');
            done();
          });
      });

      it('get documents by title', function(done) {
        request.get('/api/documents?q=' + title)
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body[0].title).to.be('third');
            done();
          });
      });


      it('get documents by role', function(done) {
        request.get('/api/documents?role=' + docRole)
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body[0].title).to.be('third');
            expect(res.body.length).to.not.be(0);
            done();
          });
      });

      it('get documents by user', function(done) {

        request.get('/api/user/' + doc_user + '/documents/')
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.not.be(0);
            expect(res.body[0].title).to.be('third');
            done();
          });
      });

      it('should verify user is valid', function(done) {
        var id = '568831c53ff90b4456491b50';
        request.get('/api/user/' + id + '/documents/')
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User has no document');
            done();
          });
      });

      it('should return documents by id', function(done) {
        request.get('/api/documents/' + docId)
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.not.be(0);
            expect(res.body.title).to.be('third');
            done();
          });
      });

      it('should verify documents Id is valid', function(done) {
        var id = '568831c53ff90b4456491b51';
        request.get('/api/documents/' + id)
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Document not found');
            done();
          });
      });

      it('should verify user token', function(done) {
        var fakeUserToken = '568831c53ff90b4456491b51';
        request.get('/api/documents/' + docId)
          .set('x-access-token', fakeUserToken)
          .end(function(err, res) {
            expect(res.status).to.be(401);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Failed to authenticate token');
            done();
          });
      });



      it('should update a document', function(done) {
        request.put('/api/documents/' + docId)
          .set('x-access-token', userToken)
          .send({
            title: 'New file',
            content: 'Updating a document',
          })
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Document successfully updated');

            done();
          });
      });

      it('only creator should edit documents', function(done) {
        var newUser = new user(userSeeders[0]);
        newUser.save();
        var newUserToken = jwt.sign({
          _id: newUser.id,
          role: newUser.role
        }, config.secretKey, {
          expiresIn: 60 * 60 * 24
        });
        request.put('/api/documents/' + docId)
          .set('x-access-token', newUserToken)
          .send({
            title: 'New file',
            content: 'Updating a document',
          })
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.message).to.eql('Access Denied');

            done();
          });
      });

      it('should not edit document without a valid id', function(done) {
        var id = '568831c53ff90b4456491b50';
        request.put('/api/documents/' + id)
          .set('x-access-token', userToken)
          .send({
            title: 'New file',
            content: 'Updating a document',
          })
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Document not found');

            done();
          });
      });

      it('should delete document by id', function(done) {
        request.delete('/api/documents/' + docId)
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Document successfully deleted');
            done();
          });
      });

      it('should not delete document with invalid id', function(done) {
        var id = '568831c53ff90b4456491b50';
        request.delete('/api/documents/' + id)
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.eql(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Document not found');
            done();
          });
      });

      it('should not allow new user delete document of a user', function(done) {
        var newUser = new user(userSeeders[0]);
        newUser.save();
        var newUserToken = jwt.sign({
          _id: newUser.id,
          role: newUser.role
        }, config.secretKey, {
          expiresIn: 60 * 60 * 24
        });
        request.delete('/api/documents/' + docId)
          .set('x-access-token', newUserToken)
          .end(function(err, res) {
            expect(res.status).to.eql(403);
            expect(res.body.message).to.eql('Access Denied');
            done();
          });
      });

    });

    describe('Search functions', function() {
      var userToken,
        createdAt,
        docId;
      beforeEach(function(done) {
        //creating a role using the content of the role seeder
        role.create(roleSeeders[1]).then(function(Role) {
          //creating a user using the content of the user seeder
          userSeeders[1].role = Role._id;
          user.create(userSeeders[1]).then(function(users) {
            //generating a token for the user created
            userToken = jwt.sign({
              _id: user._id,
              role: user.role
            }, config.secretKey, {
              expiresIn: 60 * 60 * 24
            });
            docSeeders[1].role = Role._id;
            docSeeders[1].userId = users._id;
            docSeeders[2].role = Role._id;
            docSeeders[2].userId = users._id;

            //creating a document using the content of the document seeder
            docs.create(docSeeders[1]).then(function(doc) {
              createdAt = doc.createdAt.toISOString();
            }, function(err) {
              if (err) {
                console.log(err);
                done();
              }
            });
            done();
          }, function(err) {
            console.log(err);
            done();
          });
        }, function(err) {
          console.log(err);
          done();
        });
      });

      afterEach(function(done) {
        //deleting the document created
        docs.remove({}).exec(function() {
          //deleting the user created
          user.remove({}).exec(function() {
            //deleting the role created
            role.remove({}).exec(function(err) {
              if (err) {
                console.log(err);
              }
              done();
            });
          });
        });
      });

      it('get documents can be searched within limits', function(done) {
        var limit = 10,
          offset = 1,
          newDoc1 = new docs(docSeeders[0]),
          newDoc2 = new docs(docSeeders[2]);
        newDoc1.save();
        newDoc2.save();

        request.get('/api/documents?limit=' + limit + '&offset=' + offset)
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body).not.to.be.empty();
            expect(res.body.length).to.be.within(0, limit);
            expect(res.body.length).to.be(2);
            done();
          });
      });

      it('get documents by date', function(done) {
        request.get('/api/documents?date=' + createdAt)
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body[0].createdAt);
            docId = res.body._id;
            done();
          });
      });



      it('get documents according to date created', function(done) {
        var newDoc = new docs(docSeeders[0]);
        newDoc.save();
        request.get('/api/documents')
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body[1].createdAt).to.be.above(res.body[0].createdAt[1]);
            done();
          });
      });
    });

  });
})();
