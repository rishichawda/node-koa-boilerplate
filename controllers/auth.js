const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, sequelize } = require('models');
const sendErrorResponse = require('utils/sendErrorResponse');

function generateUserToken(user) { 
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JSON_WEB_TOKEN_SECRET);
}

async function createUser(data) {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.create(data, {
      transaction
    });
    await transaction.commit();
    return user;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

// Signup route
async function signup(req, res) {
  const {email, password, firstName, lastName } = req.body;
  if(!email || !password) {
    return sendErrorResponse(res, 422, 'Bad request. Missing parameters');
  }
  try {
    const user = await User.findBy({ email });
    if(user) {
      return sendErrorResponse(res, 422, 'User already exists');
    }
    const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });
    return res.send({
      data: {
        id: createdUser.id,
        token: generateUserToken(createdUser),
        email: createdUser.email
      }
    });
  } catch (err) {
    sendErrorResponse(res, 500, 'An unexpected error occurred', err);
  }
}

// Login route
function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return sendErrorResponse(res, 422, 'Email / password cannot be blank.');
  }
  passport.authenticate('local', { session: false }, function (error, user) {
    if (error) {
      return next(error);
    }
    if (user) {
      const token = generateUserToken(user);
      return res.send({ token });
    } else {
      return sendErrorResponse(res, 401, 'invalid credentials');
    }
  })(req, res, next);
}

module.exports = {
  signup,
  login
};