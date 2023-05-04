const express = require("express");

const replyController = require("../controllers/replyController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// @Route     POST /api/replies
// @Desc      Create a reply to a post
// @Access    Private
router.post("/", authenticate, replyController.createReply);

// @Route     GET /api/replies
// @Desc      Get all replies of a post
// @Access    Private
router.get("/", authenticate, replyController.getReplies);

// @Route     GET /api/replies/:id
// @Desc      Get a reply
// @Access    Private
router.get("/:id", authenticate, replyController.getReply);

// @Route     PUT /api/replies/:id
// @Desc      Update a reply
// @Access    Private
router.put("/:id", authenticate, replyController.updateReply);

// @Route     DELETE /api/replies/:id
// @Desc      Delete a reply
// @Access    Private
router.delete("/:id", authenticate, replyController.deleteReply);

module.exports = router;
