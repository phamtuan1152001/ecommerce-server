const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");
const ManageImportController = require("../app/controllers/ManageImportController")

// Admin
// CREATE [POST]
router.post("/create", [authJwt.isAdmin], ManageImportController.create)

// GET LIST [POST]
router.post("/listImports", [authJwt.isAdmin], ManageImportController.getListWithPaginate)

// GET DETAIL [POST]
router.post("/detail-import/:id", [authJwt.isAdmin], ManageImportController.getDetail)

// UPDATE DETAIL [PUT]
router.put("/update-detail-import/:id", [authJwt.isAdmin], ManageImportController.update)

// DELETE DETAIL [DELETE]
router.delete("/delete-detail-import/:id", [authJwt.isAdmin], ManageImportController.delete)

module.exports = router;