const express = require("express");
const router = express.Router();

// const multer = require('multer');
const { authJwt } = require("../app/middleware");
const DallEController = require("../app/controllers/DallEController")

// Configure multer for file uploads
// const upload = multer({ dest: 'uploads/' });

router.post("/generate-image-by-text", [authJwt.verifyToken], DallEController.generate)

// router.post(
//   "/generate-image-by-upload",
//   upload.single('image'),
//   DallEController.generateImageUploaded
// )

module.exports = router;