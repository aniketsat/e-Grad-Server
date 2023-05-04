const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answerOptions: {
      type: Array,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    timeToAnswer: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
