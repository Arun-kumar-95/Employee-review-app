// require the mongoose
const mongoose = require("mongoose");
// creating the notification schemas
const notifySchema = new mongoose.Schema({
  link_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  notificationType: {
    type: String,
    enum: ["Employee request", "Admin request", "Feedback access", "Problem"],
  },
  notificationText: {
    type: String,
    required: true,
    lowerCase: true,
  },

  nofificationStatus: {
    type: String,
    default: "Incomplete",
  },
  notificationBound: {
    type: String,
    default: "Employee",
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

// exporting the schemas
module.exports = mongoose.model("Notification", notifySchema);
