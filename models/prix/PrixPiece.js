const mongoose = require('mongoose');

const PrixPieceSchema = new mongoose.Schema({
    piece: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Piece', 
        required: true 
    },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    date: { 
        type: Date, default: Date.now, 
        required: true 
    },
    prixUnitaire: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('PrixPiece', PrixPieceSchema);
