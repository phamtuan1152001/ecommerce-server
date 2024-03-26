const express = require("express");
const router = express.Router();
const { authJwt } = require("../app/middleware");
const OrderController = require("../app/controllers/OrderController");

// Create order client [CLIENT]
router.post(
  "/create-order",
  [authJwt.verifyToken],
  OrderController.createOrder
);

// Get list order [CLIENT]
router.post(
  "/get-list-order-client",
  [authJwt.verifyToken],
  OrderController.getListOrderClient
);

// Get detail order [CLIENT]
router.get(
  "/get-detail-order-client/:id",
  [authJwt.verifyToken],
  OrderController.getDetailOrder
);

// Update detail order [CLIENT]
router.put(
  "/update-detail-order-client/:id",
  [authJwt.verifyToken],
  OrderController.updateOrderClient
);

// Delete detail order [CLIENT]
// router.delete(
//   "/delete-detail-order/:id",
//   [authJwt.verifyToken],
//   OrderController.deleteDetailOrder
// );

// Get list order [ADMIN]
router.post(
  "/get-list-order-admin",
  [authJwt.isAdmin],
  OrderController.getListOrder
);

// Get detail order [ADMIN]
router.post(
  "/get-detail-order-admin/:id",
  [authJwt.isAdmin],
  OrderController.getDetailOrder
);

// Delete detail order [ADMIN]
router.delete(
  "/delete-detail-order-admin/:id",
  [authJwt.verifyToken],
  OrderController.deleteDetailOrder
);

// Update detail order [ADMIN]
router.put(
  "/update-detail-order-admin/:id",
  [authJwt.isAdmin],
  OrderController.updateOrderAdmin
);

module.exports = router;
