const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");
const CartController = require("../app/controllers/CartController");

// Create list item in cart
router.post("/create-cart", [authJwt.verifyToken], CartController.createCart);

// Add single item in cart
router.post("/add-single-item", [authJwt.verifyToken], CartController.addSingleItemInCart);

// Get item in cart
router.post("/get-cart", [authJwt.verifyToken], CartController.getCart);

// Remove item in cart
router.patch("/remove-item-cart", [authJwt.verifyToken], CartController.removeItemInCart)

// Delete single item in cart
router.post("/delete-single-item", [authJwt.verifyToken], CartController.deleteSingleItemInCart)

// Check cart exist
router.post(
  "/check-cart-exist",
  [authJwt.verifyToken],
  CartController.checkCartExist
);

// Delete all products in cart
router.post(
  "/delete-all-products-in-cart",
  [authJwt.verifyToken],
  CartController.deleteAllProductsInCart
)

module.exports = router;
