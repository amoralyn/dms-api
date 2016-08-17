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
    userSeeders = require('./../../server/seeders/user.seeder.json'),
    roleSeeders = require('./../../server/seeders/role.seeder.json');

describe('users', function() {
  describe('/POST: Validate user login', function() {

    beforeEach(function(done) {
      //create a new role using content of the role seeder
      role.create(roleSeeders[2]).then(function(Role) {
        //create a new user using content of the user seeder
        userSeeders[2].role = Role._id;
        user.create(userSeeders[2]).then(function() {
          done();
        }, function(err) {
          console.log(err);
          // done();
        });
      }, function(err) {
        console.log(err);
        // done();
      });
    });

    afterEach(function(done) {
      //delete the user from the database
      user.remove({}).exec(function() {
        //delete role from the database
        role.remove({}).exec(function(err) {
          if (err) {
            console.log(err);
          }
          done();
        });
      });
    });

    it('should connect to root', function(done) {
      //console.log(request.get());
      request.get('/')
        .end(function(err, res) {
          expect(res.status).to.be(200);
          done();

        });
    });

    it('verifies that user logs in with correct password', function(done) {
      request.post('/api/users/login')
        .send({
          username: userSeeders[2].username,
          password: 'me'
        })
        .expect(404)
        .end(function(err, res) {
          expect(res.status).to.be(404);
          console.log(res.body.success, 'yass');
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal
            ('Authentication failed. Wrong password');
          done();
        });
    });

    it('verifies that user logs in with correct userName', function(done) {
      request.post('/api/users/login')
        .send({
          username: 'myName',
          password: userSeeders[2].password
        })
        .expect(404)
        .end(function(err, res) {
          expect(res.status).to.be(404);
          expect(res.body.success).to.eql(false);
          expect(res.body.message).to.eql
            ('Authentication failed. user not found');
          done();
        });
    });

    it('should login new users', function(done) {
      request.post('/api/users/login')
        .send({
          username: userSeeders[2].username,
          password: userSeeders[2].password
        })
        .expect(200)
        .end(function(err, res) {
          expect(res.status).to.be(200);
          expect(res.body.success).to.eql(true);
          expect(res.body.message).to.eql('Successfully logged in');
          expect(res.body.message).to.not.be.empty();
          done();
        });
    });
  });

    describe('/POST: Create new users', function() {
      beforeEach(function(done) {
        //create a new role using content of the role seeder
        role.create(roleSeeders[1]).then(function(Role) {
          userSeeders[1].role = Role._id;
          //create a new user using content of the user seeder
          user.create(userSeeders[1]).then(function() {
            done();
          }, function(err) {
            console.log(err);
            // done();
          });
        }, function(err) {
          console.log(err);
          // done();
        });
      });

      afterEach(function(done) {
        //delete user from the database
        user.remove({}).exec(function() {
          //delete roles from the database
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

      // it('create a new user', function(done) {
      //   userSeeders[0].role = 'Administrator';
      //   request.post('/api/users')
      //     .send({
      //       firstName: userSeeders[0].name.firstName,
      //       lastName: userSeeders[0].name.lastName,
      //       username: userSeeders[0].username,
      //       password: userSeeders[0].password,
      //       email: userSeeders[0].email,
      //       role: userSeeders[0].role
      //     })
      //     .expect(200)
      //     .end(function(err, res) {
      //       console.log(res.status, 'yass');
      //       expect(res.status).to.be(200);
      //       expect(res.body.success).to.eql(true);
      //       expect(res.body.message).to.eql('user Successfully created!');
      //       done();
      //     });
      // });

      it('Does not create a user without a valid role', function(done) {
        request.post('/api/users')
          .send({
            firstName: userSeeders[1].name.firstName,
            lastName: userSeeders[1].name.lastName,
            userName: userSeeders[1].userName,
            password: userSeeders[1].password,
            email: userSeeders[1].email,
            role: 'Owner'
          })
          .expect(400)
          .end(function(err, res) {
            expect(res.status).to.be(400);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found. Create first');
            done();
          });
      });

      it('Does not create a user without a role', function(done) {
        request.post('/api/users')
          .send({
            firstName: userSeeders[1].name.firstName,
            lastName: userSeeders[1].name.lastName,
            userName: userSeeders[1].userName,
            password: userSeeders[1].password,
            email: userSeeders[1].email,
          })
          .expect(400)
          .end(function(err, res) {
            expect(res.status).to.be(400);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found. Create first');
            done();
          });
      });

      it('creates unique users', function(done) {
        userSeeders[1].roleId = 'Administrator';
        request.post('/api/users/')
          .send({
            firstName: userSeeders[1].name.firstName,
            lastName: userSeeders[1].name.lastName,
            username: userSeeders[1].username,
            password: userSeeders[1].password,
            email: userSeeders[1].email,
            role: userSeeders[1].roleId
          })
          .expect(409)
          .end(function(err, res) {
            expect(res.status).to.be(409);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('user already exists!');
            done();
          });
      });
    //
      // it('checks for firstName and lastName before creating', function(done) {
      //   userSeeders[2].role = 'Supervisor';
      //   request.post('/api/users')
      //     .send({
      //       username: userSeeders[2].username,
      //       password: userSeeders[2].password,
      //       email: userSeeders[2].email,
      //       roleId: userSeeders[2].role
      //     })
      //     .expect(406)
      //     .end(function(err, res) {
      //       expect(res.status).to.be(406);
      //       expect(res.body.success).to.eql(false);
      //       expect(res.body.message).to.eql
      //         ('Please enter your firstName and lastName');
      //       done();
      //     });
      // });
    });

  });
})();