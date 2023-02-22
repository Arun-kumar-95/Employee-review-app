// require the express
const express = require("express");
// assigning the express function to app variable
const app = express();
// require the dotenv file
const dotenv = require("dotenv");
// if not an env = produuction then 
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./src/config/config.env" });
}
// destructure the connect function
const { connect } = require("../config/config.db.js");

// logging the message based on connect function outputs
if (connect(process.env.DATABASE_URL)) {
  // connect the server if we have database connected
  app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
  });
}
// exporting the app function
module.exports = app;
