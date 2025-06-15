const Comment = require('../models/Comment');
const Post    = require('../models/Post');

const addComment = async (req, res, next) => {
  try {
    const { content, parentComment } = req.body;
    const { postId } = req.params;

    // Validation
    if (!content || content.length > 280) {
      return res
        .status(400)
        .json({ message: 'Le commentaire doit faire entre 1 et 280 caractères.' });
    }
    // Vérifier que le post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post introuvable.' });
    }

    // Créer le commentaire
    const comment = await Comment.create({
      author:        req.user._id,
      post:          postId,
      content,
      parentComment: parentComment || null,
    });

    // On renvoie le commentaire peuplé (auteur)
    const populated = await comment
      .populate('author', 'username avatarUrl')
      .execPopulate();

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Vérifier que le post existe
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post introuvable.' });
    }

    // Récupérer tous les commentaires du post, triés par date
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: 1 })
      .populate('author', 'username avatarUrl');

    res.json(comments);
  } catch (err) {
    next(err);
  }
};

module.exports = { addComment, getComments };
