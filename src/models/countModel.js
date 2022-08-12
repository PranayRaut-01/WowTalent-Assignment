const mongoose = require("mongoose");

const countSchema = new mongoose.Schema(
  { 
    users:{type:Number}
  },
  { timestamps: true }
);

module.exports = mongoose.model("count", countSchema);