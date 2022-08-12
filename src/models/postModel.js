const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema(
  {
    user_id: { type: ObjectId, ref: "User" },
    text: { type: String },
    image: { type: String },
    status: { type: String, Enum: ["Public", "Private"], default: "Public" },
    hashtag: { type: [String], default: [] },
    friendTag: { type: [String], default: [] },
    comment:{type: [{ userId: { type: String }, comment: { type: String } }],default:[]},
    likedBy:{ type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
