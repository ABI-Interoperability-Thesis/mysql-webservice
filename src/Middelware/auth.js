const { Accounts } = require('../models/Accounts')
const jwt = require('jsonwebtoken');
const tokensecret = "this_is_a_very_secret_key";
const tokensecret_clients = "this_is_a_very_secret_key_clients";

module.exports = function (req, res, next) {
    // Getting the token header from the request
    const sessionToken = req.headers['session-token'];

    try {
        //Verifying if the token is valid with the tokenSecret for engineers
        let verified = jwt.verify(sessionToken, tokensecret);
        req.user = {
            ...verified,
            role: 'authorized'
        };
        next();

    } catch (error) {
        try {
            let verified = jwt.verify(sessionToken, tokensecret_clients);
            req.user = {
                ...verified,
                role: 'client'
            };
            next();
        } catch (error) {
            return res.send({
                status: 501,
                message: 'Invalid Token',
                state: false
            });
        }
    }

}