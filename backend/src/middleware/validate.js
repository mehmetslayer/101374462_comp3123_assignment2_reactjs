const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const { removePicture } = require('./upload');

module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  // the upload already ran, so drop the file of a rejected request
  if (req.file) removePicture(req.file.filename);

  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  logger.warn(`Validation failed: ${req.method} ${req.originalUrl} (${errors.map((e) => e.field).join(', ')})`);
  res.status(400).json({ message: 'Validation failed', errors });
};