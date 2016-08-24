(function() {
  'use strict';

  var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

  var documentSchema = new Schema({
    userId : {
      type: ObjectId,
      ref: 'User'
    },
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
    content : {
      type: String,
      required: true,
      validator: function(content) {
        return /\w/.test(content);
      },
      message: "{VALUE} is not valid"
    },
    role: {
      type: ObjectId,
      ref: 'Role',
      required: true
    },
    createdAt : {
      type: Date,
      default: Date.now
    },
    updatedAt : {
      type: Date,
      default: Date.now
    }
  });

  var Document = mongoose.model('Document', documentSchema);
  module.exports = Document;

})();
