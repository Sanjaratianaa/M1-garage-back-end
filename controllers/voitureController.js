const Voiture = require('../models/Voiture');

// Create a new Voiture
exports.createVoiture = async (req, res) => {
    try {
        const voiture = new Voiture(req.body);
        await voiture.save();
        res.status(201).json(voiture);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Voitures
exports.getAllVoitures = async (req, res) => {
    try {
        const voitures = await Voiture.find()
            .populate('client')
            .populate('marque')
            .populate('modele')
            .populate('categorie')
            .populate('typeTransmission');
        res.json(voitures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Voiture by ID
exports.getVoitureById = async (req, res) => {
    try {
        const voiture = await Voiture.findById(req.params.id)
            .populate('client')
            .populate('marque')
            .populate('modele')
            .populate('categorie')
            .populate('typeTransmission');
        if (!voiture) {
            return res.status(404).json({ message: 'Voiture not found' });
        }
        res.json(voiture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Voiture
exports.updateVoiture = async (req, res) => {
    try {
        const voiture = await Voiture.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('client')
        .populate('marque')
        .populate('modele')
        .populate('categorie')
        .populate('typeTransmission');

        if (!voiture) {
            return res.status(404).json({ message: 'Voiture not found' });
        }

        res.json(voiture);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Voiture
exports.deleteVoiture = async (req, res) => {
    try {
        const voiture = await Voiture.findByIdAndDelete(req.params.id);
        if (!voiture) {
            return res.status(404).json({ message: 'Voiture not found' });
        }
        res.json({ message: 'Voiture deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};