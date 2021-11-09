const multer = require('multer');
const path = require('path');

const UPLOAD_PATH = path.join(__dirname, '..', 'uploads');

const fileStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOAD_PATH);
  },

  filename: (req, _file, callback) => {
    const { id } = req.params;

    callback(null, `${id}.jpeg`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (file.mimetype !== 'image/jpeg') {
    return callback(null, false);
  }

  callback(null, true);
};

const upload = multer({ storage: fileStorage, fileFilter }).single('image');

module.exports = { upload };
