const auth = require('./controllers/authservice');
const loginservice = require('./services/passport');
const passport = require('passport');

const requireauth = passport.authenticate('jwt', { session: false });

module.exports = (app) => { 
    app.get('/', requireauth, function (req, res, next) { 
        res.send({ loggedin: true })
     })
    app.post('/signup', auth.signup )
 };