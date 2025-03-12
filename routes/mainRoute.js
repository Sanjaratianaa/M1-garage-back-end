const express = require('express');
const router = express.Router();
 
const roleRoutes = require('./utilisateur/roleRoutes');
const personneRoutes = require('./utilisateur/personneRoutes');

const categorieRoutes = require('./caracteristiques/categorieRoutes');  
const marqueRoutes = require('./caracteristiques/marqueRoutes');
const modeleRoutes = require('./caracteristiques/modeleRoutes');
const pieceRoutes = require('./caracteristiques/pieceRoutes');
const typeTransmissionRoutes = require('./caracteristiques/typeTransmissionRoutes');

const voitureRoutes = require('./voitureRoutes');

// authentification
router.use('/role', roleRoutes);
router.use('/personne', personneRoutes);

// caracteritiques
router.use('/articles', voitureRoutes);
router.use('/categories', categorieRoutes);
router.use('/marques', marqueRoutes);
router.use('/modeles', modeleRoutes);
router.use('/pieces', pieceRoutes);
router.use('/transmissions', typeTransmissionRoutes);

module.exports = router;