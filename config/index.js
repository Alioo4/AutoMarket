require("dotenv/config");

module.exports = {
    port: process.env.PORT || 8080,
    jwtSecretKey: process.env.JWT_SECRET,
    jwtExpairation: process.env.JWT_EXPIRATION
};