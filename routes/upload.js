const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

console.log("Upload routes loaded");
router.post("/", auth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

  res.status(200).json({
    fileUrl: req.file.path,
    public_id: req.file.filename,
  });
});

module.exports = router;
