const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userschema = new schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

const model = mongoose.model('user', userschema);

module.exports = model;
