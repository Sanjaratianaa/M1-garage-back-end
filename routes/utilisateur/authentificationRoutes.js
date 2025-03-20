const express = require('express');
const AuthenticationController = require('../../controllers/utilisateur/authentification.controller');
const router = express.Router();

router.post('/login', AuthenticationController.login);
router.post('/register', AuthenticationController.register);
router.post('/verifyToken', AuthenticationController.verifyToken);

module.exports = router;    