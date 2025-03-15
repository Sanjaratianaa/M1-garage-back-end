const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/utilisateur/Utilisateur');
const UtilisateurController = require('../controllers/utilisateur/utilisateurController');

const secretKey = 'M1-project-MEAN';

const AuthenticationService = {
    authenticateUser: async (email, password) => {
        try {
            const user = await Utilisateur.findOne({ 'personne.email': email }).populate('personne');

            if (!user) {
                return { success: false, message: 'Invalid credentials' };
            }

            const passwordMatch = await bcrypt.compare(password, user.motDePasse);

            if (!passwordMatch) {
                return { success: false, message: 'Invalid credentials' };
            }

            const payload = {
                id: user._id,                 
                username: user.personne.nom + ' ' + user.personne.prenom,
                email: user.personne.email, 
                matricule: user.matricule || null, 
                role: user.idRole   
            };

            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

            return { success: true, token: token, user: payload };
        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, message: 'Authentication failed' };
        }
    },

    verifyToken: (token) => {
        try {
            const decoded = jwt.verify(token, secretKey);
            return { success: true, user: decoded };
        } catch (error) {
            return { success: false, message: 'Invalid token' };
        }
    },

    hashPassword: async (password) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    },

    register: async (req, res) => {
        const userResult = await UtilisateurController.createUser(req, res);
        if (userResult.success) {
            return {success: true, message: userResult.message, data: userResult.data};
        } else {
            return {success: false, message: userResult.message, data: userResult.data};
        }
    }
};

module.exports = AuthenticationService;