(function() {
  'use strict';

  var jwt = require('jsonwebtoken'),
    expect = require('expect.js'),
    server = require('./../../server.js'),
    app = require('./../../config/express'),
    request = require('supertest')(app),
    user = require('./../../server/models/user.js'),
    role = require('./../../server/models/role.js'),
    docs = require('./../../server/models/document.js'),
    config = require('./../../config/config.js'),
    userSeeders = require('./../../server/seeders/user.seeder.json'),
    roleSeeders = require('./../../server/seeders/role.seeder.json'),
    docSeeders = require('./../../server/seeders/document.seeder.json');


  describe('Search', function() {
    describe('Search functions', function() {
      var userToken,
        createdAt,
        doc_date,
        doc_id;
      beforeEach(function(done) {
        //creating a role using the content of the role seeder
        role.create(roleSeeders[1]).then(function(Role) {
          //creating a user using the content of the user seeder
          userSeeders[1].role = Role._id;
          user.create(userSeeders[1]).then(function(users) {
            //generating a token for the user created
            userToken = jwt.sign(users, config.secret, {
              expiresIn: 60*60*24
            });
            docSeeders[1].role = Role._id;
            docSeeders[1].userId = users._id;
            docSeeders[2].role = Role._id;
            docSeeders[2].userId = users._id;

            //creating a document using the content of the document seeder
            docs.create(docSeeders[1]).then(function(doc) {
              createdAt= doc.createdAt;
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

      it('Documents can be searched within limits', function(done) {
        var limit = 10,
         offset = 10,
         newDoc1 = new docs(docSeeders[0]),
         newDoc2 = new docs(docSeeders[2]);
         newDoc1.save();
         newDoc2.save();
         request.get('/api/documents?limit=' + limit + '&after=' + offset )
          .set('x-access-token', userToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body).not.to.be.empty();
            expect(res.body.length).to.be.within(0, limit);
            done();
          });
        });

        it('Documents can be searched by date', function(done) {
            request.get('/api/documents?createdAt'+ createdAt )
            .set('x-access-token', userToken)
            .end(function(err, res) {
              expect(res.status).to.be(200);
              expect(res.body[0].createdAt);
              doc_id = res.body._id;
              done();
            });
          });


      it('Documents can be searched by title', function(done) {
        var doc_title = 'second';
        request.get('/api/documents?title=' + doc_title)
        .set('x-access-token', userToken)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          expect(res.body[0].title).to.be('second');
          done();
        });
      });


      it('Documents can be searched by role.', function(done) {
        var doc_role = 'Supervisor',
        limit = 1;
        request.get('/api/documents?role=' + doc_role + limit)
        .set('x-access-token', userToken)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          expect(res.body.length).to.eql(1);
          done();
        });
      });
    });
  });
})();