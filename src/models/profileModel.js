const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const profileSchema = new mongoose.Schema(
  {
    user_id: { type: ObjectId, ref: "User" },
    followers:{type:[String],default:[]},
    following:{type:[String],default:[]},
    blockedUsers:{type:[String],default:[]},
    postCount:{type:Number}
  },
  { timestamps: true }
);

module.exports = mongoose.model("profile", profileSchema);