const express      = require('express');
const router       = express.Router({ mergeParams: true });
const authenticate = require('../middleware/authJwt');
const { addComment, getComments } = require('../controllers/commentController');

// POST /api/posts/:postId/comments  → ajouter un commentaire ou une réponse
router.post('/', authenticate, addComment);

// GET /api/posts/:postId/comments   → lister tous les commentaires du post
router.get('/', authenticate, getComments);

module.exports = router;
