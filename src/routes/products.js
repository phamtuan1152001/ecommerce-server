const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");
const ProductsController = require("../app/controllers/ProductsController");

// Admin

// create products [Admin]
router.post("/create", [authJwt.isAdmin], ProductsController.create);

// post list producst with pagination [Client]
router.post(
  "/listProducts",
  ProductsController.getListWithPaginate
);

// get detail product [Client]
router.get(
  "/detail/:cateSlug/:slug",
  ProductsController.getDetail
);

// post list producst with pagination [Admin]
router.post(
  "/listProductsAdmin",
  [authJwt.isAdmin],
  ProductsController.getListWithPaginate
);

// get detail product [Admin]
router.get(
  "/detail-admin/:cateSlug/:slug",
  // [authJwt.isAdmin],
  ProductsController.getDetail
);

// update products [Admin]
router.put("/update/:id", [authJwt.isAdmin], ProductsController.update);

// delete products [Admin]
router.delete("/delete/:id", [authJwt.verifyToken], ProductsController.delete);

// best seller products (temporary)
router.post("/best-seller", ProductsController.getListWithPaginate)

// // search product
// router.post(
//   "/search-product",
//   [authJwt.verifyToken],
//   ProductsController.searchProduct
// );

// End

module.exports = router;
