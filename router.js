const Router = require('koa-router');
const authController = require('controllers/auth');

const router = new Router();

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

module.exports = router;
