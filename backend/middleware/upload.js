const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

// Define storage options for images and videos
const imageStorage = multer.diskStorage({
 destination: (req, file, cb) => {
  const directory = file.fieldname === "video" ? process.env.VIDEO_PATH : process.env.IMAGE_PATH;
  // const directory = process.env.MEDIA_PATH;
  fs.mkdirSync(directory, { recursive: true });
  cb(null, directory);
 },
 filename: (req, file, cb) => {
  const uniqueSuffix = (file.fieldname === "video" ? "VID_" : "IMG_") + Date.now();
  cb(null, uniqueSuffix + "_" + file.originalname);
 },
});

const videoStorage = multer.diskStorage({
 destination: (req, file, cb) => {
  const directory = "uploads/video";
  fs.mkdirSync(directory, { recursive: true });
  cb(null, directory);
 },
 filename: (req, file, cb) => {
  const uniqueSuffix = Date.now();
  cb(null, uniqueSuffix + "-" + file.originalname);
 },
});

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { uploadImage, uploadVideo };
