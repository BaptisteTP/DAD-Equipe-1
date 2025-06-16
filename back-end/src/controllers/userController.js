// src/controllers/userController.js
const User   = require('../models/User');
const Post   = require('../models/Post');
const Comment= require('../models/Comment');
const Like   = require('../models/Like');
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

// PATCH /api/users/:userId
const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // On n'autorise que la MAJ de son propre profil
    if (!req.user._id.equals(userId)) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    // Champs autorisés
    const { bio, avatarUrl } = req.body;
    const updates = {};
    if (bio !== undefined)       updates.bio = bio;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, select: '-password' }
    );

    res.json({ message: 'Profil mis à jour.', user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:userId
const deleteAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!req.user._id.equals(userId)) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    // 1) Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);

    // 2) Supprimer tout ce qui se rapporte à lui
    await Promise.all([
      Post.deleteMany({ author: userId }),
      Comment.deleteMany({ author: userId }),
      Like.deleteMany({ user: userId }),
      Follow.deleteMany({ follower: userId }),
      Follow.deleteMany({ following: userId }),
    ]);

    res.json({ message: 'Compte et données associées supprimés.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  deleteAccount
};
