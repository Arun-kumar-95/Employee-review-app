const mongoose = require("mongoose");
const issueSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  user: {
    type: String,
  },

  issueType: {
    type: String,
    enum: ["Admin", "Problem", "Employee"],
  },
  
  issue: {
    type: String,
    required: [true, "Please write issue"],
    lowercase: true,
  },

  issueStatus: {
    type: String,
    default: "Pending",
    enum: ["Resolved", "Approved", "Rejected", "Pending"],
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

module.exports = mongoose.model("Issue", issueSchema);
