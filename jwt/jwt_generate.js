const jwt = require('jsonwebtoken');
require('dotenv').config()

const SECRET = process.env.TOKEN_SECRET
function generateAccessToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '36000s' });
}

module.exports = {
    generateAccessToken
}