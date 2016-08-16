// (function () {
//   'use strict';
//
//
//   var jwt = require('jsonwebtoken'),
//     expect = require('expect.js'),
//     server = require('./../../server.js'),
//     request = require('supertest'),
//     user = require('./../../server/models/user.js'),
//     role = require('./../../server/models/role.js'),
//     config = require('./../../config/config.js'),
//     userName = require('./../../config/adminConfig.js').adminName,
//     userSeeder = require('./../../server/seeders/user.seeder.json'),
//     roleSeeder = require('./../../server/seeders/role.seeder.json');
//
//     describe('Users', function () {
//       describe('/POST: Validate user login', function () {
//         beforeEach(function(done) {
//           //create a new role using content of the role seeder
//           role.create(roleSeeder[1]).then(function(role) {
//             //create a new user using content of the user seeder
//             userSeeder[1].role = role._id;
//             user.create(userSeeder[1].then(function() {
//                 done();
//             }, function(err) {
//               console.log(err);
//               done();
//             });
//           },function(err) {
//             console.log(err);
//             done();
//           });
//         });
//
//         afterEach(function(done) {
//           //delete the user from the database
//           User.remove({}).exec(function() {
//          //delete role from the database
//             role.remove({}).exec(function(err) {
//               if (err) {
//                 console.log(err);
//               }
//               done();
//             });
//           });
//         });
//       });
//     });
// })();