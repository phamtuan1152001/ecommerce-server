const Notification = require("../models/Notification")
const User = require("../models/User")
const common = require("../../utils/common")

class NotificationController {
  /* CLIENT */
  async createClient(req, res, next) {
    const { userId, typeOrder, idOrder, typePayment } = req.body || {}
    User.findOne({ "_id": userId }).exec(async (err, user) => {
      if (!user) {
        res.status(404).json({
          retCode: 1,
          retText: "User not found",
          retData: null
        });
        return
      }

      if (err) {
        res.status(500).json({
          retCode: 2,
          retText: err.message,
          retData: null
        })
        return
      }

      const payloadPending = {
        title: `Customer ${user.fullName} has just created an order!`,
        description: `${typeOrder === 1 ? "Order product" : "Order customized product"} - Code: ${idOrder}`,
        userId,
        status: "not-seen",
        typeOrder,
        typePayment,
        idOrder
      }

      const payloadSuccess = {
        title: `Customer ${user.fullName} has just paid an order!`,
        description: `${typeOrder === 1 ? "Order product" : "Order customized product"} - Code: ${idOrder}`,
        userId,
        status: "not-seen",
        typeOrder,
        typePayment,
        idOrder
      }

      const payloadCancel = {
        title: `Customer ${user.fullName} has just created an order successfully!`,
        description: `${typeOrder === 1 ? "Order product" : "Order customized product"} - Code: ${idOrder}`,
        userId,
        status: "not-seen",
        typeOrder,
        typePayment,
        idOrder
      }

      const payload = (id) => {
        switch (id) {
          case 0:
            return payloadPending
          case 1:
            return payloadSuccess
          case 2:
            return payloadCancel
          default:
            return
        }
      }

      try {
        const notification = new Notification(payload(typePayment));
        const result = await notification.save();
        res.json({
          retCode: 0,
          retText: "Create notification successfully",
          retData: result,
        });
      } catch (error) {
        res.status(500).send(error);
      }
    })
  }
  /* End */

  /* ADMIN */
  async getListNotificationAdmin(req, res, next) {
    const { page, size } = req.body;

    const filter = {};

    const { limit, offset } = common.getPagination(page, size);

    Notification.paginate(filter, { offset, limit })
      .then((data) => {
        res.json({
          retCode: 0,
          retText: "List notifications",
          retData: {
            totalItems: data.totalDocs,
            notifications: data.docs,
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
  /* End */
}

module.exports = new NotificationController()