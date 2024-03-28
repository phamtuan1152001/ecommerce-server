const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const ManageImport = new Schema(
  {
    code: {
      type: String
    },
    listImages: [{
      uid: String,
      url: String
    }],
    description: {
      type: String
    }
  },
  { timestamps: true }
);

ManageImport.index({ code: "text" }, { default_language: "english", minLength: 1 });
// const test = mongoose.model("ManageImport", ManageImport);
// test.collection.dropIndexes();
// test.syncIndexes();

ManageImport.plugin(mongoosePaginate);

module.exports = mongoose.model("ManageImport", ManageImport);