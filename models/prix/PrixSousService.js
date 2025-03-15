const mongoose = require('mongoose');

const PrixSousServiceSchema = new mongoose.Schema({
    sousService: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SousService', 
        required: true 
    },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now, 
        required: true },
    prixUnitaire: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('PrixSousService', PrixSousServiceSchema);
