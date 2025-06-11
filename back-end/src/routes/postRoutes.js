const express      = require('express');
const router       = express.Router();
const authenticate = require('../middleware/authJwt');
const {
  createPost,
  getUserPosts,
  getFeed,
} = require('../controllers/postController');

// Créer un post (Fx3)
router.post('/', authenticate, createPost);

// Récupérer le fil d’actualité (Fx5)
router.get('/feed', authenticate, getFeed);

// Récupérer tous les posts d’un profil (Fx4)
router.get('/user/:userId', authenticate, getUserPosts);

module.exports = router;
