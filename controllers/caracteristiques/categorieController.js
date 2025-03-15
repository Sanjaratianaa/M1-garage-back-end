const Categorie = require('../../models/caracteristiques/Categorie');

// Create a new category
exports.createCategorie = async (req, res) => {
    try {
        const categorie = new Categorie(req.body);
        await categorie.save();
        res.status(201).json(categorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.find()
                                            .populate('manager')
                                            .populate('managerSuppression');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a category by ID
exports.getCategorieById = async (req, res) => {
    try {
        const categorie = await Categorie.findById(req.params.id)
                                                .populate('manager')
                                                .populate('managerSuppression');
        if (!categorie) {
            return res.status(404).json({ message: 'Categorie not found' });
        }
        res.json(categorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a category
exports.updateCategorie = async (req, res) => {
    try {
        const categorie = await Categorie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('manager')
        .populate('managerSuppression');

        if (!categorie) {
            return res.status(404).json({ message: 'Categorie not found' });
        }

        res.json(categorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a category
exports.deleteCategorie = async (req, res) => {
    try {
        const categorie = await Categorie.findByIdAndDelete(req.params.id);
        if (!categorie) {
            return res.status(404).json({ message: 'Categorie not found' });
        }
        res.json({ message: 'Categorie deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};