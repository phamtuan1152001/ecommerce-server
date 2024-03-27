const express = require("express");
const { upload } = require("../app/controllers/UploadController");
const router = express.Router();

const UploadController = require("../app/controllers/UploadController");

router.post("/upload-cloudinary", UploadController.upload);

router.post("/upload-cloudinary-multiple", UploadController.uploadMultiple);

module.exports = router;
