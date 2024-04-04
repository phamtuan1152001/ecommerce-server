const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");

const OrderCustomizedProductController = require("../app/controllers/OrderCustomizedProductController")

// COMMON
router.post(
  "/delete-many-order-customized-products",
  OrderCustomizedProductController.deleteMany
)

/* ----------- CLIENT ----------- */
// CREATE CLIENT [POST]
router.post(
  "/create",
  [authJwt.verifyToken],
  OrderCustomizedProductController.create
)

// GET LIST ORDER CUSTOMIZED PRODUCT [POST]
router.post(
  "/getListClient",
  [authJwt.verifyToken],
  OrderCustomizedProductController.getListOrderCustomizedProductClient
)

// GET DETAIL ORDER CUSTOMIZED PRODUCT [GET]
router.get(
  "/get-detail-order-client/:id",
  [authJwt.verifyToken],
  OrderCustomizedProductController.getDetailOrderCustomizedProductClient
)

// UPDATE DETAIL ORDER CUSTOMIZED PRODUCT [PUT]
router.put(
  "/update-detail-order-client/:id",
  [authJwt.verifyToken],
  OrderCustomizedProductController.updateDetailOrderCustomizedProductClient
)

/* ----------- ADMIN ----------- */
// GET LIST ORDER CUSTOMIZED PRODUCT [POST]
router.post(
  "/getListAdmin",
  [authJwt.isAdmin],
  OrderCustomizedProductController.getListOrderCustomizedProductAdmin
)

// GET DETAIL ORDER CUSTOMIZED PRODUCT [POST]
router.post(
  "/get-detail-order-admin/:id",
  [authJwt.isAdmin],
  OrderCustomizedProductController.getDetailOrderCustomizedProductAdmin
)

// UPDATE DETAIL ORDER CUSTOMIZED PRODUCT [PUT]
router.put(
  "/update-detail-order-admin/:id",
  [authJwt.isAdmin],
  OrderCustomizedProductController.updateDetailOrderCustomizedProductAdmin
)

// DELETE DETAIL ORDER CUSTOMIZED PRODUCT [DELETE]
router.delete(
  "/delete-detail-order/:id",
  [authJwt.verifyToken],
  OrderCustomizedProductController.deleteDetailOrderCustomizedProduct
)

module.exports = router