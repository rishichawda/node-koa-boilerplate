/* eslint-disable require-atomic-updates */
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, sequelize } = require('models');

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
const signup = async ctx => {
  const { email, password, firstName, lastName } = ctx.request.body;
  if (!email || !password) {
    ctx.status = 400;
    ctx.message = 'Bad Request. Missing credentials.';
    return;
  }
  try {
    const user = await User.findBy({ email });
    if (user) {
      ctx.status = 422;
      ctx.message = 'User already exists';
      return;
    }
    const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });
    ctx.status = 200;
    ctx.body = {
      token: createdUser.generateJwtToken(),
      user: {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      },
    };
  } catch (err) {
    ctx.status = 500;
    ctx.message = err.message || 'An unexpected error occurred';
    ctx.body = {
      originalError: err
    };
  }
};

// Login route
function login(ctx) {
  return passport.authenticate('local', (_, user, info, status) => {
    if (info) {
      ctx.message = info.message;
    }
    if (status) {
      ctx.status = status;
    }
    if (user) {
      ctx.status = 200;
      ctx.body = user;
    }
  })(ctx);
}

module.exports = {
  signup,
  login
};
