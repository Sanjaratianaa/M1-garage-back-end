db.createCollection("stocks", {
    viewOn: "gestionstocks", 
    pipeline: [
        {
            $group: {
                _id: {
                    piece: "$piece",
                    marquePiece: { $toUpper: "$marquePiece" },
                    marqueVoiture: "$marqueVoiture",
                    modeleVoiture: "$modeleVoiture",
                    typeTransmission: "$typeTransmission"
                },
                entree: { $sum: "$entree" },
                sortie: { $sum: "$sortie" }
            }
        },
        {
            $addFields: {
                reste: { $subtract: ["$entree", "$sortie"] }
            }
        },
        {
            $lookup: {
                from: "pieces",
                localField: "_id.piece",
                foreignField: "_id",
                as: "pieceDetails"
            }
        },
        {
            $unwind: {
                path: "$pieceDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "marques",
                localField: "_id.marqueVoiture",
                foreignField: "_id",
                as: "marqueDetails"
            }
        },
        {
            $unwind: {
                path: "$marqueDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "modeles",
                localField: "_id.modeleVoiture",
                foreignField: "_id",
                as: "modeleDetails"
            }
        },
        {
            $unwind: {
                path: "$modeleDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "typetransmissions",
                localField: "_id.typeTransmission",
                foreignField: "_id",
                as: "typeTransmissionDetails"
            }
        },
        {
            $unwind: {
                path: "$typeTransmissionDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                piece: "$pieceDetails",
                marquePiece: "$_id.marquePiece",
                marqueVoiture: "$marqueDetails",
                modeleVoiture: "$modeleDetails",
                typeTransmission: "$typeTransmissionDetails",
                entree: 1,
                sortie: 1,
                reste: 1
            }
        }
    ]
});


db.gestionstocks.aggregate([
...     {
...         $group: {
...             _id: {
...                 piece: "$piece",
...                 marquePiece: { $toLower: "$marquePiece" },
...                 marqueVoiture: "$marqueVoiture",
...                 modeleVoiture: "$modeleVoiture",
...                 typeTransmission: "$typeTransmission"
...             },
...             totalEntree: { $sum: "$entree" },
...             totalSortie: { $sum: "$sortie" }
...         }
...     },
...     {
...         $addFields: {
...             reste: { $subtract: ["$totalEntree", "$totalSortie"] }
...         }
...     }
... ]);

db.stocks.find({ "marqueVoiture": null, "piece._id": ObjectId("67dcb6ec52052d86ff8ac06f") }).pretty()

//

db.counters.insertOne({ _id: "matricule_mecanicien", seq: 0 })
db.counters.insertOne({ _id: "matricule_manager", seq: 0 })
db.counters.insertOne({ _id: "matricule_client", seq: 0 })

{
  "client": "67e3071118c9673f291d3ad5",
  "voiture": "67e2701349b59270464e2879",
  "services": [
    {
      "sousSpecialite": "67e256a9811b3e52c586a96a",
      "raison": "Vidange d’huile",
      "quantiteEstimee": 30,
      "prixUnitaire": 8000
    }
  ],
  "mecanicien": "67e45508c4546a2b066d5d0a",
  "dateRendezVous": "2025-04-08T08:00:00.000Z"
}

mongo "mongodb+srv://layah:layah@garage.sl8qr.mongodb.net/garageDB?retryWrites=true&w=majority"

const today = new Date();
today.setHours(0, 0, 0, 0); // Pour avoir minuit

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1); // exclusif pour la dateFin >= today

const promo = await Promotion.findOne({
  sousService: ObjectId("67e256a9811b3e52c586a96a"), // <-- ton ID ici
  etat: "Active",
  dateDebut: { $lte: today },
  dateFin: { $gte: today }
})
.sort({ dateEnregistrement: -1 }) // la plus récente
.exec();
