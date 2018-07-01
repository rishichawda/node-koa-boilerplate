const usermodel = require('../models/usermodel');
const jwt = require('jwt-simple');
const config = require('../config/config');

function generate_token(user) { 
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
 }

function signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password) {
        return res.send({ error : "Email / password not provided!" })
    }

    usermodel.findOne({ email: email }, (err, user) => {
        if(user) {
            return res.status(422).send({ error: 'Email is in use.' })
        }

        const newuser = new usermodel({
            email: email,
            password: password
        });

        newuser.save((err)=>{
            if(err) {
                return next(err);
            }
            res.send({ token: generate_token(newuser) });
        })
    });

 }


 module.exports = {
     signup
 }