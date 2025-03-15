const mongoose = require('mongoose');

const RendezVousSchema = new mongoose.Schema({
    client: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Utilisateur', 
        required: true 
    },
    voiture: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Voiture', 
        required: true 
    },
    services: [
        {
            sousSpecialite: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'SousService', 
                required: true 
            },
            raison: { 
                type: String, 
                required: true 
            },
            mecanicien: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Utilisateur', 
                required: true 
            },
            quantiteEstimee: { 
                type: Number, 
                required: true 
            },
            heureDebut: { 
                type: Date, 
                required: true 
            },
            heureFin: { 
                type: Date, 
                required: true 
            },
            quantiteFinale: { 
                type: Number, 
                required: true 
            },
            prixUnitaire: { 
                type: Number, 
                required: true 
            },
            prixTotal: { 
                type: Number, 
                required: true 
            },
            remise: { 
                type: Number, 
                required: true 
            },
            commentaire: { 
                type: String },
            note: { 
                type: Number },
            avis: { 
                type: String },
            status: { 
                type: String, 
                enum: ['en cours', 'en attente', 'suspendue', 'terminé'], 
                required: true 
            }
        }
    ],
    dateHeureDemande: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    dateRendezVous: { 
        type: Date, 
        required: true 
    },
    heureDebut: { 
        type: Date, 
        required: true 
    },
    heureFin: { 
        type: Date, 
        required: true 
    },
    piecesAchetees: [
        {
            piece: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Piece', 
                required: true 
            },
            quantite: { 
                type: Number, 
                required: true 
            },
            prixUnitaire: { 
                type: Number, 
                required: true 
            },
            prixTotal: { 
                type: Number, 
                required: true 
            },
            remise: { 
                type: Number, 
                required: true 
            },
            commentaire: { 
                type: String }
        }
    ],
    remarque: { 
        type: String 
    },
    etat: { 
        type: String, 
        enum: ['en attente', 'validé', 'rejeté', 'annulé'], 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('RendezVous', RendezVousSchema);
