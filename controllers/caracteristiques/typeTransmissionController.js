const TypeTransmission = require('../../models/caracteristiques/TypeTransmission');

// Create a new typeTransmission
exports.createTypeTransmission = async (req, res) => {
    try {
        const typeTransmission = new TypeTransmission(req.body);
        await typeTransmission.save();
        res.status(201).json(typeTransmission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all typeTransmissions
exports.getAllTypeTransmissions = async (req, res) => {
    try {
        const typeTransmissions = await TypeTransmission.find()
            .populate('manager')
            .populate('managerSuppression');
        res.json(typeTransmissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a typeTransmission by ID
exports.getTypeTransmissionById = async (req, res) => {
    try {
        const typeTransmission = await TypeTransmission.findById(req.params.id)
            .populate('manager')
            .populate('managerSuppression');
        if (!typeTransmission) {
            return res.status(404).json({ message: 'TypeTransmission not found' });
        }
        res.json(typeTransmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a typeTransmission
exports.updateTypeTransmission = async (req, res) => {
    try {
        const typeTransmission = await TypeTransmission.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('manager')
        .populate('managerSuppression');

        if (!typeTransmission) {
            return res.status(404).json({ message: 'TypeTransmission not found' });
        }

        res.json(typeTransmission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a typeTransmission
exports.deleteTypeTransmission = async (req, res) => {
    try {
        const typeTransmission = await TypeTransmission.findByIdAndDelete(req.params.id);
        if (!typeTransmission) {
            return res.status(404).json({ message: 'TypeTransmission not found' });
        }
        res.json({ message: 'TypeTransmission deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};