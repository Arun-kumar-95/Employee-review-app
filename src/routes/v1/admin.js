// require the path module
const path = require("path");

// require the express module
const express = require("express");
// require the router function from express module
const router = express.Router();

// desctructure the authenticated function
const { isAuthenticated } = require(path.join(
  process.cwd(),
  "./src/middlewares/auth.js"
));

// desctrcture the controller function from main file
const { logout , uploadFileHandler} = require(path.join(
  process.cwd(),
  "./src/controllers/v1/main.js"
));

// destructuring the admin controller function
const {
  renderDashboard,
  renderEmployee,
  renderReviews,
  renderRequests,
  renderManage,
  renderPerformance,
  renderUpdate,
  renderProfile,
  manageHandler,
  requestHandler,
  updateEmployee,
  profileHandler,
} = require(path.join(process.cwd(), "./src/controllers/v1/admin.js"));


// defining the routes

router.route("/dashboard").get(isAuthenticated, renderDashboard);
router.route("/dashboard/employees").get(isAuthenticated, renderEmployee);
router.route("/dashboard/reviews").get(isAuthenticated, renderReviews);
router
  .route("/dashboard/notifications")
  .get(isAuthenticated, renderRequests)
  .post(isAuthenticated, requestHandler);
router
  .route("/dashboard/manage")
  .get(isAuthenticated, renderManage)
  .post(isAuthenticated, manageHandler);
router.route("/dashboard/performance").get(isAuthenticated, renderPerformance);
router
  .route("/dashboard/update/:id")
  .get(isAuthenticated, renderUpdate)
  .post(isAuthenticated, updateEmployee);
router
  .route("/dashboard/profile/:id")
  .get(isAuthenticated, renderProfile)
  .post(isAuthenticated, profileHandler);

router.route("/dashboard/logout").post(logout);

router.route("/dashboard/upload/:id").post(isAuthenticated , uploadFileHandler);

// exporting the router
module.exports = router;
