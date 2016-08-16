(function() {
  'use strict';

  var bcrypt = require('bcrypt');

/**
 * [function to encrypt a password and compare it with another ]
 * @param  {[String]} password     [password to be compared with]
 * @param  {[String]} hashPassword [encrypted password to be decrypted]
 * @return {[boolean]}              [if passwords match or not]
 */
  exports.comparePassword = function(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  };

})();
