const express = require('express');
const router = express.Router();
const Voiture = require('../models/Voiture');
const Categorie = require('../models/caracteristiques/Categorie');

// Créer un voiture
router.post('/', async (req, res) => {
    try {
        const voiture = new Voiture(req.body);
        let categorie = await Categorie.findById(voiture.categorie);
        if (!categorie) {
            return res.status(404).json({ message: "Category not found" });
        }
        await voiture.save();
        res.status(201).json(voiture);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lire tous les voitures
router.get('/', async (req, res) => {
    try {
        const voitures = await Voiture.find().populate('categorie');
        res.json(voitures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lire un voiture
router.get('/:id', async (req, res) => {
    try {
        const voiture = await Voiture.findById(req.params.id).populate('categorie');
        res.json(voiture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un voiture
router.put('/:id', async (req, res) => {
    try {
        const voiture = await Voiture.findByIdAndUpdate(req.params.id,
        req.body, { new: true });
        res.json(voiture);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un voiture
router.delete('/:id', async (req, res) => {
    try {
        await Voiture.findByIdAndDelete(req.params.id);
        res.json({ message: "voiture supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
   