const jwt = require('jsonwebtoken');

module.exports = ( req, res, next ) => {

    try {
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, 'MAHMOUD');

        req.userData = decoded; // asign data in the request
        
        next();
    } catch (error) {
        res.status(409).json({
            message: 'Auth failed',
            error
        })
    }

};