const express = require("express");
const router = express.Router();

const { authJwt } = require("../app/middleware");

import PaymentController from "../app/controllers/PaymentController";

// CREATE PAYMENT MOMO [POST]
router.post(
  "/momo-payment",
  [authJwt.verifyToken],
  PaymentController.createPaymentMomo
)

module.exports = router;
