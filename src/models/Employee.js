const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
// initializing the multer storage
const AVTAR_PATH = path.join(process.cwd(), "./src/assets/avtars");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ["Please enter your full name", true],
    match: [/^[a-zA-Z]+ [a-zA-Z]+$/, "Enter valid name"],
    lowercase: true,
  },

  phone: {
    type: String,
    required: [true, "Please enter phone number"],
    minLength: [10, "Mobile number must be of 10 digits"],
    match: [/^(0|91)?[6-9][0-9]{9}$/, "Enter a valid phone number"],
  },

  email: {
    type: String,
    required: ["Please enter your email address", true],
    unique: ["Email already taken", true],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: ["Enter your password", true],
    select: false,
    minLength: [6, "Password must be of 6 character"],
    trim: true,
  },

  role: {
    type: String,
    enum: ["Admin", "Employee"],
  },

  issues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],

  feedbacks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
  ],

  avtar: {
    public_id: {
      type: String,
      default: "aoldldyle1sdxmjseyrb",
    },

    url: {
      type: String,
      default:
        "https://res.cloudinary.com/image-box/image/upload/v1675530481/aoldldyle1sdxmjseyrb.jpg",
    },
  },

  isGrant: {
    type: Boolean,
    default: false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  isApproved: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

// METHODS

employeeSchema.pre("save", async function (next) {
  // create the salt
  let salt = await bcrypt.genSalt(10);
  // modify password field only is password field is changed
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// matchPassword
employeeSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate token

employeeSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, AVTAR_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + "-" + Date.now());
  },
});

// statics
employeeSchema.statics.uploadAvtar = multer({ storage: storage }).single(
  "avtar"
);
employeeSchema.statics.avtarPath = AVTAR_PATH;
module.exports = mongoose.model("Employee", employeeSchema);
