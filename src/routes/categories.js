const express = require("express")
const router = express.Router()

const { authJwt } = require("../app/middleware");
const CategoryController = require("../app/controllers/CategoryController");

// [CREATE]
router.post("/create", [authJwt.verifyToken], CategoryController.create)

// [GET] all items
router.get("/listAll", [authJwt.verifyToken], CategoryController.getAllItems)

// [GET]
router.get("/detail/:id", [authJwt.verifyToken], CategoryController.getDetail)

module.exports = router;