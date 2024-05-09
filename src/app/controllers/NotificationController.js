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
        idOrder,
        userType: "admin"
      }

      const payloadSuccess = {
        title: `Customer ${user.fullName} has just paid an order!`,
        description: `${typeOrder === 1 ? "Order product" : "Order customized product"} - Code: ${idOrder}`,
        userId,
        status: "not-seen",
        typeOrder,
        typePayment,
        idOrder,
        userType: "admin"
      }

      const payloadCancel = {
        title: `Customer ${user.fullName} has just created an order successfully!`,
        description: `${typeOrder === 1 ? "Order product" : "Order customized product"} - Code: ${idOrder}`,
        userId,
        status: "not-seen",
        typeOrder,
        typePayment,
        idOrder,
        userType: "admin"
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
          retText: "Push notification to admin successfully",
          retData: result,
        });
      } catch (error) {
        res.status(500).send(error);
      }
    })
  }

  async getListNotificationClient(req, res, next) {
    const { page, size, userId } = req.body;

    const filter = {
      userType: "client",
      userId
    };

    const { limit, offset } = common.getPagination(page, size);

    Notification.paginate(filter, {
      offset,
      limit,
      sort: {
        createdAt: -1
      },
    })
      .then((data) => {
        res.json({
          retCode: 0,
          retText: "List notifications client",
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

  /* ADMIN */
  createAdmin(req, res, next) {
    const { mainUserId, typeOrder, idOrder, typePayment } = req.body || {}
    User.findOne({ "_id": mainUserId }).exec(async (err, user) => {
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

      const payloadSuccess = {
        title: `Store's owner has just confirmed your payment successfully!`,
        description: `${typeOrder === 1 ? "Order product" : "Order customized product"} - Code: ${idOrder}`,
        userId: mainUserId,
        status: "not-seen",
        typeOrder,
        typePayment,
        idOrder,
        userType: "client"
      }

      const payloadCancel = {
        title: `Store's owner has just cancel your payment!`,
        description: `${typeOrder === 1 ? "Order product" : "Order customized product"} - Code: ${idOrder}`,
        userId: mainUserId,
        status: "not-seen",
        typeOrder,
        typePayment,
        idOrder,
        userType: "client"
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
          retText: "Push notification to client successfully",
          retData: result,
        });
      } catch (error) {
        res.status(500).send(error);
      }
    })
  }

  async getListNotificationAdmin(req, res, next) {
    const { page, size } = req.body;

    const filter = {
      userType: "admin"
    };

    const { limit, offset } = common.getPagination(page, size);

    Notification.paginate(filter, {
      offset,
      limit,
      sort: {
        createdAt: -1
      },
    })
      .then((data) => {
        res.json({
          retCode: 0,
          retText: "List notifications admin",
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

  updateStatusSeenNoti(req, res, next) {
    const { notificationId } = req.body || {}
    Notification.updateOne(
      { "_id": notificationId },
      {
        $set: {
          status: "seen"
        }
      }
    ).exec((err, update) => {
      if (err) {
        res.status(500).json({
          retCode: 2,
          retText: err.message,
          retData: null
        })
        return
      }

      res.json({
        retCode: 0,
        retText: "Update status notification successfully",
        retData: update
      })
    })
  }
  /* End */
}

module.exports = new NotificationController()