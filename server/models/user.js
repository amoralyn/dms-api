(function() {
  'use strict';

  var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

    var userSchema = new Schema({
      name : {
        firstName : {
          type: String,
          required: true,
          validate: {
            validator: function (firstName) {
              return /[A-Za-z]/.test(firstName);
            },
            message: "{VALUE} is not valid"
          }
        },
        lastName : {
          type: String,
          required: true,
          validate: {
            validator: function (lastName) {
              return /[A-Za-z]/.test(lastName);
            },
            message: "{VALUE} is not valid"
          }
        }
      },
      username : {
        type: String,
        required: true,
        validate: {
          validator: function(username) {
            return /\w/.test(username);
          },
          message: "{VALUE} is not valid"
        }
      },
      email : {
        type: String,
        required: true,
        validator: function(email) {
          return /\w/.test(email);
        },
        message: "{VALUE} is not valid"
      },
      password : {
        type: String,
        required: true,
        validator: function(password) {
          return /\w/.test(password);
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
        default: Date.now,
        required:true
      },
      updatedAt : {
        type: Date,
        default: Date.now,
        required:true
      }
    });

    userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
      return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) {
        return next(err);
      }

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });

  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };

  var User = mongoose.model('User', userSchema);
  module.exports = User;
})();
