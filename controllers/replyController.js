const Reply = require("../models/replyModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");

// @Route     POST /api/replies
// @Desc      Create a reply to a post
// @Access    Private
const createReply = async (req, res) => {
  try {
    const { reply, user, username, post } = req.body;

    // Check if valid post
    const validPost = await Post.findById(post);
    if (!validPost) {
      return res.status(404).json({
        success: false,
        error: "No post found",
      });
    }

    // Check if valid user
    const validUser = await User.findById(user);
    if (!validUser) {
      return res.status(404).json({
        success: false,
        error: "No user found",
      });
    }

    const newReply = await Reply.create({ reply, user, username, post });

    res.status(201).json({
      success: true,
      data: newReply,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @Route     GET /api/replies
// @Desc      Get all replies of a post
// @Access    Private
const getReplies = async (req, res) => {
  try {
    // Get all replies
    const replies = await Reply.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: replies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @Route     GET /api/replies/:id
// @Desc      Get a reply
// @Access    Private
const getReply = async (req, res) => {
  res.send("Get a reply");
};

// @Route     PUT /api/replies/:id
// @Desc      Update a reply
// @Access    Private
const updateReply = async (req, res) => {
  res.send("Update a reply");
};

// @Route     DELETE /api/replies/:id
// @Desc      Delete a reply
// @Access    Private
const deleteReply = async (req, res) => {
  try {
    // Check if valid reply
    const validReply = await Reply.findById(req.params.id);
    if (!validReply) {
      return res.status(404).json({
        success: false,
        error: "No reply found",
      });
    }

    // Check if the user is the owner of the reply
    if (validReply.user.toString() !== req.user._id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized",
      });
    }

    await Reply.findByIdAndDelete(validReply._id);

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
  createReply,
  getReplies,
  getReply,
  updateReply,
  deleteReply,
};
