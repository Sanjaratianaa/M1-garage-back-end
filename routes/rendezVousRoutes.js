const express = require('express');
const router = express.Router();
const rendezVousController = require('../controllers/rendezVousController');

router.post('/', rendezVousController.createRendezVous);
router.get('/', rendezVousController.getAllRendezVous);
router.get('/:id', rendezVousController.getRendezVousById);
router.get('/parClient/:clientId', rendezVousController.getListRendezVousByClient);
router.get('/parMecanicien/:mecanicienId', rendezVousController.getListRendezVousByMecanicien);
router.get('/parEtat/:etat', rendezVousController.getListRendezVousByEtat);
router.put('/:id', rendezVousController.updateRendezVous);

module.exports = router;