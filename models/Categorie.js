const mongoose = require('mongoose');

const CategorieSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    couleur: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Categorie', CategorieSchema);