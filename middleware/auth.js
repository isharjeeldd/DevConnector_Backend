const jwt = require('jsonwebtoken');
const config = require("config");

// a middleware function is that has access to request, response cycle
module.exports = function (req, res, next) {
 
    // get token from header
    const token = req.header('x-auth-token');
    
    // check if there is no token
    if (!token) {
        return res.status(401).json({ msg: "No Token, Authorization denied!" });
    }

    try {
        const decode = jwt.verify(token, config.get('jwtSecretToken'));
        req.user = decode.user;
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ msg: "Token not valid!" });
    }
}