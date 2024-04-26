const express = require("express");
const router = express.Router();
const { authJwt } = require("../app/middleware");
const NotificationController = require("../app/controllers/NotificationController");

/* CLIENT */
router.post(
  "/createClient",
  [authJwt.verifyToken],
  NotificationController.createClient
)
/* END */

/* ADMIN */
router.post(
  "/get-notifications-admin",
  [authJwt.isAdminToken],
  NotificationController.getListNotificationAdmin
)
/* END */

module.exports = router;