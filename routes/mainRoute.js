const express = require('express');
const router = express.Router();
 
const roleRoutes = require('./utilisateur/roleRoutes');
const personneRoutes = require('./utilisateur/personneRoutes');
const utilisateurRoutes = require('./utilisateur/utilisateurRoutes');

const categorieRoutes = require('./caracteristiques/categorieRoutes');  
const marqueRoutes = require('./caracteristiques/marqueRoutes');
const modeleRoutes = require('./caracteristiques/modeleRoutes');
const pieceRoutes = require('./caracteristiques/pieceRoutes');
const typeTransmissionRoutes = require('./caracteristiques/typeTransmissionRoutes');

const prixPieceRoutes = require('./prix/prixPieceRoutes');
const prixSousServiceRoutes = require('./prix/prixSousServiceRoutes');

const serviceRoutes = require('./services/serviceRoutes');
const sousServiceRoutes = require('./services/sousServiceRoutes');

const manuelRoutes = require('./manuelRoutes');
const promotionRoutes = require('./promotionRoutes');
const demandeCongeRoutes = require('./demandeCongeRoutes');
const voitureRoutes = require('./voitureRoutes');
const rendezVousRoutes = require('./rendezVousRoutes');

// authentification
router.use('/role', roleRoutes);
router.use('/personne', personneRoutes);
router.use('/utilisateur', utilisateurRoutes);

// caracteritiques
router.use('/categories', categorieRoutes);
router.use('/marques', marqueRoutes);
router.use('/modeles', modeleRoutes);
router.use('/pieces', pieceRoutes);
router.use('/transmissions', typeTransmissionRoutes);

// prix
router.use('/prixPieces', prixPieceRoutes);
router.use('/prixSousServices', prixSousServiceRoutes);

// services
router.use('/services', serviceRoutes);
router.use('/sousServices', sousServiceRoutes);

router.use('/manuels', manuelRoutes);
router.use('/promotions', promotionRoutes);
router.use('/conges', demandeCongeRoutes);
router.use('/voitures', voitureRoutes);
router.use('/rendezVous', rendezVousRoutes);

module.exports = router;