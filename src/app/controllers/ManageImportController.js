const ManageImport = require("../models/ManageImport")

class ManageImportController {
  // [POST] create
  async create(req, res, next) {
    try {
      const { userId, ...rest } = req.body || {}
      const manageImport = new ManageImport(rest);
      const result = await manageImport.save();
      res.json({
        retCode: 0,
        retText: "Create successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // [POST] get list with pagination
  getListWithPaginate(req, res, next) {
    // console.log("req", req);
    const getPagination = (page, size) => {
      const limit = size ? +size : 0;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      return { limit, offset };
    };

    const {
      page,
      size,
      search
    } = req.body;

    const filter = {};

    if (search) {
      filter.name = { $regex: new RegExp(search), $options: "i" };
    }

    const { limit, offset } = getPagination(page, size);

    ManageImport.paginate(filter, {
      offset,
      limit,
      sort: {
        createdAt: -1
      },
    })
      .then((data) => {
        res.json({
          retCode: 0,
          retText: "",
          retData: {
            totalItems: data.totalDocs,
            imports: data.docs,
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

  // [GET] in detail
  async getDetail(req, res, next) {
    try {
      const result = await ManageImport.findById(req.params.id).exec();
      res.json({
        retCode: 0,
        retText: "Detail Manage Import",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // [PUT] update
  async update(req, res, next) {
    try {
      const manageImportDetail = await ManageImport.findById(req.params.id).exec();
      manageImportDetail.set(req.body);
      const result = await manageImportDetail.save();
      res.json({
        retCode: 0,
        retText: "Update successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // [DELETE] delete
  async delete(req, res, next) {
    try {
      const result = await ManageImport.deleteOne({
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

module.exports = new ManageImportController();