// require the path module
const path = require("path");

// require the error formatter helper function
const { errorFormatter } = require(path.join(
  process.cwd(),
  "./src/utils/errorFormatter"
));

// require all the schemas
const issueSchema = require(path.join(process.cwd(), "./src/models/Issue.js"));
const notifySchema = require(path.join(
  process.cwd(),
  "./src/models/Notification.js"
));
const feedBackSchema = require(path.join(
  process.cwd(),
  "./src/models/Feedback.js"
));

const employeeSchema = require(path.join(
  process.cwd(),
  "./src/models/Employee.js"
));

// render dashboard function
module.exports.renderDashboard = async (req, res) => {
  try {
    // get the notification
    let notifications = await notifySchema
      .find({
        link_id: req.user._id,
        nofificationStatus: "Incomplete",
        notificationBound: "Admin",
      })
      .count();

    // sending the response

    return res.status(200).render("dashboard", {
      title: `Dashboard : ${req.user.name}`,
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      _id: req.user._id,
      profilePic: req.user.avtar.url,
      notifications,
    });
  } catch (err) {
    // catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// render feedback function
module.exports.renderFeedback = async (req, res) => {
  try {
    // get all the employee
    const employees = await employeeSchema
      .find({ isApproved: true })
      .select("name");

    // get the notification
    let notifications = await notifySchema
      .find({
        link_id: req.user._id,
        nofificationStatus: "Incomplete",
        notificationBound: "Admin",
      })
      .count();

    // sending the response
    return res.status(200).render("feedback", {
      title: "Feedback",
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      _id: req.user._id,
      data: employees,
      isGrant: req.user.isGrant,
      profilePic: req.user.avtar.url,
      notifications,
    });
  } catch (err) {
    // catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// raise issue function
module.exports.renderRaiseIssue = async (req, res) => {
  try {
    // get the notification
    let notifications = await notifySchema
      .find({
        link_id: req.user._id,
        nofificationStatus: "Incomplete",
        notificationBound: "Admin",
      })
      .count();

    // sending the respone
    return res.status(200).render("raiseissue", {
      title: "Raise issue",
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      _id: req.user._id,
      profilePic: req.user.avtar.url,
      notifications,
    });
  } catch (err) {
    // catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// render notification function
module.exports.notification = async (req, res) => {
  try {
    // get the notification
    let data = await notifySchema.find({
      link_id: req.user._id,
      nofificationStatus: "Incomplete",
      notificationBound: "Admin",
    });

    // count the notification
    let notifications = data.length;

    // sending the response
    return res.status(200).render("notification", {
      title: "Notification",
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      _id: req.user._id,
      profilePic: req.user.avtar.url,
      notifications,
      data,
    });
  } catch (err) {
    // catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};
// raise issue function
module.exports.raiseProblem = async (req, res) => {
  try {
    // destructure the req.body object
    const { isProblemRequest, isAdminRequest } = req.body;
    // perform the operation if we found isProblemRequest
    if (isProblemRequest) {
      // destructure the req.body object
      const { issue, _id } = req.body;

      // find the right employee
      let user = await employeeSchema.findById({ _id });
      // throw the error if no user found
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Invalid Parameter",
        });
      }

      // id we have the right user then  create a issue raised by user

      let doc = await issueSchema.create({
        user_id: user._id,
        user: user.name,
        issueType: "Problem",
        issue,
      });

      // save the isse doc
      await doc.save();

      // push the issue id to the user issues field
      user.issues.push(doc._id);
      // save the user
      await user.save();

      // create the notification
      let notify = await notifySchema.create({
        link_id: doc._id,
        notificationType: "Problem",
        notificationText: "New issue raised",
      });

      // save the notification
      await notify.save();

      // sending the response
      return res.status(201).json({
        success: true,
        message: "Issue Accepted",
        path: "user/dashboard/doubt",
      });
    }

    // perform the operation we have isAdmin request as true
    if (isAdminRequest) {
      // destructure the req.body
      const { _id } = req.body;

      // find the right employee based on id
      let user = await employeeSchema.findById({ _id });

      // if we dont have an user then throw an error
      if (!user) {
        // sending the response
        return res.status(404).json({
          success: false,
          message: "Invalid Parameter",
        });
      }
      // id we have the right user then  create a issue raised by user

      let doc = await issueSchema.create({
        user_id: user._id,
        user: user.name,
        issueType: "Admin",
        issue: "Accept me as an admin.",
      });

      // save the issue doc
      await doc.save();

      // pushing the issue  to user issue field
      user.issues.push(doc._id);
      // save the user
      await user.save();

      // create the notification
      let notify = await notifySchema.create({
        link_id: doc._id,
        notificationType: "Admin request",
        notificationText: "New admin request",
      });

      // save the notification
      await notify.save();

      // sending the response
      return res.status(201).json({
        success: true,
        message: "Admin Request Registered",
        path: "user/dashboard",
      });
    }
  } catch (err) {
    // catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// feedbackHandler function

module.exports.feedbackHandler = async (req, res) => {
  try {
    // destructure the req.body
    const { feedbackTo, feedbackFrom, feedback, rating } = req.body;

    // perform operation based on feedback to
    if (feedbackTo == "*No user selected") {
      return res.status(400).json({
        success: false,
        message: "Select employee name",
      });
    }
    // check if the user is a valid or not

    let user = await employeeSchema.findById({ _id: feedbackFrom });
    // if we dont found the user then
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Parameters",
      });
    }

    // only one feedback is allowed for one employee

    const docs = await feedBackSchema.find({
      feedbackFrom: user.name,
      feedbackTo,
    });

    // if we have no feedback found then create one
    if (docs.length > 0) {
      // sending the response
      return res.status(200).json({
        success: false,
        message: "Only One feedback Allowed",
      });
    } else {
      // if the user is a valid user then create a feedback

      const feedbackDoc = await feedBackSchema.create({
        feedbackFrom: user.name,
        feedbackTo,
        feedback,
        rating,
      });

      // save the feedback doc
      await feedbackDoc.save();

      // insert the deedback doc id to user feedback column
      user.feedbacks.push(feedbackDoc.id);

      // save the user
      await user.save();
      // sendig the response
      return res.status(201).json({
        success: true,
        message: "Feedback Send",
        path: "user/dashboard/feedback",
      });
    }
  } catch (err) {
    // catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

module.exports.notifyHandler = async (req, res) => {
  try {
    // destructure the re.boy object
    const { isRead } = req.body;
    if (isRead) {
      // destructure the re.boy object
      const { _id } = req.body;

      // check if the notification is valid or not
      let notify = await notifySchema.findById({ _id });
      // if not notification found then
      if (!notify) {
        // sending the response
        return res.status(404).json({
          success: false,
          message: "Invalid Notification",
        });
      }
      // fint the notification and update
      await notifySchema
        .findById({ _id })
        .updateOne({}, { nofificationStatus: "Complete" });
      // sending the response after updatin
      return res.status(200).json({
        success: true,
        message: "Notification successfully updated",
        path: "user/dashboard/notifications",
      });
    }
  } catch (err) {
    // catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};
