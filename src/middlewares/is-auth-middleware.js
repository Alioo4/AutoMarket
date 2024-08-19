const { checkToken } = require('../helpers/jwt');

module.exports = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(401).json({ message: "Register please" });
    }

    checkToken(req.headers.token, (err, data) => {
        if (err) {
            return res.status(401).json({ message: "Register please" });
        }

        req.user = data;

        next();
    })
};