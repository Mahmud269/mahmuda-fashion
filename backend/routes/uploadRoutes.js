const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, upload.array('images', 5), (req, res) => {
  const urls = req.files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
});

module.exports = router;
