(function() {
  'use strict';

  var bcrypt = require('bcrypt');

  exports.comparePassword = function(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  };

})();
