const Category = require("../models/Category")

class CategoryController {
  // [POST]
  async create(req, res, next) {
    try {
      const categories = new Category(req.body);
      const result = await categories.save();
      res.json({
        retCode: 0,
        retText: "Create Successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // [GET] all items
  async getAllItems(req, res, next) {
    try {
      const result = await Category.find().exec()
      res.json({
        retCode: 0,
        retText: "Thành công",
        retData: result,
      });
    } catch (err) {
      res.status(500).send(error);
    }
  }

  // [GET] in detail
  async getDetail(req, res, next) {
    try {
      // const result = await Category.findById(req.params.id).exec();
      const result = await Category.findById(req.params.id).exec()
      res.json({
        retCode: 0,
        retText: "Thành công",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new CategoryController();
