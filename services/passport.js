const user = require('../models/usermodel');
const config = require('../config/config');
const passport = require('passport');
const jwt_strategy = require('passport-jwt').Strategy;
const jwt_extract = require('passport-jwt').ExtractJwt;

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