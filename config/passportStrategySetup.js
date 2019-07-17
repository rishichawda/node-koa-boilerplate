const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const User = require("models/User");

module.exports = () => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      function(email, password, done) {
        User.findOne({ email })
          .then(function(user) {
            if (user) {
              return user.comparePassword(password, (err = {}, isMatch) => {
                if (isMatch) {
                  return done(null, user);
                } else {
                  return done(null, false, {
                    error: { message : "email or password is invalid", status: 401, ...err }
                  });
                }
              });
            } else {
              return done(null, false, {
                error: { message : "email or password is invalid", status: 401 }
              });
            }
          })
          .catch(done);
      }
    )
  );
};
