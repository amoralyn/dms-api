(function () {
  'use strict';


  var jwt = require('jsonwebtoken'),
    expect = require('expect.js'),
    server = require('./../../server.js'),
    request = require('supertest'),
    user = require('./../../server/models/user.js'),
    role = require('./../../server/models/role.js'),
    config = require('./../../config/config.js'),
    userSeeder = require('./../../server/seeders/user.seeder.json'),
    roleSeeder = require('./../../server/seeders/role.seeder.json');
})();