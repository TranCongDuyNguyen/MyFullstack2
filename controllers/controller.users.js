const User = require('../models/model.user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validator = require('../validators/validator.register');

module.exports.createUser = function(req, res, next){
    const {name, email, password} = req.body;
    const { errors, isValid } = validator(req.body);
    //simple validation
    if (!isValid){
        return res.status(400).json(errors);
    }
    // check existed user
    User.findOne({email})
    .then(user => {
        if(user) return res.status(400).json({email: "Email already exists"});
    })
    //create new user
    const newUser = new User({
        name,
        email,
        password
    })
    //create salt & hash, encrypt user's password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user => {
                //distribute JWT for user
                jwt.sign(
                    {id :user.id},
                    process.env.secret_key,
                    { expiresIn: '1h'},
                    (err, token) => {
                        if(err) throw err;
                        res.json({
                            token, //i think it's for localStorage in frontend
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }
                        });
                    }
                );
                
            })
        })
    });   
}