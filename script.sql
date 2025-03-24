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