const express      = require('express');
const router       = express.Router();
const authenticate = require('../middleware/authJwt');
const { getUserProfile } = require('../controllers/userController');

// GET /api/users/:userId
// Récupère le profil (username, bio, avatarUrl, dates) ainsi que
// le nombre d'abonnés/abonnements/posts et la liste de ses posts.
router.get('/:userId', authenticate, getUserProfile);

module.exports = router;
