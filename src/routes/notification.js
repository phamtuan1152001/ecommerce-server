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
router.put(
  "/update-notification-status",
  [authJwt.isAdminToken],
  NotificationController.updateStatusSeenNoti
)
/* END */

module.exports = router;