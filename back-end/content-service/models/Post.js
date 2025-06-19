const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  authorId:        { type: String, required: true },
  authorUsername:  { type: String, required: true },
  authorAvatarUrl: { type: String, default: '' },
  content:         { type: String, required: true, maxlength: 280 },
  likesCount:      { type: Number, default: 0 },
}, { timestamps: true });

// Index pour trier rapidement par date 
PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
