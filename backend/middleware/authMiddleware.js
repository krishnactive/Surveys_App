const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Exports a middleware named protect which can be applied to any route that needs to be protected (i.e., only accessible by logged-in users).

exports.protect = async(req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "Not authorized, no token"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({message: "Not authorized, token failed"});
    }
};
