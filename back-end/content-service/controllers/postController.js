const axios = require('axios');
const Post  = require('../models/Post');

// URL de base du user‐service (nom du service Docker ou URL en prod)
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:4001';

/**
 * Crée un post en embeddant l'auteur (username + avatar) dans le document.
 */
const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || content.length > 280) {
      return res
        .status(400)
        .json({ message: 'Le contenu doit faire entre 1 et 280 caractères.' });
    }

    // 1) Récupérer les infos de l'utilisateur depuis le user‐service
    const token = req.headers.authorization;
    const { data: userData } = await axios.get(
      `${USER_SERVICE_URL}/api/users/${req.user.userId}`,
      { headers: { Authorization: token } }
    );

    // 2) Créer le post en stockant l'id + info statiques de l'auteur
    const newPost = await Post.create({
      authorId:        req.user.userId,
      authorUsername:  userData.username,
      authorAvatarUrl: userData.avatarUrl,
      content,
    });

    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

/**
 * Récupère tous les posts d'un utilisateur.
 */
const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

/**
 * Récupère le fil d’actualité : posts des utilisateurs suivis + les siens.
 */
const getFeed = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const currentUserId = req.user.userId;

    // 1) Appel au user‐service pour avoir la liste des suivis
    const { data: followingUsers } = await axios.get(
      `${USER_SERVICE_URL}/api/users/${currentUserId}/following`,
      { headers: { Authorization: token } }
    );
    const followingIds = followingUsers.map(u => u._id);

    // Inclure ses propres posts
    followingIds.push(currentUserId);

    // 2) Récupérer les posts de ces auteurs
    const feed = await Post.find({ authorId: { $in: followingIds } })
      .sort({ createdAt: -1 });

    res.json(feed);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  getUserPosts,
  getFeed,
};