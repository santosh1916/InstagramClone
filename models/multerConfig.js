// Assuming these modules are stored in a file named multerConfig.js

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads/posts');
  },
  filename: function (req, file, cb) {
    const unique = uuidv4();
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads/profile');
  },
  filename: function (req, file, cb) {
    const unique = uuidv4();
    cb(null, unique + path.extname(file.originalname));
  }
});

const updateProfile = multer({ storage: profileStorage });

module.exports = { upload, updateProfile };
