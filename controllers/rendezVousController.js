const RendezVous = require('../models/RendezVous');

// Create a new RendezVous
exports.createRendezVous = async (req, res) => {
    try {
        const data = req.body;

        if (!data.client || !data.voiture || !data.services || !data.dateRendezVous || !data.mecanicien) {
            throw new Error("Les champs client, voiture et dateRendezVous sont obligatoires.");
        }

        const servicesAvecMecanicien = data.services.map(service => {
            return {
                ...service,
                mecanicien: data.mecanicien
            };
        });

        const rendezVousData = {
            ...data,
            services: servicesAvecMecanicien
        };

        const rendezVous = new RendezVous(rendezVousData);

        rendezVous.etat = 'en attente';

        await rendezVous.save();
        res.status(201).json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all RendezVous
exports.getAllRendezVous = async (req, res) => {
    try {
        const rendezVousList = await RendezVous.find()
            .populate('client')
            .populate('voiture')
            .populate('services.sousSpecialite')
            .populate('services.mecanicien')
            .populate('piecesAchetees.piece');
        res.json(rendezVousList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a RendezVous by ID
exports.getRendezVousById = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findById(req.params.id)
            .populate('client')
            .populate('voiture')
            .populate('services.sousSpecialite')
            .populate('services.mecanicien')
            .populate('piecesAchetees.piece');
        if (!rendezVous) {
            return res.status(404).json({ message: 'RendezVous not found' });
        }
        res.json(rendezVous);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a RendezVous
exports.updateRendezVous = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        .populate('client')
        .populate('voiture')
        .populate('services.sousSpecialite')
        .populate('services.mecanicien')
        .populate('piecesAchetees.piece');

        if (!rendezVous) {
            return res.status(404).json({ message: 'RendezVous not found' });
        }

        res.json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

async function populateRendezVous(query) {
    return query
        .populate({
            path: 'client',
            populate: {
                path: 'personne',
                model: 'Personne'
            }
        })
        .populate({
            path: 'voiture',
            populate: [
                { path: 'marque' },
                { path: 'modele' },
                { path: 'categorie' },
                { path: 'typeTransmission' }
            ]
        })
        .populate({
            path: 'services',
            populate: [
                {
                    path: 'sousSpecialite',
                    model: 'SousService',
                    populate: {
                        path: 'service',
                        model: 'Service'
                    }
                },
                { path: 'mecanicien', model: 'Personne' }
            ]
        })
        .populate({
            path: 'piecesAchetees.piece',
            model: 'Piece'
        });
}

// function globale
async function getRendezVous(query, res) {
    try {
        const rendezVous = await populateRendezVous(RendezVous.find(query)).exec();
        res.status(200).json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous." });
    }
}

// prendre rendezVous par etat
exports.getListRendezVousByEtat = async (req, res) => {
    try {
        const etat = req.body.etat;

        const etatsValides = ['en attente', 'validé', 'rejeté', 'annulé'];

        if (!etatsValides.includes(etat)) {
            return res.status(400).json({ message: "État de rendez-vous invalide." });
        }

        await getRendezVous({ etat: etat }, res); // Utiliser la fonction utilitaire

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous." });
    }
};

// prendre rendezVous par client
exports.getListRendezVousByClient = async (req, res) => {
    try {
        const clientId = req.params.clientId;

        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: "ID de client invalide." });
        }

        await getRendezVous({ client: clientId }, res); // Utiliser la fonction utilitaire

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous pour un client." });
    }
};

// prendre rendezVous par mecanicien
exports.getListRendezVousByMecanicien = async (req, res) => {
    try {
        const mecanicienId = req.params.mecanicienId;

        if (!mongoose.Types.ObjectId.isValid(mecanicienId)) {
            return res.status(400).json({ message: "ID de mécanicien invalide." });
        }

        await getRendezVous({ "services.mecanicien": mecanicienId }, res); // Utiliser la fonction utilitaire

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous par mécanicien." });
    }
};

exports.validateRendezVous = async (req, res) => {
    try {
        const rendezVousId = req.params.rendezVousId;
        const validateurId = req.body.validateurId;

        if (!mongoose.Types.ObjectId.isValid(rendezVousId)) {
            return res.status(400).json({ message: "ID de rendez-vous invalide." });
        }
        if (!mongoose.Types.ObjectId.isValid(validateurId)) {
            return res.status(400).json({ message: "ID de validateur invalide." });
        }

        const rendezVousMisAJour = await RendezVous.findByIdAndUpdate(
            rendezVousId,
            { etat: 'validé', validateur: validateurId },
            { new: true }
        ).populate({
            path: 'client',
            populate: {
                path: 'personne',
                model: 'Personne'
            }
        })
        .populate({
            path: 'voiture',
            populate: [
                { path: 'marque' },
                { path: 'modele' },
                { path: 'categorie' },
                { path: 'typeTransmission' }
            ]
        })
        .populate({
            path: 'services',
            populate: [
                {
                    path: 'sousSpecialite',
                    model: 'SousService',
                    populate: {
                        path: 'service',
                        model: 'Service'
                    }
                },
                { path: 'mecanicien', model: 'Personne' }
            ]
        })
        .populate({
            path: 'piecesAchetees.piece',
            model: 'Piece'
        });

        if (!rendezVousMisAJour) {
            return res.status(404).json({ message: "Rendez-vous non trouvé." });
        }

        res.status(200).json(rendezVousMisAJour);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la validation du rendez-vous." });
    }
};
