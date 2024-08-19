const config = require('../../config');

const {sign, verify} = require('jsonwebtoken');

const createToken = (payload) => sign(payload, config.jwtSecretKey, {expiresIn: config.jwtExpairation});

const checkToken = (token, callback) => verify(token, config.jwtSecretKey, callback);

module.exports = {
    createToken,
    checkToken,
}