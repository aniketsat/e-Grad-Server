const express = require("express");
const multer = require("multer");

const postController = require("../controllers/postController");

const authenticate = require("../middleware/authMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// @Route     POST /api/posts
// @Desc      Create a post
// @Access    Private
router.post("/", authenticate, postController.createPost);

// @Route     GET /api/posts
// @Desc      Get all posts
// @Access    Private
router.get("/", authenticate, postController.getPosts);

// @Route     GET /api/posts/:id
// @Desc      Get a post
// @Access    Private
router.get("/:id", authenticate, postController.getPost);

// @Route     PUT /api/posts/:id
// @Desc      Update a post
// @Access    Private
router.put("/:id", authenticate, postController.updatePost);

// @Route     DELETE /api/posts/:id
// @Desc      Delete a post
// @Access    Private
router.delete("/:id", authenticate, postController.deletePost);

module.exports = router;
