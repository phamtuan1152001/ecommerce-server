const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");
const RankProductsController = require("../app/controllers/RankProductsController");


// [CLIENT] create
router.post("/create", RankProductsController.create);

// [CLIENT] post
router.post("/get-list-client", RankProductsController.listRankProducts)

module.exports = router;