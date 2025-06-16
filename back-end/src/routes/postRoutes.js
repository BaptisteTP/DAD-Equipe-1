const express      = require('express');
const { body }    = require('express-validator');
const router       = express.Router();
const authenticate = require('../middleware/authJwt');
const { createPost, getUserPosts, getFeed } = require('../controllers/postController');
const validate   = require('../middleware/validate');

// Créer un post
router.post(
  '/',
  authenticate,
  [
    body('content')
      .isLength({ min: 1, max: 280 })
      .withMessage('Le contenu doit faire entre 1 et 280 caractères.')
  ],
  validate,
  createPost
);

// Récupérer le fil d’actualité 
router.get('/feed', authenticate, getFeed);

// Récupérer tous les posts d’un profil 
router.get('/user/:userId', authenticate, getUserPosts);

module.exports = router;
