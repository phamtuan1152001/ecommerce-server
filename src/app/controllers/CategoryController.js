const Category = require("../models/Category")

class CategoryController {
  // [POST]
  async create(req, res, next) {
    try {
      const { userId, ...rest } = req.body || {}
      const categories = new Category(rest);
      const result = await categories.save();
      res.json({
        retCode: 0,
        retText: "Create successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // [GET] all items
  async getAllItemsAdmin(req, res, next) {
    try {
      const result = await Category.find().exec()
      res.json({
        retCode: 0,
        retText: "List category in admin",
        retData: result,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  // [GET] all items
  async getAllItemsClient(req, res, next) {
    try {
      const result = await Category.find({ status: "publish" }).exec()
      res.json({
        retCode: 0,
        retText: "List category in client",
        retData: result,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  // [GET] in detail
  async getDetail(req, res, next) {
    try {
      // const result = await Category.findById(req.params.id).exec();
      const result = await Category.findById(req.params.id).exec()
      res.json({
        retCode: 0,
        retText: "Detail category",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // [PUT]
  async update(req, res, next) {
    try {
      const categoryDetail = await Category.findById(req.params.id).exec();
      categoryDetail.set(req.body);
      const result = await categoryDetail.save();
      res.json({
        retCode: 0,
        retText: "Update successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // [DELETE]
  async delete(req, res, next) {
    try {
      const result = await Category.deleteOne({
        _id: req.params.id,
      }).exec();
      res.json({
        retCode: 0,
        retText: "Delete successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new CategoryController();
