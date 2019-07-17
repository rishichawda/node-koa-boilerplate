const router = require('express').Router();

const userRoute = require('routes/user');
const authRoute = require('routes/auth');

router.use('/user', userRoute);
router.use('/auth', authRoute);

// Catch authorization or validation errors and return appropriate status codes and message to the client.
router.use(function (err, req, res, next) {
  console.log({ err });
  if (err) {
    return res.status(err.status).json({
      error: {
        message: err.message,
      }
    });
  }
  return next(err);
});

module.exports = router;
