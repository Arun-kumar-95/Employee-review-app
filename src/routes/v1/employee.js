// require the path module

const path = require("path");

// require the express module
const express = require("express");
// requite the router function from express module
const router = express.Router();
// destructuring the authenticated function from utils direc
const { isAuthenticated } = require(path.join(
  process.cwd(),
  "./src/middlewares/auth.js"
));

// desctructuring the controller function from main.js
const { logout, uploadFileHandler } = require(path.join(
  process.cwd(),
  "./src/controllers/v1/main.js"
));

// destructuring the employee controller function
const {
  renderDashboard,
  renderFeedback,
  renderRaiseIssue,
  raiseProblem,
  feedbackHandler,
  notification,
  notifyHandler
} = require(path.join(process.cwd(), "./src/controllers/v1/employee.js"));


// defing ihe routes
router.route("/dashboard").get(isAuthenticated, renderDashboard);
router
  .route("/dashboard/feedback")
  .get(isAuthenticated, renderFeedback)
  .post(isAuthenticated, feedbackHandler);
router
  .route("/dashboard/doubt")
  .get(isAuthenticated, renderRaiseIssue)
  .post(isAuthenticated, raiseProblem);

router.route("/dashboard/notifications").get(isAuthenticated , notification).post(isAuthenticated , notifyHandler);
router.route("/dashboard/logout").post(logout);

router.route("/dashboard/upload/:id").post(isAuthenticated, uploadFileHandler);

// exporting the router function
module.exports = router;
