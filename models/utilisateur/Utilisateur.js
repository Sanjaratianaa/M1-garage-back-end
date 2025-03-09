const mongoose = require('mongoose');

const UtilisateurSchema = new mongoose.Schema({
    personne: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Personne', 
        required: true 
    },
    motDePasse: { 
        type: String, 
        required: true 
    },
    dateInscription: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    idRole: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role', 
        required: true 
    },
    dateEmbauche: { 
        type: Date 
    },
    etat: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);
