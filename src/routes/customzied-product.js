const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");

const CustomizedProductController = require("../app/controllers/CustomizedProductController")

// CLIENT
// CREATE CUSTOMIZED PRODUCT CLIENT [POST]
router.post(
  "/create",
  [authJwt.verifyToken],
  CustomizedProductController.create
)

// UPDATE DETAIL CUSTOMIZED PRODUCT CLIENT
router.put(
  "/update-customized-product-client/:id",
  [authJwt.verifyToken],
  CustomizedProductController.updateCustomizedProductClient
)

// GET LIST CUSTOMIZED PRODUCTS' CLIENT [POST]
router.post(
  "/getListClient",
  [authJwt.verifyToken],
  CustomizedProductController.getListCustomizedProductClient
)

// GET DETAIL CUSTOMIZED PRODUCT'S CLIENT [POST]
router.get(
  "/detail-customized-product-client/:id",
  [authJwt.verifyToken],
  CustomizedProductController.getDetailClient
)
// End

// ADMIN
// GET LIST CUSTOMIZED PRODUCTS' ADMIN [POST]
router.post(
  "/getListAdmin",
  [authJwt.isAdmin],
  CustomizedProductController.getListCustomizedProductAdmin
)

// UPDATE DETAIL CUSTOMIZED PRODUCT ADMIN
router.put(
  "/update-customized-product-admin/:id",
  [authJwt.isAdmin],
  CustomizedProductController.updateCustomizedProductAdmin
)

// GET DETAIL CUSTOMIZED PRODUCT ADMIN
router.post(
  "/detail-customized-product-client/:id",
  [authJwt.isAdmin],
  CustomizedProductController.getDetailAdmin
)
// End

// Common
router.delete(
  "/delete-customized-product/:id",
  [authJwt.verifyToken],
  CustomizedProductController.delete
)
// End

module.exports = router