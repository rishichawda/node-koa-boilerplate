const jwtMiddleware = require('express-jwt');

function getTokenFromHeader(req) {
  const authHeader = req.headers && req.headers.authorization
    ? req.headers.authorization.split(' ')
    : [];

  if (authHeader.length && authHeader[0] === 'Token') {
    return authHeader[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

const auth = {
  required: jwtMiddleware({
    secret: process.env.JSON_WEB_TOKEN_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwtMiddleware({
    secret: process.env.JSON_WEB_TOKEN_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeader,
    authRequired: false
  })
};

module.exports = auth;
