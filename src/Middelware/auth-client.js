const jwt = require('jsonwebtoken');
const tokensecret = "this_is_a_very_secret_key_clients";

module.exports = function (req, res, next) {
    try {
        // Getting the token header from the request
        const sessionToken = req.headers['session-token'];

        //Verifying if the token is valid with the tokenSecret
        const verified = jwt.verify(sessionToken, tokensecret);
        req.user = verified;
        next();

    } catch (err) {
        return res.send({
            status: 501,
            message: 'Invalid Token',
            state: false
        });
    }
}