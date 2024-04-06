// const express = require("express");
// const router = express.Router();

// const { authJwt } = require("../app/middleware");
// const multer = require('multer');
// const tf = require('@tensorflow/tfjs-node');
// const fs = require('fs');
// const { Buffer } = require('buffer');

// // Configure multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// router.post("/processing", upload.single('image'), (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send({ success: false, error: 'No file uploaded' });
//     }

//     // Read the file asynchronously
//     fs.readFile(req.file.path, async (err, imageBuffer) => {
//       if (err) {
//         console.error('Error reading file:', err);
//         return res.status(500).send({ success: false, error: 'Error reading file' });
//       }

//       // const imageBuffer = req.file.buffer; // Image file buffer
//       const decodedImage = tf.node.decodeImage(imageBuffer); // Decode image

//       // Perform image processing using TensorFlow.js
//       // Replace the following line with your actual TensorFlow.js processing logic
//       // Example: Add 100 to each pixel value
//       const processedImage = decodedImage.toFloat().add(1);

//       // Convert the TensorFlow.js tensor to a buffer containing PNG data
//       const pngBuffer = await tf.node.encodePng(processedImage);
//       const base64String = Buffer.from(pngBuffer).toString('base64');
//       // console.log(base64String);

//       // Sai
//       // Convert the PNG buffer to a base64-encoded string
//       // const base64Image = pngBuffer.toString('base64');

//       res.send({ success: true, processedImage: base64String });
//     });
//   } catch (error) {
//     console.error('Error processing image:', error);
//     res.status(500).send({ success: false, error: 'Image processing failed' });
//   }
// })

// module.exports = router