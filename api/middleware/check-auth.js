const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
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
            message: 'Auth Failed'
        })
    }
};