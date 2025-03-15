const AuthenticationService = require('../../services/authentification.service');

const AuthenticationController = {
    login: async (req, res) => {
        const {username, password} = req.body;

        const result = await AuthenticationService.authenticateUser(username, password);

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
};

module.exports = AuthenticationController;