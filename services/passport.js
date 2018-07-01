const user = require('../models/usermodel');
const config = require('../config/config');
const passport = require('passport');
const jwt_strategy = require('passport-jwt').Strategy;
const jwt_extract = require('passport-jwt').ExtractJwt;
const local_strategy = require('passport-local');


const local_options = { usernameField: 'email' };
const local_login = new local_strategy(local_options, (email, password, done)=>{
    user.findOne({ email: email }, (err, user_obj)=>{
        if(err) { return done(err); }
        if(!user_obj) { return done(null, false); }
        user_obj.compare_password(password, function (err, isMatch) { 
            if(err) { return done(err); }
            if(!isMatch) { return done(null, false); }
            return done(null, user_obj);
         });
    })
})

// setup jwt strategy
const jwt_options = { 
    jwtFromRequest: jwt_extract.fromHeader('authorization'),
    secretOrKey: config.secret
 };

// setup jwt srtategy
const jwt_login_strategy = new jwt_strategy(jwt_options, function (payload, done) { 
    user.findById(payload.sub, function(err, user) {
        if(err) {
            return done(err, false);
        }
        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
 });

 passport.use(jwt_login_strategy);
 passport.use(local_login);