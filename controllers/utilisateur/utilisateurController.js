const Utilisateur = require('../../models/utilisateur/Utilisateur');
const bcrypt = require('bcrypt');

exports.createUserWithParams = async (personne, motDePasse, idRole, dateEmbauche, etat, res) => {
    try {
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const utilisateur = new Utilisateur({
            personne: personne,
            motDePasse: hashedPassword,
            idRole: idRole,
            dateEmbauche: dateEmbauche,
            etat: etat,
        });

        await utilisateur.save();
        return {success: true, message: "User created with success", data: utilisateur}
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, message: "Error creating user", data: error};
    }
};

exports.createUser = async (req, res) => {
    try {
        const {personne, motDePasse, idRole, dateEmbauche, etat} = req.body;

        const response = await this.createUserWithParams(personne, motDePasse, idRole, dateEmbauche, etat);
        if (response.success) {
            res.status(201).json({
                message: response.message,
                data: response.data
            });
        } else {
            res.status(400).json({
                message: response.message,
                data: response.data
            });
        }

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({
            message: "Error creating user",
            data: error
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find().populate('personne').populate('idRole');
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id).populate('personne').populate('idRole');
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur not found' });
        }
        res.json(utilisateur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        if (req.body.motDePasse) {
            req.body.motDePasse = await bcrypt.hash(req.body.motDePasse, 10);
        }

        const utilisateur = await Utilisateur.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('personne').populate('idRole');

        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur not found' });
        }

        res.json(utilisateur);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur not found' });
        }
        res.json({ message: 'Utilisateur deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};