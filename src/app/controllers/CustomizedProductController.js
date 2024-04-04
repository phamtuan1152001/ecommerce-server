const CustomizedProduct = require("../models/CustomizedProduct")

class CustomizedProductController {
  async create(req, res, next) {
    try {
      const customizedProduct = new CustomizedProduct(req.body);
      const result = await customizedProduct.save();
      res.json({
        retCode: 0,
        retText: "Create successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getListCustomizedProductClient(req, res, next) {
    const getPagination = (page, size) => {
      const limit = size ? +size : 0;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      return { limit, offset };
    };

    const { page, size, search, userId } = req.body;

    const filter = {};

    if (search) {
      filter.name = { $regex: new RegExp(search), $options: "i" };
    }

    if (userId) {
      Object.assign(filter, { userId });
    }

    const { limit, offset } = getPagination(page, size);

    CustomizedProduct.paginate(filter,
      {
        offset,
        limit,
        sort: {
          createdAt: -1
        },
      })
      .then((data) => {
        res.json({
          retCode: 0,
          retText: "List customized products' client",
          retData: {
            totalItems: data.totalDocs,
            customizedProducts: data.docs,
            totalPages: data.totalPages,
            currentPage: data.page - 1,
          },
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  }

  async getListCustomizedProductAdmin(req, res, next) {
    const getPagination = (page, size) => {
      const limit = size ? +size : 0;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      return { limit, offset };
    };

    const { page, size, search } = req.body;

    const filter = {};

    if (search) {
      filter.name = { $regex: new RegExp(search), $options: "i" };
    }

    const { limit, offset } = getPagination(page, size);

    CustomizedProduct.paginate(filter, {
      offset,
      limit,
      sort: {
        createdAt: -1
      },
    })
      .then((data) => {
        res.json({
          retCode: 0,
          retText: "List customized products' client",
          retData: {
            totalItems: data.totalDocs,
            customizedProducts: data.docs,
            totalPages: data.totalPages,
            currentPage: data.page - 1,
          },
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  }

  async updateCustomizedProductAdmin(req, res, next) {
    try {
      const { clientId, userId, ...rest } = req.body || {}
      const reqSend = {
        ...rest,
        userId: clientId
      }
      const customizedProductDetail = await CustomizedProduct.findById(req.params.id).exec();
      customizedProductDetail.set(reqSend);
      const result = await customizedProductDetail.save();
      res.json({
        retCode: 0,
        retText: "Admin update successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateCustomizedProductClient(req, res, next) {
    try {
      const customizedProductDetail = await CustomizedProduct.findById(req.params.id).exec();
      customizedProductDetail.set(req.body);
      const result = await customizedProductDetail.save();
      res.json({
        retCode: 0,
        retText: "Client update successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await CustomizedProduct.deleteOne({
        _id: req.params.id,
      }).exec();
      res.json({
        retCode: 0,
        retText: "Delete Successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getDetailClient(req, res, next) {
    try {
      const result = await CustomizedProduct.findById(req.params.id).exec();
      res.json({
        retCode: 0,
        retText: "Detail customized product client",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getDetailAdmin(req, res, next) {
    try {
      const result = await CustomizedProduct.findById(req.params.id).exec();
      res.json({
        retCode: 0,
        retText: "Detail customized product admin",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateStatusOrderCustomizedProduct(req, res, next) {
    try {
      const result = await CustomizedProduct.updateOne(
        { "code": req.body.code, },
        { $set: { "statusOrder": true } }
      )
      res.json({
        retCode: 0,
        retText: "Update status order of customized product successfully",
        retData: result
      })
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new CustomizedProductController()