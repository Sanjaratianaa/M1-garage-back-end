const Utilisateur = require('../../models/utilisateur/Utilisateur');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.motDePasse, 10);

        const utilisateur = new Utilisateur({
            ...req.body,
            motDePasse: hashedPassword,
        });
        await utilisateur.save();
        res.status(201).json(utilisateur);
    } catch (error) {
        res.status(400).json({ message: error.message });
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