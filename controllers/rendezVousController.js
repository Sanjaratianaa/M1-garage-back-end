const RendezVous = require('../models/RendezVous');

// Create a new RendezVous
exports.createRendezVous = async (req, res) => {
    try {
        const rendezVous = new RendezVous(req.body);
        await rendezVous.save();
        res.status(201).json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all RendezVous
exports.getAllRendezVous = async (req, res) => {
    try {
        const rendezVousList = await RendezVous.find()
            .populate('client')
            .populate('voiture')
            .populate('services.sousSpecialite')
            .populate('services.mecanicien')
            .populate('piecesAchetees.piece');
        res.json(rendezVousList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a RendezVous by ID
exports.getRendezVousById = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findById(req.params.id)
            .populate('client')
            .populate('voiture')
            .populate('services.sousSpecialite')
            .populate('services.mecanicien')
            .populate('piecesAchetees.piece');
        if (!rendezVous) {
            return res.status(404).json({ message: 'RendezVous not found' });
        }
        res.json(rendezVous);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a RendezVous
exports.updateRendezVous = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('client')
        .populate('voiture')
        .populate('services.sousSpecialite')
        .populate('services.mecanicien')
        .populate('piecesAchetees.piece');

        if (!rendezVous) {
            return res.status(404).json({ message: 'RendezVous not found' });
        }

        res.json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a RendezVous
exports.deleteRendezVous = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findByIdAndDelete(req.params.id);
        if (!rendezVous) {
            return res.status(404).json({ message: 'RendezVous not found' });
        }
        res.json({ message: 'RendezVous deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};