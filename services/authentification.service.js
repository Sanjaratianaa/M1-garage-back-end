const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/utilisateur/Utilisateur');
const Personne = require('../models/utilisateur/Personne');
const UtilisateurController = require('../controllers/utilisateur/utilisateurController');
const PersonneController = require('../controllers/utilisateur/personneController');

const secretKey = 'M1-project-MEAN';

const AuthenticationService = {
    authenticateUser: async (email, password) => {
        try {
            const personne = await Personne.findOne({ email: email });

            if (!personne) {
                return { success: false, message: 'Invalid credentials' };
            }

            const user = await Utilisateur.findOne({ personne: personne._id })
                .populate('personne')
                .populate('idRole');

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

            return { success: true, token: token };
        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, message: 'Authentication failed' };
        }
    },

    verifyToken: (token) => {
        try {
            console.log("yesssssssssss");
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
        try {
            const {
                nom,
                prenom,
                dateDeNaissance,
                lieuDeNaissance,
                genre,
                etat,
                numeroTelephone,
                email,
                motDePasse,
                idRole,
                dateEmbauche
            } = req.body;

            const personneReq = { body: {
                nom,
                prenom,
                dateDeNaissance,
                lieuDeNaissance,
                genre,
                etat,
                numeroTelephone,
                email
            }};

            const personneRes = {
                status: (code) => {
                    personneRes.statusCode = code;
                    return personneRes;
                },
                json: (data) => {
                    personneRes.data = data;
                }
            };

            await PersonneController.createPersonne(personneReq, personneRes);

            if (personneRes.statusCode !== 201) {
                throw new Error(`Personne creation failed with status ${personneRes.statusCode}: ${personneRes.data?.message || 'Unknown error'}`);
            }

            const personne = personneRes.data;

            const utilisateurResponse = await UtilisateurController.createUserWithParams(
                personne._id,
                motDePasse,
                idRole,
                dateEmbauche,
                etat
            );

            if (!utilisateurResponse.success) {
                throw new Error(`Utilisateur creation failed: ${utilisateurResponse.message || 'Unknown error'}`);
            }

            const utilisateur = utilisateurResponse.data;

            const populatedUser = await Utilisateur.findById(utilisateur._id).populate('personne').populate('idRole');

            return { success: true, message: "User registered successfully", data: populatedUser };
        } catch (error) {
            console.error('Error registering user:', error);

            if (personne && personne?._id) { 
                try {
                    const deletePersonneReq = { params: { id: personne._id } };
                    const deletePersonneRes = {};
                    await PersonneController.deletePersonne(deletePersonneReq, deletePersonneRes);
                    console.log('Personne deleted due to utilisateur creation failure.');
                } catch (deleteError) {
                    console.error('Error deleting personne after user creation failed:', deleteError);
                }
            }

            return { success: false, message: "Error registering user", data: error };
        }
    },

    changePassword: async (email, oldPassword, newPassword, confirmPassword) => {
        try {
            const user = await Utilisateur.findOne({ 'personne.email': email }).populate('personne').populate('idRole');

            if (!user) {
                return { success: false, message: 'Invalid credentials' };
            }

            const passwordMatch = await bcrypt.compare(oldPassword, user.motDePasse);

            if (!passwordMatch) {
                return { success: false, message: 'Invalid credentials: Incorrect old password' };
            }

            if (newPassword !== confirmPassword) {
                return { success: false, message: 'New password and confirm password do not match' };
            }
    
            // 4. Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.motDePasse = hashedPassword;
            await user.save();

            return { success: true, message: "Le mot de passe is successfully changed", data: user };
        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, message: 'Authentication failed' };
        }
    }
};

module.exports = AuthenticationService;