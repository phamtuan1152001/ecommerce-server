const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const Notification = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    // content: {
    //   type: String,
    // },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String
    },
    typeOrder: {
      type: Number // 1 - order product, 2 - order customized product
    },
    typePayment: {
      type: Number // 0 - pending (moi tao don hang), 1 - (thanh toan don hang thanh cong), 2 - (huy thanh toan don hang)
    },
    idOder: {
      type: String
    }
  },
  { timestamps: true }
);

Notification.plugin(mongoosePaginate);

module.exports = mongoose.model("Notification", Notification);