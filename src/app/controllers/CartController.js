const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartController {
  // Create cart [POST]
  async createCart(req, res, next) {
    try {
      const { userId, productId, quantity, total, subTotal } = req.body
      const cartDetail = await Cart.findOne({
        userId,
      });
      // Calculate total price
      const getPriceTotal = (arrayPrice) => {
        return (
          arrayPrice
            .map((item) => {
              return item.total;
            })
            .reduce((total, currentValue) => {
              return total + currentValue;
            }) ?? 0
        );
      };
      // Calculate sub total price
      const getPriceSubTotal = (arrayPrice) => {
        return (
          arrayPrice
            .map((item) => {
              return item.subTotal;
            })
            .reduce((total, currentValue) => {
              return total + currentValue;
            }) ?? 0
        );
      };
      // Flow như thế này. Đầu tiên DB sẽ lưu tất cả cart của user đã tạo, chỉ cần filter theo userId thì sẽ có được cart của từng user. Nếu user đó chưa có cart thì sẽ tạo, sau đó sẽ check product đó có trong cart không nếu không có trong cart thì sẽ thêm vào array, nếu có thì sẽ duplicate số lượng và giá cả
      if (!cartDetail) {
        // req for cart if it doest exist any item in DB
        const req = {
          userId,
          items: [{
            productId,
            quantity,
            product: productId,
            total: total * quantity, // REGULAR PRICE
            subTotal: subTotal * quantity // SALE PRICE
          }],
          totalPrice: total * quantity, // REGULAR PRICE OF ALL ITEM
          subTotalPrice: subTotal * quantity // SALE PRICE OF ALL ITEM
        }
        const cart = new Cart(req);
        const createCart = await cart.save();
        res.json({
          retCode: 0,
          retText: "Successfully create",
          retData: createCart,
        });
      } else {
        // Check product is existed or not
        const isExistProduct = cartDetail.items.find(
          (item) => item?.productId === productId
        );
        if (!isExistProduct) {
          const listItemsInCart = [
            ...cartDetail.items,
            {
              productId,
              quantity,
              product: productId,
              total: total * quantity, // REGULAR PRICE
              subTotal: subTotal * quantity // SALE PRICE
            },
          ]
          const reqExist = {
            userId: userId,
            items: [
              ...cartDetail.items,
              {
                productId,
                quantity,
                product: productId,
                total: total * quantity, // REGULAR PRICE
                subTotal: subTotal * quantity // SALE PRICE
              },
            ],
            totalPrice: getPriceTotal(listItemsInCart),
            subTotalPrice: getPriceSubTotal(listItemsInCart),
          };
          cartDetail.set(reqExist);
          const updateCart = await cartDetail.save();
          res.json({
            retCode: 0,
            retText: "Successfully update",
            retData: updateCart,
          });
        } else {
          const existProduct = cartDetail.items.find(
            (item) => item?.productId === productId
          );
          Cart.updateOne(
            { "userId": userId },
            {
              $set: {
                "items.$[elem].quantity": existProduct?.quantity + quantity,
                'items.$[elem].total': existProduct?.total + total,
                'items.$[elem].subTotal': existProduct?.subTotal + subTotal,
                totalPrice: cartDetail?.totalPrice + total,
                subTotalPrice: cartDetail?.subTotalPrice + subTotal
              }
            },
            { arrayFilters: [{ "elem.productId": productId }] }
          )
            .then(result => {
              // console.log("result", result);
              res.json({
                retCode: 0,
                retText: "Successfully duplicate",
                retData: {},
              });
            })
            .catch(error => {
              // console.error(error);
              res.status(500).send(error);
            });
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  // Add single item in cart [POST]
  async addSingleItemInCart(req, res, next) {
    try {
      const { userId, productId, quantity, total, subTotal } = req.body
      const cartDetail = await Cart.findOne({
        userId,
      });
      const existProduct = cartDetail.items.find(
        (item) => item?.productId === productId
      );
      Cart.updateOne(
        { "userId": userId },
        {
          $set: {
            "items.$[elem].quantity": existProduct?.quantity + quantity,
            'items.$[elem].total': existProduct?.total + total,
            'items.$[elem].subTotal': existProduct?.subTotal + subTotal,
            totalPrice: cartDetail?.totalPrice + total,
            subTotalPrice: cartDetail?.subTotalPrice + subTotal
          }
        },
        { arrayFilters: [{ "elem.productId": productId }] }
      )
        .then(result => {
          // console.log("result", result);
          res.json({
            retCode: 0,
            retText: "Successfully add single item in cart",
            retData: {},
          });
        })
        .catch(error => {
          // console.error(error);
          res.status(500).send(error);
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  // Get list cart [GET]
  async getCart(req, res, next) {
    try {
      const { userId } = req.body;
      const cartDetail = await Cart.findOne({
        userId,
      }).populate("items.product");
      res.json({
        retCode: 0,
        retText: "Successfully",
        retData: cartDetail,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  // Remove item in cart [PATCH]
  async removeItemInCart(req, res, next) {
    try {
      const { userId, productId } = req.body;
      Cart.updateOne(
        {
          "userId": userId
        },
        {
          $pull: {
            items: {
              productId
            }
          }
        }
      ).then(result => {
        res.json({
          retCode: 0,
          retText: "Successfully delete",
          retData: {},
        });
      })
        .catch(error => {
          res.status(500).send(error);
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  // Delete single item in cart [POST]
  async deleteSingleItemInCart(req, res, next) {
    try {
      const { userId, productId, quantity, total, subTotal } = req.body
      const cartDetail = await Cart.findOne({
        userId,
      });
      const existProduct = cartDetail.items.find(
        (item) => item?.productId === productId
      );
      Cart.updateOne(
        { "userId": userId },
        {
          $set: {
            "items.$[elem].quantity": existProduct?.quantity - quantity,
            'items.$[elem].total': existProduct?.total - total,
            'items.$[elem].subTotal': existProduct?.subTotal - subTotal,
            totalPrice: cartDetail?.totalPrice - total,
            subTotalPrice: cartDetail?.subTotalPrice - subTotal
          }
        },
        { arrayFilters: [{ "elem.productId": productId }] }
      )
        .then(result => {
          // console.log("result", result);
          res.json({
            retCode: 0,
            retText: "Successfully delete single item in cart",
            retData: {},
          });
        })
        .catch(error => {
          console.error("er", error);
          res.status(500).send(error);
        });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async checkCartExist(req, res, next) {
    const { userId } = req.body;
    try {
      const data = await Cart.findOne({ userId });
      if (!!data) {
        res.json({
          retCode: 0,
          retText: "Users have already cart exist",
          retData: true,
        });
      } else {
        res.json({
          retCode: 1,
          retText: "Users have not already cart exist",
          retData: false,
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

module.exports = new CartController();
