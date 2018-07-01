const usermodel = require('../models/usermodel');

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
            res.send({ success: true });
        })
    });

 }


 module.exports = {
     signup
 }