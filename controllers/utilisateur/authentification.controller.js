const AuthenticationService = require('../../services/authentification.service');

const AuthenticationController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    const result = await AuthenticationService.authenticateUser(username, password);

    if (result.success) {
      res.json({ token: result.token, user: result.user });
    } else {
      res.status(401).json({ message: result.message });
    }
  },

  // Registration endpoint
  register: async (req, res) => {
    const { personne, motDePasse, idRole, dateEmbauche, etat } = req.body;

    const result = await AuthenticationService.createUser(personne, motDePasse, idRole, dateEmbauche, etat);

    if (result.success) {
      res.status(201).json({ message: result.message });  // 201 Created
    } else {
      res.status(500).json({ message: result.message }); // 500 Internal Server Error
    }
  },
};

module.exports = AuthenticationController;