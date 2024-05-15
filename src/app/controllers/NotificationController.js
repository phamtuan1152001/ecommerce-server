const Notification = require("../models/Notification")
const User = require("../models/User")
const common = require("../../utils/common")

class NotificationController {
  /* CLIENT */
  async pushNotiClientConfirmAdminOfferCustomizedProduct(req, res, next) {
    const { userId, code, typeConfirmClient } = req.body || {}
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

      const payloadCancel = {
        title: `Customer ${user.fullName} rejects store's owner offer about customized product!`,
        description: `Code: ${code}`,
        userId,
        status: "not-seen",
        typeOrder: 3,
        typePayment: 3,
        idOrder: "",
        userType: "admin"
      }

      const payloadConfirm = {
        title: `Customer ${user.fullName} accept store's owner offer about customized product!`,
        description: `Code: ${code}`,
        userId,
        status: "not-seen",
        typeOrder: 3,
        typePayment: 3,
        idOrder: "",
        userType: "admin"
      }

      const payload = (type) => {
        switch (type) {
          case 1:
            return payloadConfirm
          case 2:
            return payloadCancel
          default:
            return
        }
      }

      try {
        const notification = new Notification(payload(typeConfirmClient));
        const result = await notification.save();
        res.json({
          retCode: 0,
          retText: "Push notification client and admin offer customized product successfully",
          retData: result,
        });
      } catch (error) {
        res.status(500).send(error);
      }
    })
  }

  async pushNotiToAdminCustomizedProduct(req, res, next) {
    const { userId, code } = req.body || {}
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

      const payload = {
        title: `Customer ${user.fullName} has just created a Customized Product!`,
        description: `Code: ${code}`,
        userId,
        status: "not-seen",
        typeOrder: 3,
        typePayment: 3,
        idOrder: "",
        userType: "admin"
      }

      try {
        const notification = new Notification(payload);
        const result = await notification.save();
        res.json({
          retCode: 0,
          retText: "Push notification for customized product to admin successfully",
          retData: result,
        });
      } catch (error) {
        res.status(500).send(error);
      }
    })
  }

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

  updateStatusSeenNotiClient(req, res, next) {
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
        retText: "Update status notification successfully in client",
        retData: update
      })
    })
  }
  /* End */

  /* ADMIN */
  async pushNotiToClientCustomizedProductForConfirm(req, res, next) {
    const { userId, mainUserId, code, typeConfirm } = req.body || {}
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

      const payloadCancel = {
        title: `Store's owner had cancelled your Customized Product!`,
        description: `Code: ${code}`,
        userId: mainUserId,
        status: "not-seen",
        typeOrder: 3,
        typePayment: 3,
        idOrder: "",
        userType: "client"
      }

      const payloadSuccess = {
        title: `Store's owner had confirmed your Customized Product!`,
        description: `Code: ${code}`,
        userId: mainUserId,
        status: "not-seen",
        typeOrder: 3,
        typePayment: 3,
        idOrder: "",
        userType: "client"
      }

      const payload = (id) => {
        switch (id) {
          case 1:
            return payloadSuccess
          case 2:
            return payloadCancel
          default:
            return
        }
      }

      try {
        const notification = new Notification(payload(typeConfirm));
        const result = await notification.save();
        res.json({
          retCode: 0,
          retText: "Push notification for customized product to confirm for client successfully",
          retData: result,
        });
      } catch (error) {
        res.status(500).send(error);
      }
    })
  }

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

  // COMMON
  readAll(req, res, next) {
    try {
      const { userId, userType } = req.body || {}
      if (userType === "admin") {
        Notification.updateMany(
          {
            userType: "admin"
          },
          {
            $set: {
              "status": "seen"
            }
          }
        ).exec((err, record) => {
          if (err) {
            res.status(500).json({
              retCode: 2,
              retText: err.message,
              retData: null
            })
            return
          }

          return res.json({
            retCode: 0,
            retText: "Read all notification successfully",
            retData: record,
          })
        })
      } else {
        Notification.updateMany(
          {
            userId,
            userType: "client"
          },
          {
            $set: {
              "status": "seen"
            }
          }
        ).exec((err, record) => {
          if (err) {
            res.status(500).json({
              retCode: 2,
              retText: err.message,
              retData: null
            })
            return
          }

          return res.json({
            retCode: 0,
            retText: "Read all notification successfully",
            retData: record,
          })
        })
      }
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  }
}

module.exports = new NotificationController()