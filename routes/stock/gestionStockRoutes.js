const express = require('express');
const router = express.Router();
const gestionStockController = require('../../controllers/stock/gestionStockController');

router.post('/', gestionStockController.createGestionStock);
router.get('/', gestionStockController.getAllGestionStocks);
router.get('/:id', gestionStockController.getGestionStockById);
router.put('/:id', gestionStockController.updateGestionStock);
router.delete('/:id', gestionStockController.deleteGestionStock);

module.exports = router;