(function() {
  'use strict';

  module.exports = function(mongoose, db) {
    mongoose.connect(db);
    // If the connection throws an error
    mongoose.connection.on('error', function(err) {
      console.log('Error connecting to the database:' + err);
    });
    //When successfully connected
    mongoose.connection.on('connected', function() {
      console.log('Connected to the database');
    });
    // When the connection is disconnected
    mongoose.connection.on('disconnected', function() {
      console.log('Disconnected from the database');
    });
    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function() {
      mongoose.connection.close(function() {
        console.log('Disconnected from the database through termination');
        process.exit(0);
      });
    });
  }
})();
