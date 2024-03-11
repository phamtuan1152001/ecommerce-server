const express = require("express")
const router = express.Router()

const { authJwt } = require("../app/middleware");
const CategoryController = require("../app/controllers/CategoryController");

// [CREATE]
router.post("/create", [authJwt.verifyToken], CategoryController.create)

// [GET] all items Admin
router.post("/listAllAdmin", [authJwt.isAdmin], CategoryController.getAllItems)

// [GET] all items Client
router.get("/listAllClient", CategoryController.getAllItems)

// [GET]
router.get("/detail/:id", [authJwt.verifyToken], CategoryController.getDetail)

// [UPDATE] in detail
router.put("/update/:id", [authJwt.verifyToken], CategoryController.update);

// [DELETE]
router.delete("/delete/:id", [authJwt.verifyToken], CategoryController.delete);

module.exports = router;