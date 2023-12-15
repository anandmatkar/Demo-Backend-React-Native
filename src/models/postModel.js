import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  file_url: [
    {
      type: String,
      required: true,
    },
  ],
  caption: String,

  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Post', postSchema);
