const productsRouter = require("./products");
const categoriesRouter = require("./categories")
const authRouter = require("./auth");
const userRouter = require("./user");
const uploadRouter = require("./upload");
const feedbackRouter = require("./feedbacks");
const sendEmailRouter = require("./sendemail");
const voucherRouter = require("./vouchers");
const cartRouter = require("./cart");
const orderRouter = require("./order");
const newsRouter = require("./news");
const dalleRouter = require("./dalle")
const paymentRouter = require("./payment")
const rankProductRouter = require("./ranking-products")
const manageImportRouter = require("./manage-import")
// "start": "nodemon --inspect src/index.js",
// "start": "node src/index.js",

function route(app) {
  // manage import
  app.use("/manage-import", manageImportRouter)

  // ranking product
  app.use("/ranking-products", rankProductRouter)

  // payment
  app.use("/payment", paymentRouter)

  // dalle-e
  app.use("/dall-e", dalleRouter)

  // news
  app.use("/news", newsRouter);

  // order
  app.use("/order", orderRouter);

  // cart
  app.use("/cart", cartRouter);

  // voucher
  app.use("/vouchers", voucherRouter);

  // send email
  app.use("/send-email", sendEmailRouter);

  // feedbacks
  app.use("/feedback", feedbackRouter);

  // upload
  app.use("/upload", uploadRouter);

  // signin-signup for authenticate
  app.use("/auth", authRouter);

  // authorization - test
  app.use("/user", userRouter);

  // main
  app.use("/products", productsRouter);

  // category
  app.use("/categories", categoriesRouter)

  // home
  app.get("/", (req, res, next) => {
    return res.status(200).json({
      message: "Server is OK - pham le song tuan -haha!",
    });
  });
}

module.exports = route;
