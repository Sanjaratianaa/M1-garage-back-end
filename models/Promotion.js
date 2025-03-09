const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    sousSpecialite: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'SousSpecialite', 
        required: true 
    },
    dateDebut: { 
        type: Date, 
        required: true 
    },
    dateFin: { 
        type: Date, 
        required: true 
    },
    remise: { 
        type: Number, 
        required: true 
    }, // Pourcentage ou montant de la remise
    etat: { 
        type: String, 
        required: true 
    } // Par exemple "actif", "inactif"
}, { timestamps: true });

module.exports = mongoose.model('Promotion', PromotionSchema);
