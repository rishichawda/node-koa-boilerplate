const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userschema = new schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

userschema.pre('save', function (next) { 
    var user = this;

    bcrypt.genSalt(10, (err, salt) => {
        if(err) { next(err); }

        bcrypt.hash(user.password, salt, null, function (err, hash) { 
            if(err) { next(err); }

            user.password = hash;
            next();
         })
    })
 });

 userschema.methods.compare_password = function (password, callback) { 
     bcrypt.compare(password, this.password, function (err, isMatch) { 
         if(err) { return callback(err); }
         callback(null, isMatch);
      })
  }

const model = mongoose.model('user', userschema);

module.exports = model;
