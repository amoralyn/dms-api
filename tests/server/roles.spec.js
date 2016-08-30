(function () {
  'use strict';


  var jwt = require('jsonwebtoken'),
    expect = require('expect.js'),
    server = require('./../../server.js'),
    server1 = require('./../../config/express').app,
    request = require('supertest')(server1),
    user = require('./../../server/models/user.js'),
    role = require('./../../server/models/role.js'),
    config = require('./../../config/config.js'),
    username = require('./../../config/adminConfig.js').adminName,
    userSeeders = require('./../../server/seeders/user.seeder.json'),
    roleSeeders = require('./../../server/seeders/role.seeder.json');

  describe('Roles', function() {
    describe('create role', function() {
      var roleId,
        superAdToken;
      beforeEach(function(done) {
        role.create(roleSeeders[0]).then(function(Role) {
          roleId = Role._id;
          userSeeders[0].role = Role._id;
          user.create(userSeeders[0]).then(function(users) {
            superAdToken = jwt.sign(users, config.secret, {
              expiresIn: 60*60*24
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
        user.remove({}).exec(function() {
          role.remove({}).exec(function(err) {
            if (err) {
              console.log(err);
              done();
            }
            console.log('Removed');
            done();
          });
        });
      });

      it('should deny access trying to create a SuperAdmin', function(done) {
        request.post('/api/role/superAdministrator/' + username)
          .set('x-access-token', superAdToken)
          .send({
            title: 'superAdministrator'
          })
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Access Denied');
            done();
          });
      });

      it('only SuperAdmin should create roles', function(done) {
        var fakeAd = 'fakeSuperAd';
        request.post('/api/role/superAdministrator/' + fakeAd)
          .set('x-access-token', superAdToken)
          .send({
            title: 'newrole'
          })
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Access Denied');
            done();
          });
      });


      it('should create role with valid username', function(done) {
        request.post('/api/role/superAdministrator/' + username)
          .set('x-access-token', superAdToken)
          .send(roleSeeders[2])
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Role successfully created');
            done();
          });
      });

      it('should create unique roles', function(done) {
        request.post('/api/role/superAdministrator/' + username)
          .set('x-access-token', superAdToken)
          .send(roleSeeders[0])
          .end(function(err, res) {
            expect(res.status).to.be(409);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role already exists');
            done();
          });
      });

      it('should get a specific role ', function(done) {
        request.get('/api/role/superAdministrator/' + roleId)
          .set('x-access-token', superAdToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(err).to.be(null);
            expect(res.body).to.not.be(undefined);
            expect(res.body.length).to.not.eql(0);
            done();
          });
      });

      it('should not get a role with invalid id', function(done) {
        var id = '56617723d2e4a33738e80e4b';
        request.get('/api/role/superAdministrator/' + id)
          .set('x-access-token', superAdToken)
          .end(function(err, res) {
            expect(res.body).to.not.be(undefined);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found');
            done();
          });
      });

      it('should update a role', function(done) {
        request.put('/api/role/superAdministrator/' + roleId)
          .set('x-access-token', superAdToken)
          .send({
            title: 'Director'
          })
          .end(function(err, res) {
            expect(res.status).to.eql(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Role successfully updated');
            done();
          });

        request.get('/api/role/superAdministrator/' + roleId)
          .set('x-access-token', superAdToken)
          .end(function(err, res) {
            expect(res.status).to.eql(200);
            expect(res.body.title).to.be('Administrator');
            done();
          });
      });

      it('should not allow an invalid user update a role', function(done) {
        var id = '56617723d2e4a33738e80e4b';
        request.put('/api/role/superAdministrator/' + id)
          .set('x-access-token', superAdToken)
          .send({
            title: 'Director'
          })
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found');
            done();
          });
      });

      it('should delete a role', function(done) {
        request.delete('/api/role/superAdministrator/' + roleId)
          .set('x-access-token', superAdToken)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('Role successfully deleted');

            request.get('/api/role/superAdministrator/' + roleId)
              .set('x-access-token', superAdToken)
              .end(function(err, res) {
                expect(res.status).to.be(404);
                expect(res.body.success).to.eql(false);
                expect(res.body.message).to.eql('Role not found');
                done();
              });
          });
      });

      it('should allow only superAdministrator delete a role', function(done) {
        var fakeAd = 'fakeSuperAd';
        request.delete('/api/role/superAdministrator/' + fakeAd + '/' + roleId)
          .set('x-access-token', superAdToken)
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Access Denied');
            done();
          });
      });
    });
  });
})();
