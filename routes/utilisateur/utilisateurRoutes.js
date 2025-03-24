const express = require('express');
const router = express.Router();
const utilisateurController = require('../../controllers/utilisateur/utilisateurController');

router.post('/', utilisateurController.createUser);
router.get('/', utilisateurController.getAllUsers);
router.get('/:id', utilisateurController.getUserById);
router.put('/:id', utilisateurController.updateUser);
router.delete('/:id', utilisateurController.deleteUser);

// by role
router.delete('/active-utilisateurs-by-role', utilisateurController.getActiveUsersByRole);

module.exports = router;