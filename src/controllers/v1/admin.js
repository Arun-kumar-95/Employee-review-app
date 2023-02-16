// require the path module
const path = require("path");
// require the send sms function from utils directory
const { sendSms } = require(path.join(process.cwd(), "./src/utils/sendSms"));

// require the error formatter function
const { errorFormatter } = require(path.join(
  process.cwd(),
  "./src/utils/errorFormatter"
));

// require the schemas
const employeeSchema = require(path.join(
  process.cwd(),
  "./src/models/Employee.js"
));

const issueSchema = require(path.join(process.cwd(), "./src/models/Issue.js"));
const notifySchema = require(path.join(
  process.cwd(),
  "./src/models/Notification.js"
));

const feedBackSchema = require(path.join(
  process.cwd(),
  "./src/models/Feedback.js"
));

// dender dashboard function
module.exports.renderDashboard = async (req, res) => {
  try {
    // getting the notification
    let notifications = await notifySchema
      .find({
        nofificationStatus: "Incomplete",
        notificationBound: "Employee",
      })
      .count();
    // sending the response to the client
    return res.status(200).render("dashboard", {
      title: `Dashboard : ${req.user.name}`,
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      totalEmployee: await employeeSchema.find({ isApproved: true }).count(),
      totalReviews: await feedBackSchema.find({}).count(),
      totalRequest: await issueSchema.find({ issueStatus: "Pending" }).count(),
      _id: req.user._id,
      profilePic: req.user.avtar.url,
      notifications,
    });
  } catch (err) {
    // catch the error and sending back to the client
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// RENDER EMPLOYEE
module.exports.renderEmployee = async (req, res) => {
  try {
    // grab the employees
      const employees = await employeeSchema
      .find({ isApproved: true })
      .select("name email phone createdAt role")
      .sort({ createdAt: -1 });

    // get the notification
    let notifications = await notifySchema
      .find({
        nofificationStatus: "Incomplete",
        notificationBound: "Employee",
      })
      .count();

    // sending back the response
    return res.status(200).render("employees", {
      title: "Employee lists",
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      data: employees,
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

// RENDER REVIEWS
module.exports.renderReviews = async (req, res) => {
  try {
    // grab the notification
    let notifications = await notifySchema
      .find({
        nofificationStatus: "Incomplete",
        notificationBound: "Employee",
      })
      .count();

    // sending the response
    return res.status(200).render("reviews", {
      title: "Reviews",
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      data: await feedBackSchema.find(),
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

// RENDER REQUESTS

module.exports.renderRequests = async (req, res) => {
  try {
    // get the notification
    let notifications = await notifySchema
      .find({
        nofificationStatus: "Incomplete",
        notificationBound: "Employee",
      })
      .count();

    // sending back the response
    return res.status(200).render("requests", {
      title: "Notifications",
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      data: await issueSchema.find({}).sort({ createdAt: -1 }),
      _id: req.user._id,
      profilePic: req.user.avtar.url,
      notifications,
    });
  } catch (err) {
    // catch the error here
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// RENDER MANAGE
module.exports.renderManage = async (req, res) => {
  try {
    // get the employees

    const employees = await employeeSchema
      .find({ isApproved: true })
      .select("name email phone createdAt role")
      .sort({ createdAt: -1 });

    // get the notification

    let notifications = await notifySchema
      .find({
        nofificationStatus: "Incomplete",
        notificationBound: "Employee",
      })
      .count();

    // sendint the response
    return res.status(200).render("manage", {
      title: "Manage",
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      data: employees,
      eid: req.user._id,
      _id: req.user._id,
      profilePic: req.user.avtar.url,
      notifications,
    });
  } catch (err) {
    // Catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// RENDER MANAGE
module.exports.renderPerformance = async (req, res) => {
  try {
    // get the notifications
    let notifications = await notifySchema
      .find({
        nofificationStatus: "Incomplete",
        notificationBound: "Employee",
      })
      .count();

    // get the uses
    const users = await employeeSchema
      .find({ isApproved: true })
      .select("name");

    // defint the user array to get all the approved users
    let userArray = [];
    // applying for each to users array
    users.forEach((user) => {
      if (!userArray.includes(user)) {
        // pushing the user name to users array
        userArray.push(user.name);
      }
    });

    // defint the empty feedback data array

    const feedbackdata = [];

    // getting all the feedback based on users array
    for (var i = 0; i < userArray.length; i++) {
      let feedbacks = await feedBackSchema.find({
        feedbackTo: { $in: userArray[i] },
      });

      // getting all ratings
      let ratings = await feedBackSchema.find({
        feedbackTo: { $in: userArray[i] },
        rating: { $lt: "4" },
      });

      // define the status
      let status;

      // based on feedback length and rating we give status
      if (feedbacks.length > 0) {
        // less than 40%
        if (ratings.length < (feedbacks.length * 2) / 5) {
          status = "Low";
          // less than 80%
        } else if (ratings.length < (feedbacks.length * 4) / 5) {
          status = "Normal";
        } else {
          status = "Good";
        }
        // if no feedback found then
      } else {
        status = "No feedback";
      }

      // defintthe deata based on the queries and send back the response
      const data = {
        name: userArray[i],
        totalFeedbacks: feedbacks.length,
        below4Star: ratings.length,
        above4Star: feedbacks.length - ratings.length,
        status,
      };

      // push the data to the feedback empty array as an array of objects
      feedbackdata.push(data);
    }

    // sending back the response
    return res.status(200).render("performance", {
      title: "Performance",
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      _id: req.user._id,
      profilePic: req.user.avtar.url,
      notifications,
      data: feedbackdata,
    });
  } catch (err) {
    // catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// define the render update function
module.exports.renderUpdate = async (req, res) => {
  try {
    // get all the notification
    let notifications = await notifySchema
      .find({
        nofificationStatus: "Incomplete",
        notificationBound: "Employee",
      })
      .count();

    // sending the response
    return res.status(200).render("update", {
      title: "Update Employee",
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      data: await employeeSchema.findById({ _id: req.params.id }),
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

// define the render profile function
module.exports.renderProfile = async (req, res) => {
  try {
    // get the employees
    const employee = await employeeSchema
      .findById({ _id: req.params.id })
      .populate([
        { path: "issues", ref: "Issue" },
        { path: "feedbacks", ref: "Feedback" },
      ]);

    // get the notification
    let notifications = await notifySchema
      .find({
        nofificationStatus: "Incomplete",
        notificationBound: "Employee",
      })
      .count();

    // sending back the response
    return res.status(200).render("profile", {
      title: `Profile: ${employee.name}`,
      username: req.user.name,
      authorizedRole: req.user.role,
      email: req.user.email,
      data: employee,
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

// manage handler function
module.exports.manageHandler = async (req, res) => {
  try {
    // destructure the res.body object
    const { isSearch, isDelete } = req.body;

    // search query operation
    if (isSearch) {
      // destructure the res.body if we get isSearch as an key true
      const { searchTxt } = req.body;
      // find the student using name
      const employees = await employeeSchema.find({
        name: { $regex: searchTxt, $options: "i" },
      });

      // if no studnt found then send the response
      if (!employees) {
        return res.status(400).json({
          success: false,
          message: "No Student Found",
        });
      }

      // defin ethe succes andinitialize it to false
      let success = false;
      // change the value of success to true or false depending on the  employee length
      employees.length == 0 ? success : (success = true);

      // sending back the response
      return res.status(200).json({
        success,
        TotalCount: employees.length,
        message: `${employees.length} Student Found`,
        data: employees,
      });
    }

    // perform the operation if we get delete key as the value true  from the req.body object
    if (isDelete) {
      // destructure the req.body
      const { _id, eid } = req.body;

      // only the admin is allowed to delete employee
      const isAdmin = await employeeSchema.findById({ _id: eid });

      // check if the role is an admin or not
      if (isAdmin.role == "Admin") {
        // check if the user is valid of not
        const user = await employeeSchema.findById({ _id });

        // check if the employee is valid or not

        if (!user) {
          // sendin back the response since no user is fouund
          return res.status(403).json({
            success: false,
            message: "Invalid Parameters",
          });
        }

        // get all the matching feedback and issues if any inside an array
        let issuesArr = [],
          feedbacksArr = [];

        // get all the issues by using for each method of an array
        user.issues.forEach((issue) => {
          // push the issue id to issue array
          issuesArr.push(issue._id);
        });

        // get all the feedbacks
        user.feedbacks.forEach((feedback) => {
          // pushing feedback id to feedback array
          feedbacksArr.push(feedback._id);
        });

        // performingt the queries
        await issueSchema.deleteMany({ _id: { $in: issuesArr } });
        await feedBackSchema.deleteMany({ _id: { $in: feedbacksArr } });

        // if the employee is valid then delete the meployee
        await employeeSchema.findByIdAndDelete({ _id });

        // also delete the feedbacks is any has given feedback to

        let array = [],
          match = [];
        // get all the employee based on user name
        let employeesGivenFeedback = await feedBackSchema.find({
          feedbackTo: user.name,
        });

        // applying for each  to employee given feedback and insert if it doesnot have
        employeesGivenFeedback.forEach((feed) => {
          if (!array.includes(feed.feedbackFrom)) {
            array.push(feed.feedbackFrom);
          }
        });

        //getting all the employee id
        employeesGivenFeedback.forEach((employee) => {
          match.push(employee._id);
        });

        // find the employee present inside an array and pull the matching id
        const employees = await employeeSchema
          .find({ name: { $in: array } })
          .updateMany(
            {},
            { $pull: { feedbacks: { $in: match } } },
            { multi: true }
          );

        // also delete the feedback who had given
        await feedBackSchema.deleteMany({
          feedbackTo: user.name,
        });

        // delete all the matching notifications
        await notifySchema.deleteMany({ link_id: _id });
        // sending the response
        return res.status(200).json({
          success: true,
          message: "One Employee Deleted",
          path: "admin/dashboard/manage",
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "You are UnAuthorized",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// delete request function

module.exports.requestHandler = async (req, res) => {
  try {
    // destructure the req,boddy object
    const { isDeleteRequest, isApproved } = req.body;

    // handle approved request if we get the isApproved key from req.body
    if (isApproved) {
      // destructure the req,body
      const { selectValue, _id, uid } = req.body;

      // define and initialize status
      let status;

      // based on select value change the value of status
      if (selectValue == "true") {
        status = "Approved";
      } else {
        status = "Pending";
      }
      // select the issue and update the status
      const doc = await issueSchema.findById({ _id });

      // if we found the document then update it
      if (doc) {
        // update the issue status to approved
        await issueSchema
          .findById(doc._id)
          .updateOne({}, { issueStatus: status });
      }

      // select the employee base on name and id update the status of approved
      const user = await employeeSchema.findOne({
        name: doc.user,
        _id: doc.user_id,
      });

      // if we found the user then update the user
      if (user) {
        await employeeSchema
          .find({
            name: doc.user,
            _id: doc.user_id,
          })
          .updateOne({}, { isApproved: selectValue });
      }

      // send an sms

      if (selectValue == "true") {
        // find the notification and update the status
        await notifySchema
          .findOne({ link_id: _id })
          .updateOne({}, { nofificationStatus: "Complete" });

        // send the sma
        const body = `Congratulation ${user.name}!. You are now a part of company. Please login with credentials`;
        sendSms(body, user.phone);
      }

      if (selectValue == "false") {
        // find the notification and update the status
        await notifySchema
          .findOne({ link_id: _id })
          .updateOne({}, { nofificationStatus: "Incomplete" });
      }
      // send the response
      return res.status(200).json({
        success: true,
        message: "Document Updated",
        path: "admin/dashboard/notifications",
      });
    }

    // handle delete request if we found isDeleteRequest as key coming from the req.body
    if (isDeleteRequest) {
      // destructure the req.body
      const { _id } = req.body;
      //  check if the request to be deleted is a valid request or not
      const issue = await issueSchema.findById({ _id });
      // if we dont found the issue based on id then  ghrow an error
      if (!issue) {
        // sending the response
        return res.status(404).send({
          success: false,
          message: "Invalid request",
        });
      }

      // if we founf the request then delete only that request whose status is resolved or approved

      if (
        issue.issueStatus === "Resolved" ||
        issue.issueStatus === "Approved"
      ) {
        // delete the issue  if we found
        await issueSchema.findByIdAndDelete({ _id });

        // sending the response
        return res.status(200).json({
          success: true,
          message: "One Request Deleted",
          path: "admin/dashboard/requests",
        });
      } else {
        // send the response
        return res.status(400).json({
          success: false,
          message: "Please resolve the issue",
        });
      }
    }
  } catch (err) {
    // catch the error
    return res.status(500).json({
      success: false,
      message: errorFormatter(err.message),
    });
  }
};

// update employee function
module.exports.updateEmployee = async (req, res) => {
  try {
    // get the id from the params
    const _id = req.params.id;

    // check if the employee exists or not
    const user = await employeeSchema.findById({ _id });

    // if we dont found the user then thow an error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Request",
      });
    }

    // destructure the req.body
    const { name, email, phone, role } = req.body;
    // if user exists then update the employee

    await employeeSchema.findByIdAndUpdate(
      { _id },
      {
        $set: { name, email, phone, role },
      },
      {
        new: true,
        runvalidator: true,
        upsert: true,
      }
    );

    // sending the response
    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      path: "admin/dashboard/employees",
    });
  } catch (err) {
    // catch the error and throw an error
    return res
      .status(500)
      .json({ success: false, message: errorFormatter(err.message) });
  }
};

// update issue function
module.exports.profileHandler = async (req, res) => {
  try {
    //  destructure the req.body object
    const { isUpdate, isGrant } = req.body;

    // update the issue operation if we get the isUpdate key true
    if (isUpdate) {
      // destructure the req.body
      const { selectValue, _id, uid, dataType } = req.body;

      // check if the issue created is a valid one
      // get the issue based on id
      const issue = await issueSchema.findById({ _id });
      if (!issue) {
        //  if we dont found the issue the throw an error
        return res.status(404).json({
          success: false,
          message: "Invalid Parameter",
        });
      }

      // perform the operation based on datatype and select value
      if (dataType == "Problem" && selectValue != "Pending") {
        // if it is a valid one then update the issueStatus
        await issueSchema.findByIdAndUpdate(_id, { issueStatus: selectValue });

        // find the notification and update the status

        await notifySchema
          .findOne({ link_id: _id })
          .updateOne({}, { nofificationStatus: "Complete" });
      } else if (dataType == "Problem" && selectValue == "Pending") {
        // if it is a valid one then update the issueStatus

        await issueSchema.findByIdAndUpdate(_id, { issueStatus: selectValue });

        // find the notification and update the status
        await notifySchema
          .findOne({ link_id: _id })
          .updateOne({}, { nofificationStatus: "Incomplete" });
      } else if (dataType == "Admin" && selectValue != "Pending") {
        // find the user based on id
        let user = await employeeSchema.findOne({ _id: uid });

        // if we found the user then
        if (user) {
          // congratulate by sending sms
          let body = "Congratulation user.name !. You are promoted to admin";

          // send the sms to the user based on phone number
          sendSms(body, user.phone);

          // updating the notification status
          await notifySchema
            .findOne({ link_id: _id })
            .updateOne({}, { nofificationStatus: "Complete" });

          // update the employee to admin post
          await employeeSchema
            .find({ _id: uid })
            .updateOne({}, { isAdmin: true, role: "Admin", isGrant: false });

          // update the issue
          await issueSchema.findByIdAndUpdate(_id, {
            issueStatus: selectValue,
          });

          // logging out the admin user
          let options = {
            expires: new Date(Date.now()),
            httpOnly: true,
          };

          // clearing the token present inside the cookie
          return res.status(200).cookie("token", null, options).json({
            success: true,
            message: "Admin Request Approved and logging out..",
            path: " ",
          });
        }
      }

      // sending the response
      return res.status(200).json({
        success: true,
        message: "Status Updated Successfully",
        path: `admin/dashboard/profile/${uid}`,
      });
    }

    // perform the isGrant operation if we found it ad true
    // grant access to give feedback
    if (isGrant) {
      // destructure the req.body object
      const { uid } = req.body;
      // updat the employee
      await employeeSchema
        .findById({ _id: uid })
        .updateOne({}, { isGrant: isGrant });

      // create the notification
      let notify = await notifySchema.create({
        link_id: uid,
        notificationType: "Feedback access",
        notificationText: "Feedback notification",
        notificationBound: "Admin",
      });

      // save the notification
      await notify.save();

      // sending the response
      return res.status(200).json({
        success: true,
        message: "Feedback Allowed Successfully",
        path: `admin/dashboard/profile/${uid}`,
      });
    } else {
      // dstructure the uid from the req.body
      const { uid } = req.body;
      // delete the notification based on uid
      let notify = await notifySchema.findOneAndDelete({ link_id: uid });

      // find the user and ypdate the status of the user
      let user = await employeeSchema
        .findById({ _id: uid })
        .updateOne({}, { isGrant: isGrant });

      // sending back the response
      return res.status(200).json({
        success: true,
        message: "Access Denied",
        path: `admin/dashboard/profile/${uid}`,
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
