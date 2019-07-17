const jwt = require('jwt-simple');
const passport = require('passport');

const User = require('models/User');

function generateUserToken(user) { 
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JSON_WEB_TOKEN_SECRET);
}

// Signup route
function signup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  if(!email || !password) {
    return res.send({
      error: {
        message: 'Email / password not provided!'
      }
    });
  }
  User.findOne({ email: email }, (err, user) => {
    if(user) {
      return res.status(422).send({
        error: {
          message: 'Email is in use.'
        }
      });
    }
    const newUser = new User({
      email: email,
      password: password
    });
    newUser.save((err)=>{
      if(err) { return next(err); }
      res.send({ token: generateUserToken(newUser) });
    });
  });
}

// Login route
function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(422).json({ error: { message: 'Email / password cannot be blank.' } });
  }
  passport.authenticate('local', { session: false }, function (error, user) {
    if (error) {
      return next(error);
    }
    if (user) {
      const token = generateUserToken(user);
      return res.send({ token });
    } else {
      return res.status(401).send({
        error: {
          message: 'Invalid credentials'
        }
      });
    }
  })(req, res, next);
}

module.exports = {
  signup,
  login
};