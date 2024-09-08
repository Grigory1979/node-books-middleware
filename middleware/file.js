const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public");
  },
  filename(req, file, cb) {
    const date = moment().format("DD-MM-YYYY HH-mm-ss_SSS");
    cb(null, `${date}-${file.originalname}`);
  },
});


const allowedType = ["text/plain", "image/png", "image/jpeg"];

const fileFilter = (req, file, cb) => {
  allowedType.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

module.exports = multer({
  storage,
  fileFilter,
});