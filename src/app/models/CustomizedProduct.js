const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const CustomizedProduct = new Schema(
  {
    userId: {
      type: String,
    },
    code: {
      type: String,
    },
    name: {
      type: String
    },
    quantity: {
      type: Number
    },
    size: {
      type: String,
    },
    imageUrl: {
      type: String
    },
    imagePsd: {
      type: String,
    },
    statusProductAdmin: {
      type: Number, // 0: Chờ Admin duyệt; 1: Duyệt thành công ( cung cấp giá từ bên thiết kế); 2: Không được duyệt
    },
    statusProductClient: {
      type: Number, // 0: Chờ Client duyêt; 1: Client duyệt giá sản phẩm ( bắt đầu tạo Order từ chỗ này ); 2: Client không duyệt giá sản phẩm
    },
    regularPrice: {
      type: Number
    },
    totalPrice: {
      type: Number
    },
    statusOrder: {
      type: Boolean
    }
  },
  { timestamps: true }
);

CustomizedProduct.index({ name: "text" }, { default_language: "english", minLength: 1 });
// const test = mongoose.model("CustomizedProduct", CustomizedProduct);
// test.collection.dropIndexes();
// test.syncIndexes();

CustomizedProduct.plugin(mongoosePaginate);

module.exports = mongoose.model("CustomizedProduct", CustomizedProduct);