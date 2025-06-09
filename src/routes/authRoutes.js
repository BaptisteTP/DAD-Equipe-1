const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Création de compte
router.post('/register', register);

// Connexion
router.post('/login', login);

module.exports = router;
