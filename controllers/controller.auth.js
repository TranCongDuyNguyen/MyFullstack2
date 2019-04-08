const User = require('../models/model.user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validator = require('../validators/validator.login');

//login with authentication
module.exports.login = function (req, res, next) {
    const { email, password } = req.body;
    const { errors, isValid } = validator(req.body);
    //simple validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // check existing user
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ email: "Email not found" });

            //validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ password: 'Password is incorrect' });

                    //distribute JWT for login user
                    jwt.sign(
                        { id: user.id },
                        process.env.secret_key,
                        { expiresIn: '3h' },
                        (err, token) => {
                            if (err) throw err;
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
}
//response user info, api/auth/user
module.exports.getUserInfo = (req, res) => {
    User.findById(req.user.id) //id is passed through authMiddleware
        .select('-password')
        .then(user => res.json(user));
}