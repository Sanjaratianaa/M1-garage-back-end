const GestionStock = require('../../models/stock/GestionStock');

// Create a new GestionStock entry
exports.createGestionStock = async (req, res) => {
    try {
        const gestionStockData = {
            ...req.body,
            manager: "67d6f7ef67591179796c9d16",
        };

        if (gestionStockData.prixUnitaire < 0)
            throw new Error(`Prix invalide. Le prix doit etre superieur à zero.`);

        if (gestionStockData.entree < 0 || gestionStockData.sortie < 0)
            throw new Error(`Quantité invalide. Le prix doit etre superieur à zero.`);

        const gestionStockSave = new GestionStock(gestionStockData);
        await gestionStockSave.save();
        const gestionStock = await GestionStock.findById(gestionStockSave.id)
            .populate('piece')
            .populate('marqueVoiture')
            .populate('modeleVoiture')
            .populate('typeTransmission')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.status(201).json(gestionStock);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// Get all GestionStock entries
exports.getAllGestionStocks = async (req, res) => {
    try {
        const gestionStocks = await GestionStock.find()
            .populate('piece')
            .populate('marqueVoiture')
            .populate('modeleVoiture')
            .populate('typeTransmission')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(gestionStocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a GestionStock entry by ID
exports.getGestionStockById = async (req, res) => {
    try {
        const gestionStock = await GestionStock.findById(req.params.id)
            .populate('piece')
            .populate('marqueVoiture')
            .populate('modeleVoiture')
            .populate('typeTransmission')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        if (!gestionStock) {
            return res.status(404).json({ message: 'GestionStock entry not found' });
        }
        res.json(gestionStock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a GestionStock entry
exports.updateGestionStock = async (req, res) => {
    try {
        if (req.body.prixUnitaire < 0)
            throw new Error(`Prix invalide. Le prix doit etre superieur à zero.`);

        if (req.body.entree < 0 || req.body.sortie < 0)
            throw new Error(`Quantité invalide. Le prix doit etre superieur à zero.`);

        const gestionStock = await GestionStock.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('piece')
            .populate('marqueVoiture')
            .populate('modeleVoiture')
            .populate('typeTransmission')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })

        if (!gestionStock) {
            return res.status(404).json({ message: 'GestionStock entry not found' });
        }

        res.json(gestionStock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a GestionStock entry
exports.deleteGestionStock = async (req, res) => {
    try {
        const gestionStock = await GestionStock.findByIdAndDelete(req.params.id);
        if (!gestionStock) {
            return res.status(404).json({ message: 'GestionStock entry not found' });
        }
        res.json({ message: 'GestionStock entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};