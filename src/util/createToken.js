const jwt = require('jsonwebtoken');
const THREE_DAYS = 3 * 24 * 60 * 60;
const createToken = (id) => { 
    return jwt.sign({id}, process.env.TOKEN_SECRET,{
        expiresIn: THREE_DAYS,
    });
};

module.exports = createToken;
     