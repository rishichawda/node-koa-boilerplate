'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      }
    },
    {}
  );
  User.associate = function() {
    // associations can be defined here
  };
  User.findBy = async function(selection) {
    const user = await User.findOne({ where: selection });
    return user;
  };
  User.prototype.verifyPassword = async function (password, callback) {
    bcrypt.compare(password, this.password, function (err, res) {
      callback(err, res);
    });
  };
  User.prototype.generateJwtToken = function () {
    const timestamp = new Date().getTime();
    return jwt.encode(
      { sub: this.id, iat: timestamp },
      process.env.JSON_WEB_TOKEN_SECRET
    );
  };
  return User;
};