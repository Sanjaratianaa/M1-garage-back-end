const SousService = require('../../models/services/SousService');

// Create a new SousService
exports.createSousService = async (req, res) => {
    try {
        const sousService = new SousService(req.body);
        await sousService.save();
        res.status(201).json(sousService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all SousServices
exports.getAllSousServices = async (req, res) => {
    try {
        const sousServices = await SousService.find()
            .populate('service')
            .populate('manager')
            .populate('managerSuppression');
        res.json(sousServices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a SousService by ID
exports.getSousServiceById = async (req, res) => {
    try {
        const sousService = await SousService.findById(req.params.id)
            .populate('service')
            .populate('manager')
            .populate('managerSuppression');
        if (!sousService) {
            return res.status(404).json({ message: 'SousService not found' });
        }
        res.json(sousService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a SousService
exports.updateSousService = async (req, res) => {
    try {
        const sousService = await SousService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('service')
        .populate('manager')
        .populate('managerSuppression');

        if (!sousService) {
            return res.status(404).json({ message: 'SousService not found' });
        }

        res.json(sousService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a SousService
exports.deleteSousService = async (req, res) => {
    try {
        const sousService = await SousService.findByIdAndDelete(req.params.id);
        if (!sousService) {
            return res.status(404).json({ message: 'SousService not found' });
        }
        res.json({ message: 'SousService deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};