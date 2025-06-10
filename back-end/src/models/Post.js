const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 280,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
//on gère les likes dans une collection séparée "Like".
  },
  {
    timestamps: true,
  }
);

// Index pour trier rapidement par date 
PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
