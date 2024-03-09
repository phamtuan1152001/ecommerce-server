const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

class OrderController {
  // Create Order Client [POST]
  async createOrder(req, res, next) {
    // statusOrder: gom 3 trang thai: 0 la cho thanh toan, 1 la thanh toan thanh cong, 2 la huy giao dich

    // methodPayment: gom 2 trang thai: 0 la thanh toan online, 1 la thanh toan truc tiep

    // methodReiceive: gom 2 trang thai: 0 la giao hang online, 1 la nhan hang truc tiep

    try {
      // console.log("req.body", req.body);
      const cartDetail = await Cart.findOne({
        userId: req.body.userId,
      }).populate("items.product").exec();
      const reqSave = {
        ...req.body,
        cartDetail: cartDetail
      }
      // res.send(reqSave)
      const order = new Order(reqSave);
      const result = await order.save();
      res.status(200).json({
        retCode: 0,
        retText: "Create order successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // GET LIST ORDER ADMIN [POST]
  async getListOrder(req, res, next) {
    const getPagination = (page, size) => {
      const limit = size ? +size : 0;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      return { limit, offset };
    };
    const { page, size, productText } = req.body;

    const filter = {};

    if (productText) {
      filter.name = { $regex: new RegExp(productText), $options: "i" };
    }

    const { limit, offset } = getPagination(page, size);

    Order.paginate(filter, {
      offset,
      limit,
      populate: [
        {
          path: "cartDetail",
          populate: {
            path: "items.product", // Assuming "product" is the field referencing the product model
            // select: "code name" // Adjust fields as needed
          }
        }
      ]
    })
      .then(async (data) => {
        const { totalDocs, docs, totalPages, page } = data || {};
        res.json({
          retCode: 0,
          retText: "List order",
          retData: {
            totalItems: totalDocs,
            orders: docs,
            totalPages: totalPages,
            currentPage: page - 1,
          },
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  }

  // GET DETAIL ORDER [GET]
  async getDetailOrder(req, res, next) {
    try {
      const result = await Order.findById(req.params.id)
        .populate({
          path: "cartDetail",
          populate: {
            path: "items.product", // Assuming "product" is the field referencing the product model
            // select: "code name" // Adjust fields as needed
          }
        })
        .exec();

      res.json({
        retCode: 0,
        retText: "Successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // DELETE ORDER ADMIN [DELETE]
  async deleteDetailOrder(req, res, next) {
    try {
      const result = await Order.deleteOne({
        _id: req.params.id,
      }).exec();
      res.json({
        retCode: 0,
        retText: "Successfully Delete Detail Order",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // UPDATE ORDER [PUT]
  async updateOrder(req, res, next) {
    try {
      const orderDetail = await Order.findById(req.params.id).exec();
      orderDetail.set(req.body);
      const result = await orderDetail.save();
      res.json({
        retCode: 0,
        retText: "Successfully Update Order",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // GET LIST ORDER CLIENT [POST]
  async getListOrderClient(req, res, next) {
    const getPagination = (page, size) => {
      const limit = size ? +size : 0;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      return { limit, offset };
    };
    const { page, size, productText, userId } = req.body;

    const filter = {};

    if (productText) {
      filter.name = { $regex: new RegExp(productText), $options: "i" };
    }

    if (userId) {
      Object.assign(filter, { userId });
    }

    const { limit, offset } = getPagination(page, size);

    Order.paginate(filter, {
      offset,
      limit,
      populate: [
        // {
        //   path: "cartDetail"
        // },
        {
          path: "cartDetail",
          populate: {
            path: "items.product", // Assuming "product" is the field referencing the product model
            // select: "code name" // Adjust fields as needed
          }
        }
      ]
    })
      .then(async (data) => {
        const { totalDocs, docs, totalPages, page } = data || {};
        res.json({
          retCode: 0,
          retText: "List order",
          retData: {
            totalItems: totalDocs,
            orders: docs,
            totalPages: totalPages,
            currentPage: page - 1,
          },
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  }
}

module.exports = new OrderController();
