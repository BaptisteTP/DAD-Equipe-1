// src/routes/userRoutes.js
const express      = require('express');
const router       = express.Router();
const authenticate = require('../middleware/authJwt');
const {
  getUserProfile,
  updateProfile,
  deleteAccount
} = require('../controllers/userController');

// GET   /api/users/:userId         → profil + stats + posts
router.get('/:userId', authenticate, getUserProfile);

// PATCH /api/users/:userId         → mise à jour bio/avatar
router.patch('/:userId', authenticate, updateProfile);

// DELETE /api/users/:userId        → suppression de compte et cascade
router.delete('/:userId', authenticate, deleteAccount);

module.exports = router;
