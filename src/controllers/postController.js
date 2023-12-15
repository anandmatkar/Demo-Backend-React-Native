import Post from '../models/postModel.js';

export const postCreate = async (req, res) => {
  try {
    const { caption } = req.body;

    const fileDetails = req.files.map((file) => ({
      path: `${process.env.Post_Files}/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    const user = req.user.id;

    const fileUrls = fileDetails.map((file) => file.path);

    const newPost = new Post({ user, caption, file_url: fileUrls });

    await newPost.save();

    res
      .status(201)
      .json({ message: 'Post created successfully', data: newPost });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Post creation failed', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  const userId = req.user.id;

  const { postId } = req.query;

  const { caption } = req.body;

  try {
    const post = await Post.findOne({ _id: postId, user: userId });

    if (!post) {
      return res.json({
        status: 400,
        success: false,
        message: 'Post not found',
      });
    }

    // Update the caption of the post
    post.caption = caption;
    await post.save();

    res.json({ status: 200, success: true, message: 'Post caption updated' });
  } catch (error) {
    return res.json({ status: 500, success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.query;

  try {
    const post = await Post.findOneAndDelete({ _id: postId, user: userId });

    if (!post) {
      return res.json({
        status: 400,
        success: false,
        message: 'Post not found',
      });
    }

    return res.json({
      status: 200,
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    return res.json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  const userId = req.user.id;
  try {
    const posts = await Post.find({ user: userId });

    if (!posts || posts.length === 0) {
      return res.json({
        status: 404,
        success: false,
        message: 'No posts found for this user',
      });
    }

    res.json({
      status: 200,
      success: true,
      message: 'All Post details',
      data: posts,
    });
  } catch (error) {
    return res.json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

export const getSinglePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.query;
  try {
    const post = await Post.findOne({ user: userId, _id: postId });

    if (!post) {
      return res.json({
        status: 404,
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      status: 200,
      success: true,
      message: 'Get Post details',
      data: post,
    });
  } catch (error) {
    return res.json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};
