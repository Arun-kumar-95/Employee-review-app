// require the path module
const path = require("path");

// require the express module
const express = require("express");
// requite the router function from express module
const router = express.Router();

// destructuring the controller function from main.js 
const {
  renderHomePage,
  renderRegisterPage,
  renderLoginPage,
  register,
  login,
} = require(path.join(process.cwd(), "./src/controllers/v1/main.js"));

// defining the routes
router.route("/").get(renderHomePage);
router.route("/register").get(renderRegisterPage).post(register);
router.route("/login").get(renderLoginPage).post(login);

// exporting the router
module.exports = router;
