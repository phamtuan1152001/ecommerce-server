const TrackingUsers = require("../models/TrakingVisistors")

class TrackingVisistors {
  async create(req, res, next) {
    try {
      const visistor = new TrackingUsers(req.body);
      const result = await visistor.save();
      res.json({
        retCode: 0,
        retText: "Store user in DB successfully",
        retData: result,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new TrackingVisistors()