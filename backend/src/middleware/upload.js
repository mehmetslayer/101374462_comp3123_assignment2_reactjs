const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  // random name with an extension chosen by us, never the client's file name
  filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${ALLOWED[file.mimetype]}`),
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED[file.mimetype]) return cb(null, true);
  const err = new Error('Only JPEG, PNG or WebP images are allowed');
  err.code = 'INVALID_FILE_TYPE';
  cb(err);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE, files: 1 } });

// delete a stored picture; basename() keeps the path inside the uploads folder
const removePicture = (picturePath) => {
  if (!picturePath) return;
  fs.unlink(path.join(UPLOAD_DIR, path.basename(picturePath)), () => {});
};

module.exports = { upload, removePicture, UPLOAD_DIR };