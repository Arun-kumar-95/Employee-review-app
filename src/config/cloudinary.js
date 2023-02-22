// require the cloudinary 
const cloudinary = require("cloudinary").v2;
// setting the cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// exporting the cloudinary
module.exports = cloudinary;
