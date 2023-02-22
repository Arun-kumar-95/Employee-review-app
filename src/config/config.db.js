// require the mongoose
const mongoose = require("mongoose");
// mongoose connect function
module.exports.connect = async (DATABASE_URL) => {
  // IF DATABASE URL NOT PROVIDED
  if (!DATABASE_URL) {
    return console.log("Invalid DATABASE_URL");
  }

  // database connection params
  const OPTIONS = {
    dbName: process.env.DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

// store connect value inside dbconnect
  const dbConnect = await mongoose.connect(DATABASE_URL, OPTIONS);

  if (!dbConnect) {
    return console.log("Error connecting to database");
  } else {
    return console.log("Connected to database");
  }
};
