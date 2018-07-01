const auth = require('./controllers/authservice');

module.exports = (app) => { 
    app.post('/signup', auth.signup )
 };