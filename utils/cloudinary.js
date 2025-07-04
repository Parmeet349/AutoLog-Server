// To upload files to Cloudinary
// This allows us to handle file uploads in our Express routes easily.
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

console.log("Cloudinary configuration loaded");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a Cloudinary storage instance for file uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "autolog_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

module.exports = { cloudinary, storage };