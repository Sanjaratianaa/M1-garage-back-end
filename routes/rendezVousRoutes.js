const express = require('express');
const router = express.Router();
const rendezVousController = require('../controllers/rendezVousController');

router.get('/liste/parClient', rendezVousController.getListRendezVousByClient);
router.get('/parMecanicien', rendezVousController.getListRendezVousByMecanicien);
router.get('/parEtat/:etat', rendezVousController.getListRendezVousByEtat);
router.get('/:id', rendezVousController.getRendezVousById);
router.post('/', rendezVousController.createRendezVous);
router.get('/', rendezVousController.getAllRendezVous);
router.put('/repondre/:id', rendezVousController.modifierRendezVous);
router.put('/:id', rendezVousController.updateRendezVous);

module.exports = router;