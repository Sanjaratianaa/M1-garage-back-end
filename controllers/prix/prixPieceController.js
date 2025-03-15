const PrixPiece = require('../../models/prix/PrixPiece');

// Create a new PrixPiece
exports.createPrixPiece = async (req, res) => {
    try {
        const prixPiece = new PrixPiece(req.body);
        await prixPiece.save();
        res.status(201).json(prixPiece);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all PrixPieces
exports.getAllPrixPieces = async (req, res) => {
    try {
        const prixPieces = await PrixPiece.find()
            .populate('piece')
            .populate('manager');
        res.json(prixPieces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a PrixPiece by ID
exports.getPrixPieceById = async (req, res) => {
    try {
        const prixPiece = await PrixPiece.findById(req.params.id)
            .populate('piece')
            .populate('manager');
        if (!prixPiece) {
            return res.status(404).json({ message: 'PrixPiece not found' });
        }
        res.json(prixPiece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a PrixPiece
exports.updatePrixPiece = async (req, res) => {
    try {
        const prixPiece = await PrixPiece.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('piece')
        .populate('manager');

        if (!prixPiece) {
            return res.status(404).json({ message: 'PrixPiece not found' });
        }

        res.json(prixPiece);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a PrixPiece
exports.deletePrixPiece = async (req, res) => {
    try {
        const prixPiece = await PrixPiece.findByIdAndDelete(req.params.id);
        if (!prixPiece) {
            return res.status(404).json({ message: 'PrixPiece not found' });
        }
        res.json({ message: 'PrixPiece deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};