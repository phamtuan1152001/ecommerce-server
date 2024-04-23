const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");

const TrackingVisistors = require("../app/controllers/TrackingVisistors")

router.post("/visitors", [authJwt.verifyToken], TrackingVisistors.create)

module.exports = router;