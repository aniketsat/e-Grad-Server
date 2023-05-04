const Question = require("../models/questionModel");

// @Route     POST /api/questions
// @Desc      Create a question
// @Access    Private
const createQuestion = (req, res) => {
  res.send("create a question");
};

// @Route     GET /api/questions
// @Desc      Get all questions
// @Access    Private
const getQuestions = async (req, res) => {
  try {
    // get all questions
    const questions = await Question.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @Route     GET /api/questions/:id
// @Desc      Get a question
// @Access    Private
const getQuestion = (req, res) => {
  res.send("get a question");
};

// @Route     PUT /api/questions/:id
// @Desc      Update a question
// @Access    Private
const updateQuestion = (req, res) => {
  res.send("update a question");
};

// @Route     DELETE /api/questions/:id
// @Desc      Delete a question
// @Access    Private
const deleteQuestion = (req, res) => {
  res.send("delete a question");
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
};
