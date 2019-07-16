const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userShema = new schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

userShema.pre('save', function (next) { 
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

 userShema.methods.comparePassword = async function (password, callback) { 
    bcrypt.compare(password, this.password, function (err, res) {
        callback(err, res);
    });
  }

const model = mongoose.model('user', userShema);

module.exports = model;
