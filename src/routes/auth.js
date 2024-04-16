const express = require("express");
const router = express.Router();

const { verifySignUp } = require("../app/middleware");
const AuthController = require("../app/controllers/AuthController");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup", AuthController.signup);

router.post("/signin", AuthController.signin);

router.post("/confirmCode", AuthController.confirmActiveCode);

router.get('/logout', (req, res) => {
  // Clear token cookie
  res.clearCookie('token');
  res.json({
    retCode: 0,
    retData: {},
    retText: 'Logout successful'
  });
});

module.exports = router;
