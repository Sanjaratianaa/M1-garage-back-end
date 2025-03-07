const express = require('express');
const router = express.Router();
const Categorie = require('../models/Categorie');

// Créer un categorie
router.post('/', async (req, res) => {
    try {
        const categorie = new Categorie(req.body);
        console.log("hereeeeeeeeeeeeeee");
        await categorie.save();
        res.status(201).json(categorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lire tous les categories
router.get('/', async (req, res) => {
    try {
        const categories = await Categorie.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lire un categorie
router.get('/:id', async (req, res) => {
    try {
        const categorie = await Categorie.findById(req.params.id);
        res.json(categorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un categorie
router.put('/:id', async (req, res) => {
    try {
        const categorie = await Categorie.findByIdAndUpdate(req.params.id,
        req.body, { new: true });
        res.json(categorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un categorie
router.delete('/:id', async (req, res) => {
    try {
        await Categorie.findByIdAndDelete(req.params.id);
        res.json({ message: "Categorie supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
   