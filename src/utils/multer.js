const multer = require("multer");
const path = require("path");
// initializing the multer storage
const AVTAR_PATH = path.join(process.cwd(), "./src/assets/avtars");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, AVTAR_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("avtar");

module.exports = upload;
