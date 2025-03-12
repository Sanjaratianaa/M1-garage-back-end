const Marque = require('../../models/caracteristiques/Marque');

// Create a new marque
exports.createMarque = async (req, res) => {
    try {
        const marque = new Marque(req.body);
        await marque.save();
        res.status(201).json(marque);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all marques
exports.getAllMarques = async (req, res) => {
    try {
        const marques = await Marque.find()
            .populate('manager')
            .populate('managerSuppression');
        res.json(marques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a marque by ID
exports.getMarqueById = async (req, res) => {
    try {
        const marque = await Marque.findById(req.params.id)
            .populate('manager')
            .populate('managerSuppression');
        if (!marque) {
            return res.status(404).json({ message: 'Marque not found' });
        }
        res.json(marque);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a marque
exports.updateMarque = async (req, res) => {
    try {
        const marque = await Marque.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('manager')
        .populate('managerSuppression');

        if (!marque) {
            return res.status(404).json({ message: 'Marque not found' });
        }

        res.json(marque);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a marque
exports.deleteMarque = async (req, res) => {
    try {
        const marque = await Marque.findByIdAndDelete(req.params.id);
        if (!marque) {
            return res.status(404).json({ message: 'Marque not found' });
        }
        res.json({ message: 'Marque deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};