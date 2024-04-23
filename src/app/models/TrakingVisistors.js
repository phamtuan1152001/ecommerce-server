const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TrackingVisistors = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    accessToken: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrackingVisistors", TrackingVisistors);