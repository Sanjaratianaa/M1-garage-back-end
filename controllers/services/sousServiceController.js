const SousService = require('../../models/services/SousService');

// Create a new SousService
exports.createSousService = async (req, res) => {
    try {
        const sousServiceData = {
            ...req.body,
            manager: "67d6f7ef67591179796c9d16",
        };
        const sousServiceSave = new SousService(sousServiceData);
        await sousServiceSave.save();
        const sousService = await SousService.findById(sousServiceSave.id)
            .populate('service')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
        res.status(201).json(sousService);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Le sous service "${req.body.libelle}" existe déjà. Veuillez choisir un autre sous service.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Get all SousServices
exports.getAllSousServices = async (req, res) => {
    try {
        const sousServices = await SousService.find()
            .populate('service')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(sousServices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all SousServices Actives
exports.getAllSousServicesActives = async (req, res) => {
    try {
        const sousServices = await SousService.find({ etat: "Active" })
            .populate('service')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        res.json(sousServices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a SousService by ID
exports.getSousServiceById = async (req, res) => {
    try {
        const sousService = await SousService.findById(req.params.id)
            .populate('service')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });
        if (!sousService) {
            return res.status(404).json({ message: 'SousService not found' });
        }
        res.json(sousService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a SousService
exports.updateSousService = async (req, res) => {
    try {
        const sousService = await SousService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('service')
        .populate('manager')
        .populate('managerSuppression');

        if (!sousService) {
            return res.status(404).json({ message: 'SousService not found' });
        }

        res.json(sousService);
    } catch (error) {
        if (error.code === 11000) {
            console.log("tafiditaaa");
            return res.status(400).json({
                message: `Le sous service "${req.body.libelle}" existe déjà. Veuillez choisir un autre sous service.`,
            });
        } else
            res.status(400).json({ message: error.message });
    }
};

// Delete a SousService
exports.deleteSousService = async (req, res) => {
    try {
        const service = await SousService.findByIdAndUpdate(
            req.params.id,
            {
                etat: 'Inactive',  // Servicer comme supprimé
                dateSuppression: new Date(),  // Enregistrer la date
                managerSuppression: "67d6f7ef67591179796c9d16"  // Qui a supprimé ?
            },
            { new: true }
        )
            .populate('service')
            .populate({
                path: 'manager',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            })
            .populate({
                path: 'managerSuppression',  // Peupler le manager
                populate: {
                    path: 'personne',  // Peupler la personne
                    model: 'Personne'  // Spécifie le modèle à peupler
                }
            });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
