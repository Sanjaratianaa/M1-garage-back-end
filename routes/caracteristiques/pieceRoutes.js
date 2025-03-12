const express = require('express');
const router = express.Router();
const pieceController = require('../../controllers/caracteristiques/pieceController');

router.post('/', pieceController.createPiece);
router.get('/', pieceController.getAllPieces);
router.get('/:id', pieceController.getPieceById);
router.put('/:id', pieceController.updatePiece);
router.delete('/:id', pieceController.deletePiece);

module.exports = router;