const express = require('express');
const { body, param } = require('express-validator');
const authenticate = require('../middleware/authJwt');
const validate = require('../middleware/validate');

const {
  getUserProfile,
  getAllUsers,
  updateProfile,
  deleteAccount
} = require('../controllers/userController');

const router = express.Router();

// Liste de tous les utilisateurs (username + avatarUrl)
router.get('/', authenticate, getAllUsers);

// Récupérer le profil + stats + posts d’un utilisateur
router.get(
  '/:userId',
  authenticate,
  [param('userId').isMongoId().withMessage('userId invalide.')],
  validate,
  getUserProfile
);

// Mettre à jour bio / avatar
router.patch(
  '/:userId',
  authenticate,
  [
    param('userId').isMongoId().withMessage('userId invalide.'),
    body('bio').optional().isString().isLength({ max: 160 }),
    body('avatarUrl').optional().isURL().withMessage('URL invalide')
  ],
  validate,
  updateProfile
);

// Supprimer son compte
router.delete(
  '/:userId',
  authenticate,
  [param('userId').isMongoId().withMessage('userId invalide.')],
  validate,
  deleteAccount
);

module.exports = router;
