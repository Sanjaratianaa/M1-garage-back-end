const PrixSousService = require('../../models/prix/PrixSousService');

// Create a new PrixSousService
exports.createPrixSousService = async (req, res) => {
    try {
        const prixSousService = new PrixSousService(req.body);
        await prixSousService.save();
        res.status(201).json(prixSousService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all PrixSousServices
exports.getAllPrixSousServices = async (req, res) => {
    try {
        const prixSousServices = await PrixSousService.find()
            .populate('sousService')  // Populate the 'sousService' reference
            .populate('manager'); // Populate the 'manager' reference
        res.json(prixSousServices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a PrixSousService by ID
exports.getPrixSousServiceById = async (req, res) => {
    try {
        const prixSousService = await PrixSousService.findById(req.params.id)
            .populate('sousService')
            .populate('manager');
        if (!prixSousService) {
            return res.status(404).json({ message: 'PrixSousService not found' });
        }
        res.json(prixSousService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a PrixSousService
exports.updatePrixSousService = async (req, res) => {
    try {
        const prixSousService = await PrixSousService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('sousService')
        .populate('manager');

        if (!prixSousService) {
            return res.status(404).json({ message: 'PrixSousService not found' });
        }

        res.json(prixSousService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a PrixSousService
exports.deletePrixSousService = async (req, res) => {
    try {
        const prixSousService = await PrixSousService.findByIdAndDelete(req.params.id);
        if (!prixSousService) {
            return res.status(404).json({ message: 'PrixSousService not found' });
        }
        res.json({ message: 'PrixSousService deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};