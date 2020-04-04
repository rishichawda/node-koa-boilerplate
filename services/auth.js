const passport = require('koa-passport');
const { User } = require('models');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var localStrategy = require('passport-local').Strategy;

const passportOptions = {
  secretOrKey: process.env.JSON_WEB_TOKEN_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtAuthStrategy = new JwtStrategy(passportOptions, function(jwt, done) {
  User.findBy({ id: jwt.sub }, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

const localAuthStrategy = new localStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.findBy({ email }).then(function(user) {
      if (user) {
        return user.verifyPassword(password, (_, isMatch) => {
          if (isMatch) {
            return done(null, {
              token: user.generateJwtToken(),
              user: {
                email: user.email,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
              },
            });
          } else {
            return done(null, false, {
              message: 'Invalid credentials',
            }, 401);
          }
        });
      } else {
        return done(null, false, {
          message: 'Invalid credentials'
        }, 401);
      }
    })
      .catch(done);
  }
);

passport.use(jwtAuthStrategy);
passport.use(localAuthStrategy);
