const express      = require('express');
const router       = express.Router({ mergeParams: true });
const authenticate = require('../middleware/authJwt');
const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
} = require('../controllers/followController');

// POST   /api/users/:userId/follow    → suivre
router.post('/:userId/follow', authenticate, followUser);

// DELETE /api/users/:userId/follow    → se désabonner
router.delete('/:userId/follow', authenticate, unfollowUser);

// GET    /api/users/:userId/following → liste des suivis
router.get('/:userId/following', authenticate, getFollowing);

// GET    /api/users/:userId/followers → liste des abonnés
router.get('/:userId/followers', authenticate, getFollowers);

module.exports = router;
