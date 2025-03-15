const Promotion = require('../models/Promotion');

// Create a new Promotion
exports.createPromotion = async (req, res) => {
    try {
        const promotion = new Promotion(req.body);
        await promotion.save();
        res.status(201).json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Promotions
exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find()
            .populate('manager')
            .populate('sousSpecialite');
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Promotion by ID
exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id)
            .populate('manager')
            .populate('sousSpecialite');
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.json(promotion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Promotion
exports.updatePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('manager')
        .populate('sousSpecialite');

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        res.json(promotion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Promotion
exports.deletePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndDelete(req.params.id);
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.json({ message: 'Promotion deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};