const RendezVous = require('../models/RendezVous');

// Create a new RendezVous
exports.createRendezVous = async (req, res) => {
    try {
        const data = req.body;
        data.client = req.user.idPersonne;

        const today = new Date();
        const dateToCheck = new Date(data.dateRendezVous); // Conversion en Date

        console.log(dateToCheck + " < ? " + today);

        if (dateToCheck < today) 
            throw new Error(`Date et heure du rendez-vous invalide. La Date et heure du rendez-vous doit être supérieure ou égale à la date et heure du jour.`);

        if (!data.client || !data.voiture || !data.services || !data.dateRendezVous) {
            throw new Error("Les champs client, voiture et date du Rendez-vous sont obligatoires.");
        }

        // const servicesAvecMecanicien = data.services.map(service => {
        //     return {
        //         ...service,
        //         mecanicien: data.mecanicien
        //     };
        // });

        // const rendezVousData = {
        //     ...data,
        //     services: servicesAvecMecanicien
        // };

        const rendezVousSave = new RendezVous(data);
        rendezVousSave.etat = 'en attente';
        await rendezVousSave.save();

        const rendezVous = await RendezVous.findById(rendezVousSave._id)
            .populate('client')
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
            })
            .sort({ dateHeureDemande: -1 });

        console.log(rendezVous);

        res.status(201).json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all RendezVous
exports.getAllRendezVous = async (req, res) => {
    try {
        var query = {};
        if(req.user.role.libelle == "client")
            query = {client : req.user.idPersonne};

        const rendezVousList = await RendezVous.find(query)
            .populate('client')
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
            })
            .populate('piecesAchetees.piece')
            .sort({ dateHeureDemande: -1 });
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
            .populate('piecesAchetees.piece')
            ;
        if (!rendezVous) {
            return res.status(404).json({ message: 'RendezVous not found' });
        }
        res.json(rendezVous);
    } catch (error) {
        console.error(error);
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
        const rendezVous = await RendezVous.find(query)
            .populate('client')
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
            })
            .sort({ dateHeureDemande: -1 });
        res.status(200).json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous." });
    }
}

// prendre rendezVous par etat
exports.getListRendezVousByEtat = async (req, res) => {
    try {
        var query = {};
        if(req.user.role.libelle == "client")
            query = {client : req.user.idPersonne};

        const etat = req.params.etat;
        const etatsValides = ['en attente', 'validé', 'rejeté', 'annulé'];
        if (!etatsValides.includes(etat)) {
            return res.status(400).json({ message: "État de rendez-vous invalide." });
        }
        query.etat = etat ;
        await getRendezVous(query, res); // Utiliser la fonction utilitaire

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

exports.modifierRendezVous = async (req, res) => {
    try {
        const rendezVousId = req.params.rendezVousId;
        const actions = req.body.actions;

        if (!mongoose.Types.ObjectId.isValid(rendezVousId)) {
            return res.status(400).json({ message: "ID de rendez-vous invalide." });
        }

        if (!Array.isArray(actions)) {
            return res.status(400).json({ message: "Les actions doivent être un tableau." });
        }

        let updates = {};
        let hasUpdates = false;

        for (const actionObj of actions) {
            const action = actionObj.action;
            const { validateurId, nouveauMecanicienId, raisonRejet } = actionObj;

            const actionsValides = ['validé', 'rejeté', 'assignerMecanicien'];

            if (!actionsValides.includes(action)) {
                return res.status(400).json({ message: `Action invalide : ${action}.` });
            }

            switch (action) {
                case 'validé':
                    if (!mongoose.Types.ObjectId.isValid(validateurId)) {
                        return res.status(400).json({ message: "ID de validateur invalide." });
                    }
                    updates.etat = 'validé';
                    updates.validateur = validateurId;
                    hasUpdates = true;
                    break;

                case 'rejeté':
                    if (!raisonRejet) {
                        return res.status(400).json({ message: "La raison du rejet est obligatoire." });
                    }
                    updates.etat = 'rejeté';
                    updates.raisonRejet = raisonRejet;
                    hasUpdates = true;
                    break;

                case 'assignerMecanicien':
                    if (!mongoose.Types.ObjectId.isValid(nouveauMecanicienId)) {
                        return res.status(400).json({ message: "ID de mécanicien invalide." });
                    }
                    updates["services.$[].mecanicien"] = nouveauMecanicienId;
                    hasUpdates = true;
                    break;
            }
        }

        // Mettre à jour le rendez-vous (seulement s'il y a des mises à jour)
        let rendezVousMisAJour;
        if (hasUpdates) {
            rendezVousMisAJour = await populateRendezVous(RendezVous.findByIdAndUpdate(
                rendezVousId,
                updates,
                { new: true }
            ));


            if (!rendezVousMisAJour) {
                return res.status(404).json({ message: "Rendez-vous non trouvé." });
            }
        } else {
            rendezVousMisAJour = await populateRendezVous(RendezVous.findById(rendezVousId));


            if (!rendezVousMisAJour) {
                return res.status(404).json({ message: "Rendez-vous non trouvé." });
            }
        }
        res.status(200).json(rendezVousMisAJour);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la modification du rendez-vous." });
    }
};