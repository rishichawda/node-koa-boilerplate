require('module-alias/register');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const setupEnvironment = require('config/environmentSetup');
const setupPassportStrategy = require('config/passportStrategySetup');

const isProduction = process.env.NODE_ENV === 'production';

// Setup environment before importing router. Can also be moved to top of the file.
setupEnvironment();

setupPassportStrategy();

const routes = require('routes');

// Create app object from express.
const app = express();

// Setup error handler - will send back complete stacktrace to client if any error occurs.
// See https://github.com/expressjs/errorhandler for complete details.
// if (!isProduction) {
//   app.use(errorHandler());
// }

// Connect to mongodb database.
if (isProduction) {
  mongoose.connect(process.env.PRODUCTION_DATABASE_URL);
} else {
  mongoose.connect(`mongodb://${process.env.DATABASE_URL}`);
  // Enable logging collection methods and arguments.
  mongoose.set('debug', true);
}

/** 
 * Configure app with various options.
 * Currently, logger, bodyparser and cors setup
 */

app.use(cors());

// Enable logging.
app.use(morgan('combined'));

// Uncomment the next line if you're using forms in your client / need to parse urlencoded data.
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(routes);

// Catch 404 and send error response.
app.use(function (req, res) {
  const error = new Error('Not Found');
  error.status = 404;
  res.status(404).send({
    message: '404 Not Found',
    error,
  });
});

/** 
 * Setup error handling to prevent errors from being displayed on the client side.
 * For development, only print stacktrace; while on production, don't send any errors. 
*/
if (!isProduction) {
  app.use(function (error, req, res) {
    console.log(error.stack);

    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
        error,
      }
    });
  });
} else {
  app.use(function (error, req, res) {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
        error: {},
      }
    });
  });
}

// Server setup
const port = process.env.PORT || 3400;
const server = http.createServer(app);

server.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});
