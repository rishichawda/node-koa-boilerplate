require('module-alias/register');
require('config/environmentSetup')();
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const passport = require('koa-passport');
const session = require('koa-session');
const cors = require('@koa/cors');
const router = require('./router');

// Initialize db connection
require('./models');

// Create app object from koa.
const app = new koa();

// Enable cors
const corsConfig = {
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
};
app.use(cors(corsConfig));

// Enable logging.
app.use(logger());

// sessions
app.keys = [process.env.SESSION_SECRET];
const sessionConfig = { sameSite: 'none' };
app.use(session(sessionConfig, app));

// parse request body.
app.use(bodyParser());

// Setup passport for authentication.
require('services/auth');
app.use(passport.initialize());

// Create router object
app.use(router.routes());

app.listen(3400);
