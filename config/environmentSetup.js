const path = require('path');
const dotenv = require('dotenv');

module.exports = () => {
  dotenv.config({
    path: path.resolve(process.cwd(), `config/${process.env.NODE_ENV || 'development'}.env`)
  });
};