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
router.post(
  "/get-notifications-client",
  [authJwt.verifyToken],
  NotificationController.getListNotificationClient
)
router.put(
  "/update-notification-status-client",
  [authJwt.verifyToken],
  NotificationController.updateStatusSeenNotiClient
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
router.post(
  "/send-noti-client",
  [authJwt.isAdminToken],
  NotificationController.createAdmin
)
/* END */

module.exports = router;