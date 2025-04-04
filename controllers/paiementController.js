const Paiement = require("../models/Paiement");

// Create a new Paiement
exports.createPaiement = async (req, res) => {
    try {
        const paiement = new Paiement(req.body);
        await paiement.save();
        res.status(201).json(paiement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Paiements
exports.getAllPaiements = async (req, res) => {
    try {
        const promotions = await Paiement.find()
            .populate("rendezVous")
            .populate("mecanicien");
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateEmptyMonths = () => {
    return Array.from({ length: 12 }, (_, i) => ({
        mois: (i + 1).toString().padStart(2, '0'),  // Format mois en "01", "02", ...
        total: 0
    }));
};

const aggregatePaiements = async (matchStage) => {
    return Paiement.aggregate([
        ...matchStage,
        {
            $group: {
                _id: {
                    annee: { $year: "$datePaiement" },
                    mois: { $month: "$datePaiement" },
                },
                totalMontant: { $sum: "$montant" },
            },
        },
        { $sort: { "_id.annee": 1, "_id.mois": 1 } },
    ]);
};

const formatPaiements = (paiements) => {
    const months = generateEmptyMonths();
    paiements.forEach(paiement => {
        const month = months.find(m => m.mois === paiement._id.mois.toString().padStart(2, '0'));
        if (month) {
            month.total = paiement.totalMontant;
        }
    });
    return months;
};

exports.getPaiementsParMois = async (req, res) => {
    try {
        const { annee, mois } = req.query;
        
        const matchStage = [];
        
        // Si l'année est fournie, appliquer le filtre par année
        if (annee) {
            matchStage.push({
                $match: {
                    datePaiement: {
                        $gte: new Date(`${annee}-01-01`),
                        $lte: new Date(`${annee}-12-31`),
                    },
                },
            });
            
            // Si un mois est spécifié, appliquer le filtre par mois
            if (mois) {
                matchStage.push({
                    $match: {
                        $expr: {
                            $eq: [{ $month: "$datePaiement" }, parseInt(mois)],
                        },
                    },
                });
            }
        }

        // Exécution de l'agrégation
        const paiements = await aggregatePaiements(matchStage);

        // Format des paiements (détails par mois)
        const details = formatPaiements(paiements);

        // Calcul du total des paiements pour l'année
        const totalMontant = details.reduce((acc, month) => acc + month.total, 0);

        // Construction du résultat
        const result = {
            _id: {
                annee: parseInt(annee),
                mois: mois ? mois : null,  // Inclure le mois dans le résultat si spécifié
            },
            totalMontant,
            details,
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a Paiement by ID
exports.getPaiementById = async (req, res) => {
    try {
        const paiement = await Paiement.findById(req.params.id)
            .populate("rendezVous")
            .populate("mecanicien");
        if (!paiement) {
            return res.status(404).json({ message: "Paiement not found" });
        }
        res.json(paiement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Paiement
exports.updatePaiement = async (req, res) => {
    try {
        const paiement = await Paiement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        )
            .populate("rendezVous")
            .populate("mecanicien");

        if (!paiement) {
            return res.status(404).json({ message: "Paiement not found" });
        }

        res.json(paiement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Paiement
exports.deletePaiement = async (req, res) => {
    try {
        const paiement = await Paiement.findByIdAndDelete(req.params.id);
        if (!paiement) {
            return res.status(404).json({ message: "Paiement not found" });
        }
        res.json({ message: "Paiement deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
