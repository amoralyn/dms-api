(function () {
  'use strict';


  var jwt = require('jsonwebtoken'),
    expect = require('expect.js'),
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
        });
      }, function(err) {
        console.log(err);
        done();
      });
    });

    afterEach(function(done) {
      //delete the user from the database
      user.remove({}).exec(function() {
        //delete role from the database
        role.remove({}).exec(function(err) {
          if (err) {
            console.log(err);
            done();
          }
          done();
        });
      });
    });

    it('should connect to root', function(done) {
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
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal
            ('Authentication failed. Wrong password');
          done();
        });
    });

    it('verifies that user logs in with correct username', function(done) {
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
            ('Authentication failed. User not found');
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
          userSeeders[0].role = Role._id;
          userSeeders[1].role = Role._id;
          //create a new user using content of the user seeder
          user.create(userSeeders[1]).then(function() {
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

      it('create a new user', function(done) {
        request.post('/api/user')
          .send({
            firstName: userSeeders[0].name.firstName,
            lastName: userSeeders[0].name.lastName,
            username: userSeeders[0].username,
            password: userSeeders[0].password,
            email: userSeeders[0].email,
            role: userSeeders[0].role
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('User successfully created');
            done();
          });
      });

      it('Does not create a user without a valid role', function(done) {
        request.post('/api/user')
          .send({
            firstName: userSeeders[1].name.firstName,
            lastName: userSeeders[1].name.lastName,
            username: userSeeders[1].username,
            password: userSeeders[1].password,
            email: userSeeders[1].email,
            roleId: 'Owner'
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found. Create first');
            done();
          });
      });

      it('Does not create a user without a role', function(done) {
        request.post('/api/user')
          .send({
            firstName: userSeeders[1].name.firstName,
            lastName: userSeeders[1].name.lastName,
            username: userSeeders[1].username,
            password: userSeeders[1].password,
            email: userSeeders[1].email,
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('Role not found. Create first');
            done();
          });
      });

      it('creates unique users', function(done) {
        request.post('/api/user/')
          .send({
            firstName: userSeeders[1].name.firstName,
            lastName: userSeeders[1].name.lastName,
            username: userSeeders[1].username,
            password: userSeeders[1].password,
            email: userSeeders[1].email,
            role: userSeeders[1].role
          })
          .expect(409)
          .end(function(err, res) {
            expect(res.status).to.be(409);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User already exists');
            done();
          });
      });

      it('checks for firstName and lastName before creating', function(done) {
        request.post('/api/user')
          .send({
            username: userSeeders[0].username,
            password: userSeeders[0].password,
            email: userSeeders[0].email,
            role: userSeeders[0].role
          })
          .expect(406)
          .end(function(err, res) {
            expect(res.status).to.be(406);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql
              ('Please enter your first name and last name');
            done();
          });
      });
    });

    describe('/GET: Get all users', function() {
      var userId,
        userToken;

      beforeEach(function(done) {
        //create a new role using content of the role seeder
        role.create(roleSeeders[2]).then(function(Role) {
          userSeeders[2].role = Role._id;
          //create a new user using content of the user seeder
          user.create(userSeeders[2]).then(function(users) {
            userToken = jwt.sign(users, config.secret, {
              expiresIn: 60*60*24
            });
            userId = users._id;
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
        //delete roles from the databse
        user.remove({}).exec(function() {
          //delete users from database
          role.remove({}).exec(function(err) {
            if (err) {
              console.log(err);
              done();
            }
            done();
          });
        });
      });

      it('should return a user when id is specified', function(done) {
        request.get('/api/user/' + userId)
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).not.to.be(0);
            expect(res.body.username).to.be('Kenny');
            expect(res.body.email).to.be('kenny@gmail.com');
            done();
          });
      });

      it('returns all the available users in the database', function(done) {
        request.get('/api/users/')
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.length).to.not.be(0);
            expect(res.body[0].username).to.be('Kenny');
            expect(res.body[0].email).to.be('kenny@gmail.com');
            done();
          });
      });

      it('return no user when invalid id is specified', function(done) {
        var id = '56617723d2e4a33738e80e4b';
        request.get('/api/user/' + id)
          .set('x-access-token', userToken)
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User not found');
            done();
          });
      });

      it('should not return a user unless authenticated', function(done) {
        request.get('/api/user/' + userId)
          .expect(403)
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('No token provided');
            done();
          });
      });

    });

    describe('Update Users', function() {
      var userId,
        userToken;

      beforeEach(function(done) {
        //create a new role using content of the role seeder
        role.create(roleSeeders[2]).then(function(Role) {
          userSeeders[2].role = Role._id;
          //create a new user using content of the user seeder
          user.create(userSeeders[2]).then(function(users) {
            userToken = jwt.sign(users, config.secret, {
              expiresIn: 60*60*24
            });
            userId = users._id;
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
        //delete user from the database
        user.remove({}).exec(function() {
          //delete role from the database
          role.remove({}).exec(function(err) {
            if (err) {
              console.log(err);
              done();
            }
            done();
          });
        });
      });

      it('update only authenticated users', function(done) {
        request.put('/api/user/' + userId)
          .send({
            username: 'Kendulala',
            name: {
              firstName: 'Kehinde',
              lastName: 'Oni',
            },
            email: 'kendul@gmail.com',
            password: 'mine',
            role: userSeeders[2].role
          })
          .expect(403)
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.equal('No token provided');
            done();
          });
      });

      it('update user with valid id', function(done) {
        request.put('/api/user/' + userId)
          .set('x-access-token', userToken)
          .send({
            username: 'Kendulala',
            name: {
              firstName: 'Kehinde',
              lastName: 'Oni',
            },
            email: 'kendul@gmail.com',
            password: 'mine',
            role: userSeeders[2].role
          }).expect(200).end(function(err, res) {
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('User successfully updated');
            done();
          });
      });

      it('update only user with valid role', function(done) {
        request.put('/api/user/' + userId)
          .set('x-access-token', userToken)
          .send({
            username: 'Kendulala',
            name: {
              firstName: 'Kehinde',
              lastName: 'Oni',
            },
            email: 'kendul@gmail.com',
            password: 'mine',
            role: userSeeders[2].role
          })
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql
              ('User successfully updated');
            done();
          });
      });

      it('not update user without a valid role', function(done) {
        request.put('/api/user/' + userId)
          .set('x-access-token', userToken)
          .send({
            username: 'Kendulala',
            name: {
              firstName: 'Kehinde',
              lastName: 'Oni',
            },
            email: 'kendul@gmail.com',
            password: 'mine',
            role: '56617723d2e4a33738e80e4b'
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql
              ('Role does not exist');
            done();
          });
      });

      it('does not update user with invalid id', function(done) {
        var id = '56617723d2e4a33738e80e4b';
        request.put('/api/user/' + id)
          .set('x-access-token', userToken)
          .send({
            username: 'Kendulala',
            name: {
              firstName: 'Kehinde',
              lastName: 'Oni',
            },
            email: 'kendul@gmail.com',
            password: 'mine',
            role: userSeeders[2].role
          })
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User not found');
            done();
          });
      });
    });

    describe('Delete users', function() {
      var userId,
        userToken;

      beforeEach(function(done) {
        //create a new role using content of the role seeder
        role.create(roleSeeders[2]).then(function(Role) {
          userSeeders[2].role = Role._id;
          //create a new user using content of the user seeder
          user.create(userSeeders[2]).then(function(users) {
            userToken = jwt.sign(users, config.secret, {
              expiresIn: 60*60*24
            });
            userId = users._id;
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
        //delete user from the database
        user.remove({}).exec(function() {
          //delete role from the database
          role.remove({}).exec(function(err) {
            if (err) {
              console.log(err);
              done();
            }
            done();
          });
        });
      });

      it('delete authenticated users', function(done) {
        request.delete('/api/user/' + userId)
          .expect(403)
          .end(function(err, res) {
            expect(res.status).to.be(403);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('No token provided');
            done();
          });
      });

      it('does not delete users with invalid id', function(done) {
        var id = '56617723d2e4a33738e80e4b';
        request.delete('/api/user/' + id)
          .set('x-access-token', userToken)
          .expect(404)
          .end(function(err, res) {
            expect(res.status).to.be(404);
            expect(res.body.success).to.eql(false);
            expect(res.body.message).to.eql('User not found');
            done();
          });
      });

      it('deletes valid users', function(done) {
        request.delete('/api/user/' + userId)
          .set('x-access-token', userToken)
          .expect(200)
          .end(function(err, res) {
            expect(res.status).to.be(200);
            expect(res.body.success).to.eql(true);
            expect(res.body.message).to.eql('User deleted');
            done();
          });
      });
    });

  });
})();