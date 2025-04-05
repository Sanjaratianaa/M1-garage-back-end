const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/utilisateur/Utilisateur');
const Personne = require('../models/utilisateur/Personne');
const UtilisateurController = require('../controllers/utilisateur/utilisateurController');
const PersonneController = require('../controllers/utilisateur/personneController');
const RoleController = require('../controllers/utilisateur/roleController');

const secretKey = 'M1-project-MEAN';

const AuthenticationService = {
    authenticateUser: async (email, password) => {
        try {
            const personne = await Personne.findOne({ email: email, etat: 'Active' });

            if (!personne) {
                return { success: false, message: 'Email ou mot de passe incorrect' };
            }

            const user = await Utilisateur.findOne({ personne: personne._id })
                .populate('personne')
                .populate('idRole');

            if (!user) {
                return { success: false, message: 'Email ou mot de passe incorrect' };
            }

            const passwordMatch = await bcrypt.compare(password, user.motDePasse);

            if (!passwordMatch) {
                return { success: false, message: 'Email ou mot de passe incorrect' };
            }

            const payload = {
                id: user._id,
                username: `${user.personne.nom} ${user.personne.prenom}`,
                email: user.personne.email,
                matricule: user.matricule || null,
                role: user.idRole,
                idPersonne: user.personne._id
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

            const personneReq = {
                body: {
                    nom,
                    prenom,
                    dateDeNaissance,
                    lieuDeNaissance,
                    genre,
                    etat,
                    numeroTelephone,
                    email
                }
            };

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

            const mockReq = { body: { libelle: idRole } };

            const mockRes = {
                status: (code) => {
                    mockRes.statusCode = code;
                    return mockRes;
                },
                json: (data) => {
                    mockRes.data = data;
                }
            };

            await RoleController.getRoleBy(mockReq, mockRes);

            if (mockRes.statusCode !== 200) {
                throw new Error(`Role retrieval failed: ${mockRes.statusCode}: ${mockRes.data?.message || 'Unknown error'}`);
            }

            const roleResult = mockRes.data;
            const roleId = roleResult._id;

            const utilisateurResponse = await UtilisateurController.createUserWithParams(
                personne._id,
                motDePasse,
                roleId,
                dateEmbauche,
                etat
            );

            if (!utilisateurResponse.success) {
                throw new Error(`Utilisateur creation failed: ${utilisateurResponse.message || 'Unknown error'}`);
            }

            const utilisateur = utilisateurResponse.data;

            const matricule = utilisateur.matricule;

            // for employe only
            const finalMotDePasse = !motDePasse ? matricule : motDePasse;
            const hashedPassword = await bcrypt.hash(finalMotDePasse, 10);
            utilisateur.motDePasse = hashedPassword;

            await utilisateur.save();

            const populatedUser = await Utilisateur.findById(utilisateur._id).populate({ path: 'personne', model: 'Personne' }).populate('idRole');

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
            // Exemple en Mongoose (Node.js)
            const [user] = await Utilisateur.aggregate([
                {
                    $lookup: {
                        from: 'personnes',           // nom de la collection "personnes"
                        localField: 'personne',      // champ dans "utilisateurs"
                        foreignField: '_id',         // champ correspondant dans "personnes"
                        as: 'personne'
                    }
                },
                { $unwind: '$personne' },

                // Ajout de la jointure avec "roles"
                {
                    $lookup: {
                        from: 'roles',               // nom de la collection "roles"
                        localField: 'idRole',        // champ dans "utilisateurs"
                        foreignField: '_id',         // champ correspondant dans "roles"
                        as: 'role'
                    }
                },
                { $unwind: '$role' },

                // Filtrer par email de la personne
                {
                    $match: {
                        'personne.email': email.trim()
                    }
                },
                { $limit: 1 }
            ]);


            if (!user) {
                throw new Error("L'adresse e-mail est incorrecte ou n'existe pas.");
            }
            
            const passwordMatch = await bcrypt.compare(oldPassword.trim(), user.motDePasse);

            if (!passwordMatch) {
                throw new Error("Identifiants invalides : l'ancien mot de passe est incorrect.");
            }

            if (newPassword !== confirmPassword) {
                throw new Error("Les mots de passe ne correspondent pas.");
            }

            // 4. Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await Utilisateur.updateOne(
                { _id: user._id },
                { $set: { motDePasse: hashedPassword } }
            );

            return { success: true, message: "Le mot de passe is successfully changed" };
        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, message: error.message };
        }
    }
};

module.exports = AuthenticationService;