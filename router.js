const auth = require('./controllers/authservice');
const loginservice = require('./services/passport');
const passport = require('passport');

const requireauth = passport.authenticate('jwt', { session: false });
const requirelogin = passport.authenticate('local', { session: false });

module.exports = (app) => { 
    app.get('/', requireauth, function (req, res, next) { 
        res.send({ loggedin: true })
     })
    app.post('/signup', auth.signup );
    app.post('/login', requirelogin, auth.login );
 };