(function() {
  'use strict';

  var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var roleSchema = new Schema({
    title : {
      type: String,
      required: true,
      validate: {
        validator: function(title) {
          return /[A-Za-z]/.test(title);
        },
        message: "{VALUE} is not valid"
      }
    },
    createdAt : {
      type: Date,
      default: Date.now,
      required:true
    },
    updatedAt : {
      type: Date,
      default: Date.now,
      required:true
    }
  });

  var Role = mongoose.model('Role', roleSchema);
  module.exports = Role;
  })();
