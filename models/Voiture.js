const mongoose = require('mongoose');

const VoitureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true
      }
}, { timestamps: true });

module.exports = mongoose.model('Voiture', VoitureSchema);