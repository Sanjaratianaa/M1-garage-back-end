const Piece = require('../../models/caracteristiques/Piece');

// Create a new piece
exports.createPiece = async (req, res) => {
    try {
        const piece = new Piece(req.body);
        await piece.save();
        res.status(201).json(piece);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all pieces
exports.getAllPieces = async (req, res) => {
    try {
        const pieces = await Piece.find()
            .populate('manager')
            .populate('managerSuppression');
        res.json(pieces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a piece by ID
exports.getPieceById = async (req, res) => {
    try {
        const piece = await Piece.findById(req.params.id)
            .populate('manager')
            .populate('managerSuppression');
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }
        res.json(piece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a piece
exports.updatePiece = async (req, res) => {
    try {
        const piece = await Piece.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('manager')
        .populate('managerSuppression');

        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }

        res.json(piece);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a piece
exports.deletePiece = async (req, res) => {
    try {
        const piece = await Piece.findByIdAndDelete(req.params.id);
        if (!piece) {
            return res.status(404).json({ message: 'Piece not found' });
        }
        res.json({ message: 'Piece deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};