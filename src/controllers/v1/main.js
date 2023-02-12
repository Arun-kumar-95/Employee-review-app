// require the path variable
const path = require("path");
// require the schemas
const employeeSchema = require(path.join(
  process.cwd(),
  "./src/models/Employee.js"
));

const { errorFormatter } = require(path.join(
  process.cwd(),
  "./src/utils/errorFormatter"
));

const issueSchema = require(path.join(process.cwd(), "./src/models/Issue.js"));
const notifySchema = require(path.join(
  process.cwd(),
  "./src/models/Notification.js"
));

// require the cloudinary configuration
const cloudinary = require(path.join(process.cwd(), "./src/config/cloudinary"));

// render home page controller function

module.exports.renderHomePage = async (req, res) => {
  try {
    // render the home page
    return res.status(200).render("index", { title: "Review System" });
  } catch (err) {
    // catching the error and sending the response
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// login page controller function
module.exports.renderLoginPage = async (req, res) => {
  try {
    // render the login page
    return res.status(200).render("login", { title: "Login" });
  } catch (err) {
    // catching the error and sending the response
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// register page controller function
module.exports.renderRegisterPage = async (req, res) => {
  try {
    // render the register page
    return res.status(200).render("register", { title: "Register" });
  } catch (err) {
    // catching the error and sending the response
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// register controller function
module.exports.register = async (req, res) => {
  try {
    // destructuring the req.body parameters
    const { name, phone, email, password, role } = req.body;

    // check if employee already exists
    let user = await employeeSchema.findOne({ email });
    // if we found the user then throw an error message
    if (user) {
      return res.status(200).json({
        success: false,
        message: "Employee already exists",
      });
    }

    // there  can be only one admin while registering once
    let adminUsers = await employeeSchema
      .find({ role: "Admin", isAdmin: true })
      .sort({ createdAt: 1 });

    // if no admin is there then
    if (adminUsers.length == 0 && role == "Admin") {
      //  create the first admin document

      user = await employeeSchema.create({
        name,
        phone,
        email,
        password,
        role,
        isAdmin: true,
        isApproved: true,
      });

      // save the user
      await user.save();
      // sending the response
      return res
        .status(201)
        .json({ success: true, message: "You are registered now" });
    }

    // if we found a admin and the request role is admin then
    if (adminUsers.length > 0 && role == "Admin") {
      // sending the response
      return res.status(403).json({
        success: false,
        message: "Register as an employee ",
      });
    }

    // if we have an  admin and the role is employee then
    if (adminUsers.length > 0 && role == "Employee") {
      // create a employee document
      user = await employeeSchema.create({
        name,
        phone,
        email,
        password,
        role,
        isAdmin: false,
        isApproved: false,
      });

      //save the user document
      await user.save();

      // raise an request to make grant as an employee

      let doc = await issueSchema.create({
        user_id: user._id,
        user: user.name,
        issueType: "Employee",
        issue: "Accept as an employee ",
      });

      // save the issue document
      await doc.save();

      // if we have more then one admin then add isue to all admin users

      await employeeSchema.find({ role: "Admin" }).updateMany(
        {},
        {
          $push: { issues: doc._id },
        }
      );

      // create the notification
      let notify = await notifySchema.create({
        link_id: doc._id,
        notificationType: "Employee request",
        notificationText: "New Employee Request",
      });

      // save the notification
      await notify.save();

      // sending the response
      return res
        .status(201)
        .json({ success: true, message: "You are registered now" });
    }
  } catch (err) {
    // catching the error and sending the response
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// login employee

module.exports.login = async (req, res) => {
  try {
    // destructure the req,body object
    const { email, password } = req.body;

    // find user by email
    let user = await employeeSchema.findOne({ email }).select("+password");
    //if we donot found an user

    if (!user) {
      // sending the response back
      return res.status(400).json({
        success: false,
        message: "User doesnot exists",
      });
    }

    // if we found the user then check for password by match password function
    const isMatch = await user.matchPassword(password);

    // if we dont found the match then
    if (!isMatch) {
      // sending back the response
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });
    }

    // generate the token only if use is approved
    if (user.isApproved) {
      // generate the token by usinf generateToken function written inside employee schema
      const token = await user.generateToken();
      // making use of cookies

      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // sending the right path based on role
      let rightpath,
        _id = user._id.toString();

      // if the role is admin then redirect to this path
      if (user.role == "Admin") {
        rightpath = `admin/dashboard?uid=${_id}`;
      } else {
        rightpath = `user/dashboard?uid=${_id}`;
      }

      // sending the resonse also storing the token inside cookie
      return res.status(200).cookie("token", token, options).json({
        success: true,
        message: "Login successfully",
        path: rightpath,
      });
    } else {
      //sending the response
      return res.status(403).json({
        success: false,
        message: "Verification still in progress",
      });
    }
  } catch (err) {
    // catching the error and sending the response
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// logged out controller function
module.exports.logout = async function (req, res) {
  try {
    // destructure the res.body object
    const { isLoggedOut } = req.body;
    // if we get isLoggedOut then do this
    if (isLoggedOut) {
      // define the cookie option parameter
      let options = {
        expires: new Date(Date.now()),
        httpOnly: true,
      };
      // clearing the token once logout and sending back the response
      return res.status(200).cookie("token", null, options).json({
        success: true,
        message: "You are logged out",
      });
    }
  } catch (err) {
    // catch the error and send the response
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// file handler controller function
module.exports.uploadFileHandler = async (req, res) => {
  try {
    // find the employee whose profile has to be updated or uploaded
    const user = await employeeSchema.findById({ _id: req.params.id });

    // defint the localfile path
    locaFilePath = req.file.path;

    // calling the cloudinary uploader upload function
    cloudinary.uploader.upload(
      locaFilePath,
      { folder: "avtars" },
      async (err, result) => {
        user.avtar.public_id = result.public_id;
        user.avtar.url = result.url;

        // save the user after uploading the profile pic
        await user.save();
        // sending back the response
        return res.status(200).json({
          success: true,
          message: "Profile Pic Updated",
        });
      }
    );
  } catch (err) {
    // catch the error and sending it as json format
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};
