const mongoose = require("mongoose");
const feedBackSchema = new mongoose.Schema({
  feedbackFrom: {
    type: String,
  },

  feedbackTo: {
    type: String,
    required: [true, "Select employee"],
  },

  feedback: {
    type: String,
    required: [true, "Feedback field can't be empty"],
    minLength: [10, "Please write proper feedback"],
  },
  rating: {
    type: String,
    required: [true, "Provide Overall Rating"],
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

module.exports = mongoose.model("Feedback", feedBackSchema);
