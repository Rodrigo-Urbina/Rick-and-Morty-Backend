const jwt = require('jsonwebtoken');
const isEmpty = require('../middleware/isEmpty');

module.exports = (req, res, next) => {
    if(isEmpty(req.headers.authorization)){
        return res.status(401).json({error: 'Unauthorized action', status: 401})
    }
    const token = (req.headers.authorization).substr(7);
    try {   
        const decoded = jwt.verify(
          token,
          process.env.SECRET_KEY
        );
        req.userData = decoded;
        next();
    } catch (err) {
        return res.json({
            err: err,
            message: 'Auth Failed',
            status: 401
        })
    }
};