'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('config/config.json')[env];

const db = {};

const { database, username, password, ...databaseConfig } = config;

const sequelize = new Sequelize(
  database,
  username,
  password,
  databaseConfig
);
  
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    throw err;
  });

// Read models from this directory and associate with the database instance.
fs.readdirSync(__dirname).filter(file => {
  const fileNameStartsWithDot = file.indexOf('.') === 0;
  const NotThisFile = file !== path.basename(__filename);
  const endsWithJsExtension = file.slice(-3) === '.js';
  return !fileNameStartsWithDot && NotThisFile && endsWithJsExtension;
}).forEach(file => {
  const model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(model => {
  if(db[model].associate) db[model].associate(db);
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
