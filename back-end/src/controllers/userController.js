// src/controllers/userController.js
const User   = require('../models/User');
const Post   = require('../models/Post');
const Follow = require('../models/Follow');

const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // 1) Récupérer l'utilisateur (sans le mot de passe)
    const user = await User.findById(userId)
      .select('-password')
      .lean();
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // 2) Compter abonnés & abonnements
    const followersCount = await Follow.countDocuments({ following: userId });
    const followingCount = await Follow.countDocuments({ follower: userId });

    // 3) Récupérer ses posts (du plus récent au plus ancien)
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl');

    // 4) Retourner le profil + stats + posts
    res.json({
      user,
      stats: {
        followersCount,
        followingCount,
        postsCount: posts.length,
      },
      posts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserProfile };
