const GestionStock = require('../../models/stock/GestionStock');

// Create a new GestionStock entry
exports.createGestionStock = async (req, res) => {
    try {
        const gestionStock = new GestionStock(req.body);
        await gestionStock.save();
        res.status(201).json(gestionStock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all GestionStock entries
exports.getAllGestionStocks = async (req, res) => {
    try {
        const gestionStocks = await GestionStock.find()
            .populate('piece')
            .populate('manager');
        res.json(gestionStocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a GestionStock entry by ID
exports.getGestionStockById = async (req, res) => {
    try {
        const gestionStock = await GestionStock.findById(req.params.id)
            .populate('piece')
            .populate('manager');
        if (!gestionStock) {
            return res.status(404).json({ message: 'GestionStock entry not found' });
        }
        res.json(gestionStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a GestionStock entry
exports.updateGestionStock = async (req, res) => {
    try {
        const gestionStock = await GestionStock.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('piece')
        .populate('manager');

        if (!gestionStock) {
            return res.status(404).json({ message: 'GestionStock entry not found' });
        }

        res.json(gestionStock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a GestionStock entry
exports.deleteGestionStock = async (req, res) => {
    try {
        const gestionStock = await GestionStock.findByIdAndDelete(req.params.id);
        if (!gestionStock) {
            return res.status(404).json({ message: 'GestionStock entry not found' });
        }
        res.json({ message: 'GestionStock entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};