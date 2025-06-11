const Post   = require('../models/Post');
const Follow = require('../models/Follow');

const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || content.length > 280) {
      return res
        .status(400)
        .json({ message: 'Le contenu doit faire entre 1 et 280 caractères.' });
    }
    const newPost = await Post.create({
      author:  req.user._id,
      content,
    });
    // On renvoie le post peuplé pour que le front ait déjà username+avatar
    const post = await newPost.populate('author', 'username avatarUrl');
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    // 1) Récupérer la liste des users suivis
    const follows = await Follow.find({ follower: currentUserId }).select('following');
    const followingIds = follows.map(f => f.following);

    // On ajoute les tweets de l'utilisateur 
    followingIds.push(currentUserId);
    
    // 2) Récupérer tous les posts de ces users, les plus récents d'abord
    const feed = await Post.find({ author: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl');
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
