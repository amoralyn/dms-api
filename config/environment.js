(function() {
  'use strict';
  module.exports = {
    database: process.env.DATABASE_URL,
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY,
    salt: process.env.SALT_FACTOR
  };
})();
