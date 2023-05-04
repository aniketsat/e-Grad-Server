const User = require("../models/userModel");
const Post = require("../models/postModel");
const Reply = require("../models/replyModel");

const createPost = async (req, res) => {
  try {
    const { title, description, user, username } = req.body;
    console.log(req.body);

    // Check if valid user
    const validUser = await User.findById(user);
    if (!validUser) {
      return res.status(404).json({
        success: false,
        error: "No user found",
      });
    }

    const post = await Post.create({ title, description, user, username });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "No post found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "No post found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    // check if the post belongs to the user
    let post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user._id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this post",
      });
    }

    post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "No post found",
      });
    }

    // Delete all replies of the post
    await Reply.deleteMany({ post: req.params.id });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
