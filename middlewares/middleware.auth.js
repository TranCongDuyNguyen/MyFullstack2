const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');

    //check for token
    if(!token) return res.status(401).json({msg: "No token, unauthorization denied"});

    try{
        //verify token, decoded user id from payload of JWT
        const decoded = jwt.verify(token, process.env.secret_key);
        //add user from payload of JWT
        req.user = decoded;
        next();
    } catch(e) {
        res.status(400).json({msg: 'Token is not valid', token: token, e: e})
    }
}

module.exports = authMiddleware;