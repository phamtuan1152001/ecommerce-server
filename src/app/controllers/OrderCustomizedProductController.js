const OrderCustomizedProduct = require("../models/OrderCustomizedProduct");

class OrderCustomizedProductController {
  async deleteMany(req, res, next) {
    try {
      const result = await OrderCustomizedProduct.deleteMany()
      res.json({
        retCode: 0,
        retText: "Delete many successfully",
        retData: result
      })
    } catch (err) {
      console.log("FETCHING FAIL!", err)
    }
  }

  async getAllOrderCustomizedProducts(req, res, next) {
    const { dateStart, dateEnd, ...rest } = req.body || {}

    const filter = {
      createdAt: {
        $gte: new Date(dateStart),
        $lte: new Date(dateEnd)
      }
    };

    OrderCustomizedProduct
      .find(filter, {})
      .populate([
        {
          path: "customizedProduct",
        }
      ])
      .exec((err, data) => {
        res.json({
          retCode: 0,
          retText: "List all order for dashboard",
          retData: {
            ordersCustomizedProduct: data
          }
        })
      })
  }

  /* ----------- CLIENT ----------- */
  async create(req, res, next) {
    try {
      const orderCustomizedProductRouter = new OrderCustomizedProduct(req.body);
      const result = await orderCustomizedProductRouter.save();
      res.json({
        retCode: 0,
        retText: "Create successfully order customized product",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getListOrderCustomizedProductClient(req, res, next) {
    const getPagination = (page, size) => {
      const limit = size ? +size : 0;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      return { limit, offset };
    };
    const { page, size, orderText, dateStart, dateEnd, userId } = req.body;

    const filter = {};

    if (dateStart || dateEnd) {
      Object.assign(filter, {
        createdAt: {
          $gte: new Date(dateStart),
          $lte: new Date(dateEnd)
        }
      });
    }

    if (orderText) {
      const searching = { $regex: new RegExp(orderText), $options: "i" }
      Object.assign(filter, {
        "orderAddress.fullName": searching
      })
    }

    if (userId) {
      Object.assign(filter, { userId });
    }

    const { limit, offset } = getPagination(page, size);
    // console.log("filter", filter);

    OrderCustomizedProduct.paginate(filter, {
      offset,
      limit,
      sort: {
        createdAt: -1
      },
      populate: [
        {
          path: "customizedProduct",
        }
      ]
    })
      .then(async (data) => {
        const { totalDocs, docs, totalPages, page } = data || {};
        res.json({
          retCode: 0,
          retText: "List order customized product Client",
          retData: {
            totalItems: totalDocs,
            ordersCustomizedProduct: docs,
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

  async getDetailOrderCustomizedProductClient(req, res, next) {
    try {
      const result = await OrderCustomizedProduct.findById(req.params.id)
        .populate({
          path: "customizedProduct",
        })
        .exec();

      res.json({
        retCode: 0,
        retText: "Successfully detail customized product Client",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateDetailOrderCustomizedProductClient(req, res, next) {
    try {
      const orderDetailCustomizedProduct = await OrderCustomizedProduct.findById(req.params.id).exec();
      orderDetailCustomizedProduct.set(req.body);
      const result = await orderDetailCustomizedProduct.save();
      res.json({
        retCode: 0,
        retText: "Successfully Update Status Order Customized Product Client",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  /* ----------- ADMIN ----------- */
  async getListOrderCustomizedProductAdmin(req, res, next) {
    const getPagination = (page, size) => {
      const limit = size ? +size : 0;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      return { limit, offset };
    };
    const { page, size, orderText, dateStart, dateEnd } = req.body;

    const filter = {};

    if (dateStart || dateEnd) {
      Object.assign(filter, {
        createdAt: {
          $gte: new Date(dateStart),
          $lte: new Date(dateEnd)
        }
      });
    }

    if (orderText) {
      const searching = { $regex: new RegExp(orderText), $options: "i" }
      Object.assign(filter, {
        "orderAddress.fullName": searching
      })
    }

    const { limit, offset } = getPagination(page, size);
    // console.log("filter", filter);

    OrderCustomizedProduct.paginate(filter, {
      offset,
      limit,
      sort: {
        createdAt: -1
      },
      populate: [
        {
          path: "customizedProduct",
        }
      ]
    })
      .then(async (data) => {
        const { totalDocs, docs, totalPages, page } = data || {};
        res.json({
          retCode: 0,
          retText: "List order customized product Admin",
          retData: {
            totalItems: totalDocs,
            ordersCustomizedProduct: docs,
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

  async getDetailOrderCustomizedProductAdmin(req, res, next) {
    try {
      const result = await OrderCustomizedProduct.findById(req.params.id)
        .populate({
          path: "customizedProduct",
        })
        .exec();

      res.json({
        retCode: 0,
        retText: "Successfully detail customized product Admin",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateDetailOrderCustomizedProductAdmin(req, res, next) {
    try {
      const { userId, clientId, ...rest } = req.body
      const payload = {
        userId: clientId,
        ...rest
      }
      // console.log("req", payload);
      const orderDetailCustomizedProduct = await OrderCustomizedProduct.findById(req.params.id).exec();
      orderDetailCustomizedProduct.set(payload);
      const result = await orderDetailCustomizedProduct.save();
      res.json({
        retCode: 0,
        retText: "Successfully Update Status Order Customized Product Admin",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async deleteDetailOrderCustomizedProduct(req, res, next) {
    try {
      const result = await OrderCustomizedProduct.deleteOne({
        _id: req.params.id,
      }).exec();
      res.json({
        retCode: 0,
        retText: "Successfully Delete Detail Order Customized Product Common",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new OrderCustomizedProductController