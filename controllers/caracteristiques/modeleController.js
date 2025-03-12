const Modele = require('../../models/caracteristiques/Modele');

// Create a new modele
exports.createModele = async (req, res) => {
    try {
        const modele = new Modele(req.body);
        await modele.save();
        res.status(201).json(modele);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all modeles
exports.getAllModeles = async (req, res) => {
    try {
        const modeles = await Modele.find()
            .populate('manager')
            .populate('managerSuppression');
        res.json(modeles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a modele by ID
exports.getModeleById = async (req, res) => {
    try {
        const modele = await Modele.findById(req.params.id)
            .populate('manager')
            .populate('managerSuppression');
        if (!modele) {
            return res.status(404).json({ message: 'Modele not found' });
        }
        res.json(modele);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a modele
exports.updateModele = async (req, res) => {
    try {
        const modele = await Modele.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('manager')
            .populate('managerSuppression');

        if (!modele) {
            return res.status(404).json({ message: 'Modele not found' });
        }

        res.json(modele);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a modele
exports.deleteModele = async (req, res) => {
    try {
        const modele = await Modele.findByIdAndDelete(req.params.id);
        if (!modele) {
            return res.status(404).json({ message: 'Modele not found' });
        }
        res.json({ message: 'Modele deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};