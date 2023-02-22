// require the express package
const express = require("express");
// require the path module
const path = require("path");
// require the server
const app = require(path.join(process.cwd(), "/src/server/main.js"));
// require the cookie parser
const cookieParser = require("cookie-parser");
// require the body parser
const bodyParser = require("body-parser");
// require the upload function
const upload = require(path.join(process.cwd(), "./src/utils/multer.js"));

// require the routes
const mainRoute = require(path.join(process.cwd(), "./src/routes/v1/main.js"));
// require teh admin routes
const adminRoute = require(path.join(
  process.cwd(),
  "./src/routes/v1/admin.js"
));
// require the employee route
const employeeRoute = require(path.join(
  process.cwd(),
  "./src/routes/v1/employee.js"
));

// Not found middleware
const { notFound } = require(path.join(
  process.cwd(),
  "./src/utils/notFound.js"
));

// adding middlewares
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// //for parsing the form and use via req.body
app.use(express.json({ limit: "25mb", extended: true }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// upload middleware
app.use(upload);
// cookie parser
app.use(cookieParser());

// setting the view engine
app.set("view engine", "ejs");

//setting the views folder
app.set("views", path.join(__dirname, "./src/views"));
// enable case sensitive routes
app.set("case sensitive routing", true);

//static files

app.use(express.static(path.join(process.cwd(), "./src/assets")));
app.use("/admin", express.static(path.join(process.cwd(), "./src/assets")));
app.use("/user", express.static(path.join(process.cwd(), "./src/assets")));

// using the routes

app.use("/", mainRoute);
app.use("/admin", adminRoute);
app.use("/user", employeeRoute);

 
// not found middleware
app.use(notFound);
