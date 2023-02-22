// require the path module
const path = require("path");
// require the employee schema
const employeeSchema = require(path.join(
  process.cwd(),
  "./src/models/Employee.js"
));

// require the error formatter helper function

const { errorFormatter } = require(path.join(
  process.cwd(),
  "./src/utils/errorFormatter.js"
));

// require the jwt 
const jwt = require("jsonwebtoken");
// exporting isAuthenticated function
module.exports.isAuthenticated = async (req, res, next) => {
  try {
    // getting the token
    const { token } = req.cookies;

    // if no token found means not login redirect it to login
    if (!token) {
      return res.redirect("/");
    }

    // if we had token THEN VERIFY TOKEN
    const decode = await jwt.verify(token, process.env.JWT_SECRET);

    // fing the doctor via id and store
    req.user = await employeeSchema.findById(decode._id);

    // calling the next
    next();
  } catch (err) {
//     sending the response
    return res
      .status(500)
      .json({ success: false, message: errorFormatter(err.message) });
  }
};
