const RankingProduct = require("../models/RankProducts");
const User = require("../models/User")

class RankProductsController {
  create(req, res, next) {
    /* 
      type = 1: product was buy
      type = 2: product was seen in detail
      type = 3: product was introduced with another one by catching event save to clipboard
      type = 4: product was saved as a favourite item by user
    */
    RankingProduct.findOne({ productId: req.body.productId }).exec(async (err, data) => {
      if (err) {
        res.status(500).send({ message: "Document not found" });
        return;
      }
      async function handeUpdateData(data, req) {
        const rankUpdate = await RankingProduct.findById(data._id).exec();
        rankUpdate.set(req);
        const result = await rankUpdate.save();
        res.json({
          retCode: 0,
          retText: "Update successfully!",
          retData: result,
        });
      }
      async function handleCreateData(req) {
        const rankCreate = new RankingProduct(req);
        const result = await rankCreate.save();
        res.json({
          retCode: 0,
          retText: "Create successfully",
          retData: result,
        });
      }
      if (!!data) {
        /* Hand;e update */
        switch (req.body.type) {
          case 1:
            const reqType0 = {
              ...data,
              countBuy: data.countBuy + 1
            }
            handeUpdateData(data, reqType0)
            break;
          case 2:
            const reqType1 = {
              ...data,
              countReview: data.countReview + 1
            }
            handeUpdateData(data, reqType1)
            break;
          // case 2:
          //   const reqType2 = {
          //     ...data,
          //     countRate: data.countRate + 1
          //   }
          //   handeUpdateData(data, reqType2)
          //   break;
          case 3:
            const reqType2 = {
              ...data,
              countIntroduce: data.countIntroduce + 1
            }
            handeUpdateData(data, reqType2)
            break;
          case 4:
            const reqType3 = {
              ...data,
              countSave: data.countSave + 1
            }
            handeUpdateData(data, reqType3)
            break;
          default:
            break;
        }
        /*  */
      } else {
        /* Handle create */
        switch (req.body.type) {
          case 1:
            const reqType0 = {
              ...req.body,
              countBuy: req.body.countBuy + 1
            }
            handleCreateData(reqType0)
            break;
          case 2:
            const reqType1 = {
              ...req.body,
              countReview: req.body.countReview + 1
            }
            handleCreateData(reqType1)
            break;
          // case 2:
          //   const reqType2 = {
          //     ...data,
          //     countRate: data.countRate + 1
          //   }
          //   handeUpdateData(data, reqType2)
          //   break;
          case 3:
            const reqType2 = {
              ...req.body,
              countIntroduce: req.body.countIntroduce + 1
            }
            handleCreateData(reqType2)
            break;
          case 4:
            const reqType3 = {
              ...req.body,
              countSave: req.body.countSave + 1
            }
            handleCreateData(reqType3)
            break;
          default:
            break;
        }
        /* End */
      }
    })
  }

  async listRankProducts(req, res, next) {
    const getPagination = (page, size) => {
      const limit = size ? +size : 0;
      const offset = page === 1 ? 0 : (page - 1) * limit;

      return { limit, offset };
    };

    const {
      page,
      size,
      action
    } = req.body;

    const filter = {};
    const sorter = {};

    if (action) {
      switch (action) {
        case 1:
          Object.assign(filter, { countBuy: { $gt: 2 } });
          Object.assign(sorter, { countBuy: -1 });
          break;
        case 2:
          Object.assign(filter, { countReview: { $gt: 2 } });
          Object.assign(sorter, { countReview: -1 });
          break;
        case 3:
          Object.assign(filter, { countIntroduce: { $gt: 2 } });
          Object.assign(sorter, { countIntroduce: -1 });
          break;
        case 4:
          Object.assign(filter, { countSave: { $gt: 2 } });
          Object.assign(sorter, { countSave: -1 });
          break;
        default:
          break;
      }
    }

    const { limit, offset } = getPagination(page, size);

    RankingProduct.paginate(filter, {
      offset,
      limit,
      sort: sorter,
      populate: [
        {
          path: "product",
          populate: { path: 'categories' }
        },
      ]
    })
      .then((data) => {
        res.json({
          retCode: 0,
          retText: "",
          retData: {
            totalItems: data.totalDocs,
            rankProducts: data.docs,
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
}

module.exports = new RankProductsController()