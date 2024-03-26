const express = require("express")
const router = express.Router()

const { authJwt } = require("../app/middleware");
const CategoryController = require("../app/controllers/CategoryController");

// [CREATE]
router.post("/create", [authJwt.isAdmin], CategoryController.create)

// [GET] all items Admin
router.post("/listAllAdmin", [authJwt.isAdmin], CategoryController.getAllItemsAdmin)

// [GET] all items Client
router.get("/listAllClient", CategoryController.getAllItemsClient)

// [GET]
router.post("/detail/:id", [authJwt.isAdmin], CategoryController.getDetail)

// [UPDATE] in detail
router.put("/update/:id", [authJwt.isAdmin], CategoryController.update);

// [DELETE]
router.delete("/delete/:id", [authJwt.verifyToken], CategoryController.delete);

module.exports = router;