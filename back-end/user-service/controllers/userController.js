const User   = require('../models/User');
const Follow = require('../models/Follow');

/**
 * GET /api/users/:userId
 * Récupère le profil d'un utilisateur + stats abonnés/abonnements
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // 1) Récupérer l’utilisateur (sans le password)
    const user = await User.findById(userId)
      .select('-password')
      .lean();
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // 2) Compter abonnés & abonnements
    const followersCount = await Follow.countDocuments({ following: userId });
    const followingCount = await Follow.countDocuments({ follower: userId });

    // 3) Retourner le profil et les statistiques
    res.json({
      user,
      stats: {
        followersCount,
        followingCount
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/users/:userId
 * Met à jour la bio et/ou l’avatar de l’utilisateur connecté
 */
const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // On n’autorise que l’utilisateur lui-même
    if (!req.user._id.equals(userId)) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

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

/**
 * DELETE /api/users/:userId
 * Supprime le compte et toutes les relations de suivi (mais PAS les posts)
 */
const deleteAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!req.user._id.equals(userId)) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }

    // 1) Supprimer l’utilisateur
    await User.findByIdAndDelete(userId);

    // 2) Supprimer ses relations follow
    await Promise.all([
      Follow.deleteMany({ follower: userId }),
      Follow.deleteMany({ following: userId })
    ]);

    res.json({ message: 'Compte utilisateur et relations supprimés.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  deleteAccount
};