const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const Order = new Schema(
  {
    userId: {
      type: String,
    },
    statusOrder: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    orderAddress: {
      fullName: {
        type: String
      },
      phone: {
        type: String
      },
      email: {
        type: String
      },
      address: {
        type: String
      },
      provinceId: {
        type: String
      },
      districtId: {
        type: String,
      },
      wardId: {
        type: String
      },
      fullAddress: {
        type: String
      }
    },
    cartId: {
      type: String,
    },
    cartDetail: {
      _id: {
        type: String
      },
      userId: {
        type: String
      },
      items: [{
        productId: {
          type: String,
        },
        quantity: {
          type: Number
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product"
        },
        total: {
          type: Number
        },
        subTotal: {
          type: Number
        },
        _id: {
          type: String
        }
      }],
      totalPrice: {
        type: Number
      },
      subTotalPrice: {
        type: Number,
      },
      createdAt: {
        type: String
      },
      updatedAt: {
        type: String
      }
    }
    // cartDetail: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Cart"
    // }
    // voucherId: {
    //     type: String,
    // }
  },
  { timestamps: true }
);

Order.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", Order);
