const express = require('express');
const router = express.Router();

// Import sub-routes
const voitureRoutes = require('./voitureRoutes');
const categorieRoutes = require('./categorieRoutes');   

// Use sub-routes
router.use('/articles', voitureRoutes);
router.use('/categories', categorieRoutes);

module.exports = router;