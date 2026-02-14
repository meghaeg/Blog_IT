const mongoose = require("mongoose");
const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    savedBlogs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
    }]
  },
  {
    timestamps: true
  },
);
module.exports = mongoose.model("User", userschema);

