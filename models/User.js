const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const schema = mongoose.Schema;

const userSchema = new schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

userSchema.pre('save', function (next) { 
    var user = this;

    bcrypt.genSalt(process.env.BCRYPT_SALT_ROUNDS, (err, salt) => {
        if(err) { next(err); }
        bcrypt.hash(user.password, salt, null, function (err, hash) { 
            if(err) { next(err); }

            user.password = hash;
            next();
         })
    })
 });

 userSchema.methods.comparePassword = async function (password, callback) { 
    bcrypt.compare(password, this.password, function (err, res) {
        callback(err, res);
    });
  }

const model = mongoose.model('user', userSchema);

module.exports = model;
