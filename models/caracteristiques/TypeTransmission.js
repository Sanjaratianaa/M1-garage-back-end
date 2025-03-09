const mongoose = require('mongoose');

const TypeTransmissionSchema = new mongoose.Schema({
    libelle: { 
        type: String, 
        required: true 
    },
    dateEnregistrement: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    dateSuppression: { 
        type: Date 
    },
    managerSuppression: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur' 
    },
    etat: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('TypeTransmission', TypeTransmissionSchema);
