const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  codeActive: {
    type: Number,
  },
  statusActive: {
    type: Number,
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

module.exports = mongoose.model("User", User);
