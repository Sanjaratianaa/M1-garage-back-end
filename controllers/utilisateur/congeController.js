const mongoose = require("mongoose");
const Conge = require("../../models/utilisateur/Conge");

// Create a new Conge
exports.createConge = async (req, res) => {
    try {
        const data = req.body;
        data.mecanicien = req.user.idPersonne;

        const today = new Date();
        const dateToCheck = new Date(data.dateConge); // Conversion en Date

        console.log(dateToCheck + " < ? " + today);

        if (dateToCheck < today)
            throw new Error(
                `Date et heure du congés invalide. La Date et heure du congés doit être supérieure ou égale à la date et heure du jour.`,
            );

        if (
            !data.client ||
            !data.voiture ||
            !data.services ||
            !data.dateConge
        ) {
            throw new Error(
                "Les champs client, voiture et date du Conge sont obligatoires.",
            );
        }

        const congeSave = new Conge(data);
        congeSave.etat = "en attente";
        await congeSave.save();

        const conge = await Conge.findById(congeSave._id)
            .populate("mecanicien")
            .sort({ dateHeureDemande: -1 });

        console.log(conge);

        res.status(201).json(conge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Conge
exports.getAllConge = async (req, res) => {
    try {
        var query = {};
        if (req.user.role.libelle == "mécanicien")
            query = {
                $or: [
                    { mecanicien: req.user.idPersonne },
                    {
                        mecanicien: { $ne: req.user.idPersonne },
                        etat: { $in: ["en attente", "validé"] },
                    },
                ],
            };

        const congeList = await Conge.find(query)
            .populate("mecanicien")
            .populate("validateur")
            .sort({ dateHeureDemande: -1 })
            .lean();
        res.json(congeList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Conge by ID
exports.getCongeById = async (req, res) => {
    try {
        const conge = await Conge.findById(req.params.id)
            .populate('mecanicien');
        if (!conge) {
            return res.status(404).json({ message: "Conge not found" });
        }
        res.json(conge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateConge = async (req, res) => {
    try {
        const conge = await Conge.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('mecanicien');

        if (!conge) {
            return res.status(404).json({ message: 'Conge not found' });
        }

        res.json(conge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// function globale
async function getConge(query, res) {
    try {
        const conge = await Conge.find(query)
            .populate('mecanicien')
            .sort({ dateHeureDemande: -1 });
        res.status(200).json(conge);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des congés.",
        });
    }
}

// prendre conge par etat
exports.getListCongeByEtat = async (req, res) => {
    try {
        var query = {};
        if (req.user.role.libelle == "mécanicien")
            query = { mecanicien: req.user.idPersonne };

        const etat = req.params.etat;
        const etatsValides = ["en attente", "validé", "rejeté", "annulé"];
        if (!etatsValides.includes(etat)) {
            throw new Error("État du congé invalide.");
        }
        query.etat = etat;
        await getConge(query, res); // Utiliser la fonction utilitaire
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des congés.",
        });
    }
};

// prendre conge par mecanicien
exports.getListCongeByMecanicien = async (req, res) => {
    try {
        const mecanicienId = req.user.idPersonne;
        var query = {};
        if (req.user.role.libelle == "mécanicien") 
            query = { mecanicien: mecanicienId };

        if (!mongoose.Types.ObjectId.isValid(mecanicienId)) {
            throw new Error("ID de mecanicien invalide.");
        }

        await getConge(query, res); // Utiliser la fonction utilitaire
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:
                error.message,
        });
    }
};

exports.modifierConge = async (req, res) => {
    try {
        const congeId = req.params.id;
        const actions = req.body.actions;

        if (!mongoose.Types.ObjectId.isValid(congeId)) {
            throw new Error("ID de congés invalide.");
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
                return res
                    .status(400)
                    .json({ message: `Action invalide : ${action}.` });
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
                    const conge = await Conge.findById(congeId);
                    const today = new Date();
                    const dateToCheck = conge.dateConge; // Conversion en Date

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
                        throw new Error(`La demande de  congés n'est plus valide, car la date et l'heure (${formattedDate}) demandées sont déjà passées.`);

                    if (!services) {
                        throw new Error(
                            "L'assignation d'au moins un mécanicien est obligatoire pour poursuivre.",
                        );
                    }

                    for (const service of services) {
                        service.mecanicien = service.mecanicien.personne._id;
                    }

                    updates.etat = "validé";
                    updates.validateur = req.user.idPersonne;
                    updates.remarque = commentaire;
                    updates.services = services;
                    hasUpdates = true;
                    break;

                case "rejeté":
                    if (!commentaire) {
                        throw new Error("La raison du rejet est obligatoire.");
                    }
                    updates.etat = "rejeté";
                    updates.validateur = req.user.idPersonne;
                    updates.remarque = commentaire;
                    hasUpdates = true;
                    break;

                case "assignerMecanicien":
                    if (!mongoose.Types.ObjectId.isValid(nouveauMecanicienId)) {
                        return res
                            .status(400)
                            .json({ message: "ID de mécanicien invalide." });
                    }
                    updates["services.$[].mecanicien"] = nouveauMecanicienId;
                    hasUpdates = true;
                    break;
            }
        }

        // Mettre à jour le congés (seulement s'il y a des mises à jour)
        let congeMisAJour;
        if (hasUpdates) {
            congeMisAJour = await Conge.findByIdAndUpdate(
                congeId,
                updates,
                { new: true },
            );

            if (!congeMisAJour) {
                throw new Error("Conge non trouvé.");
            }
        }
        await getConge({ _id: congeId }, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};