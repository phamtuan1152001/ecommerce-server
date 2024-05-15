const express = require("express");
const router = express.Router();
const { authJwt } = require("../app/middleware");
const NotificationController = require("../app/controllers/NotificationController");

// COMMON
router.put(
  "/read-all-notification",
  [authJwt.verifyToken],
  NotificationController.readAll
)

/* CLIENT */
router.post(
  "/push-noti-client-confirm-admin-offer-customized-product",
  [authJwt.verifyToken],
  NotificationController.pushNotiClientConfirmAdminOfferCustomizedProduct
)
router.post(
  "/push-noti-customized-product",
  [authJwt.verifyToken],
  NotificationController.pushNotiToAdminCustomizedProduct
)
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
  "/push-noti-confirm-customized-product",
  [authJwt.isAdminToken],
  NotificationController.pushNotiToClientCustomizedProductForConfirm
)
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