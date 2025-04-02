const mongoose = require('mongoose');
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
        if (req.user.role.libelle == "client")
            query = {
                $or: [
                    { client: req.user.idPersonne },
                    {
                        client: { $ne: req.user.idPersonne },
                        etat: { $in: ['en attente', 'validé'] }
                    }
                ]
            };

        else if (req.user.role.libelle == "mécanicien")
            query = { etat: { $in: ['en attente', 'validé'] } };

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
            .populate('validateur')
            .populate({
                path: 'piecesAchetees.piece',
                model: 'Piece'
            })
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
            .populate('validateur')
            .populate({
                path: 'piecesAchetees.piece',
                model: 'Piece'
            });
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
            .populate('validateur')
            .populate({
                path: 'piecesAchetees.piece',
                model: 'Piece'
            });

        if (!rendezVous) {
            return res.status(404).json({ message: 'Rendez-vous not found' });
        }

        res.json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

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
            .populate('validateur')
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
        if (req.user.role.libelle == "client")
            query = { client: req.user.idPersonne };

        const etat = req.params.etat;
        const etatsValides = ['en attente', 'validé', 'rejeté', 'annulé'];
        if (!etatsValides.includes(etat)) {
            return res.status(400).json({ message: "État de rendez-vous invalide." });
        }
        query.etat = etat;
        await getRendezVous(query, res); // Utiliser la fonction utilitaire

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous." });
    }
};

// prendre rendezVous par client
exports.getListRendezVousByClient = async (req, res) => {
    try {
        const clientId = req.user.idPersonne;
        var query = {};
        if (req.user.role.libelle == "client")
            query = { client: clientId }

        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: "ID de client invalide." });
        }

        await getRendezVous(query, res); // Utiliser la fonction utilitaire

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous pour un client." });
    }
};

// prendre rendezVous par mecanicien
exports.getListRendezVousByMecanicien = async (req, res) => {
    try {
        const mecanicienId = req.user.idPersonne;

        if (!mongoose.Types.ObjectId.isValid(mecanicienId)) {
            return res.status(400).json({ message: "ID de mécanicien invalide." });
        }

        await getRendezVous({ "services.mecanicien": mecanicienId }, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous par mécanicien." });
    }
};

exports.modifierRendezVous = async (req, res) => {
    try {
        const rendezVousId = req.params.id;
        const actions = req.body.actions;

        if (!mongoose.Types.ObjectId.isValid(rendezVousId)) {
            throw new Error("ID de rendez-vous invalide.");
        }

        if (!Array.isArray(actions)) {
            throw new Error("Les actions doivent être un tableau.");
        }

        let updates = {};
        let hasUpdates = false;

        for (const actionObj of actions) {
            const action = actionObj.action;
            const { nouveauMecanicienId, commentaire, services } = actionObj;

            const actionsValides = ['validé', 'rejeté', 'assignerMecanicien', 'annulé'];

            if (!actionsValides.includes(action)) {
                return res.status(400).json({ message: `Action invalide : ${action}.` });
            }

            switch (action) {
                case 'annulé':
                    if (!commentaire) {
                        throw new Error("La raison de l'annulation est obligatoire.");
                    }
                    updates.etat = 'annulé';
                    updates.remarque = commentaire;
                    hasUpdates = true;
                    break;

                case 'validé':
                    const rendezVous = await RendezVous.findById(rendezVousId);
                    const today = new Date();
                    const dateToCheck = rendezVous.dateRendezVous; // Conversion en Date

                    console.log(dateToCheck + " < ? " + today);

                    const formattedDate = new Intl.DateTimeFormat('fr-FR', { 
                        weekday: 'long', 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit', 
                    }).format(new Date(dateToCheck));

                    if (dateToCheck < today)
                        throw new Error(`La demande de  rendez-vous n'est plus valide, car la date et l'heure (${formattedDate}) demandées sont déjà passées.`);

                    if (!services) {
                        throw new Error("L'assignation d'au moins un mécanicien est obligatoire pour poursuivre.");
                    }

                    for (const service of services) {
                        service.mecanicien = service.mecanicien.personne._id;
                    }

                    updates.etat = 'validé';
                    updates.validateur = req.user.idPersonne;
                    updates.remarque = commentaire;
                    updates.services = services;
                    hasUpdates = true;
                    break;

                case 'rejeté':
                    if (!commentaire) {
                        throw new Error("La raison du rejet est obligatoire.");
                    }
                    updates.etat = 'rejeté';
                    updates.validateur = req.user.idPersonne;
                    updates.remarque = commentaire;
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
            rendezVousMisAJour = await RendezVous.findByIdAndUpdate(
                rendezVousId,
                updates,
                { new: true }
            );

            if (!rendezVousMisAJour) {
                throw new Error("Rendez-vous non trouvé.");
            }
        }
        await getRendezVous({ _id: rendezVousId }, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}; 