const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");
const DallEController = require("../app/controllers/DallEController")

router.post("/generate-image-by-text", [authJwt.verifyToken], DallEController.generate)

module.exports = router;