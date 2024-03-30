const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");
const ConvertControlelr = require("../app/controllers/ConvertController");

// [POST] convert
router.post("/png-to-svg", [authJwt.verifyToken], ConvertControlelr.convert)

module.exports = router;
