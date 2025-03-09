const mongoose = require('mongoose');

const GestionStockSchema = new mongoose.Schema({
    piece: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Piece', 
        required: true 
    },
    entree: { 
        type: Number, 
        required: true 
    },
    sortie: { 
        type: Number, 
        required: true 
    },
    prixUnitaire: { 
        type: Number, 
        required: true 
    },
    dateHeure: { 
        type: Date, default: Date.now, 
        required: true 
    },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('GestionStock', GestionStockSchema);
