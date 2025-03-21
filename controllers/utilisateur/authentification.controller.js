const AuthenticationService = require('../../services/authentification.service');

const AuthenticationController = {
    login: async (req, res) => {
        console.log(req.body);
        const {email, password} = req.body;

        const result = await AuthenticationService.authenticateUser(email, password);

        if (result.success) {
            res.json({token: result.token, user: result.user});
        } else {
            res.status(401).json({message: result.message});
        }
    },

    register: async (req, res) => {
        const result = await AuthenticationService.register(req, res);

        if (result.success) {
            res.status(201).json({message: result.message, data: result.data});
        } else {
            res.status(500).json({message: result.message, data: result.data});
        }
    },

    verifyToken: (req, res) => {
        const token = req.body.token;

        const result = AuthenticationService.verifyToken(token);
        console.log(result);

        if (result.success) {
            res.status(201).json({success: true, user: result.user});
        } else {
            res.status(500).json({success: false, message: result.message});
        }
    },
};

module.exports = AuthenticationController;