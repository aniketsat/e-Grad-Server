const express = require("express");

const questionController = require("../controllers/questionController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// @Route     POST /api/questions
// @Desc      Create a question
// @Access    Private
router.post("/", authenticate, questionController.createQuestion);

// @Route     GET /api/questions
// @Desc      Get all questions
// @Access    Private
router.get("/", authenticate, questionController.getQuestions);

// @Route     GET /api/questions/:id
// @Desc      Get a question
// @Access    Private
router.get("/:id", authenticate, questionController.getQuestion);

// @Route     PUT /api/questions/:id
// @Desc      Update a question
// @Access    Private
router.put("/:id", authenticate, questionController.updateQuestion);

// @Route     DELETE /api/questions/:id
// @Desc      Delete a question
// @Access    Private
router.delete("/:id", authenticate, questionController.deleteQuestion);

module.exports = router;
