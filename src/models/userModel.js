const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user_id:{type:Number},
    password: { type: String, required: true }, // encrypted password
    email_id: { type: String, required: true, unique: true },
    User_name: { type: String, required: true , unique: true },
    Gender:{type:String,Enum:["Male","Female","Other"]},
    Mobile: { type: String, required: true, unique: true },
    Profile:{type:String,Enum:["Public","Private"],default:"Public"}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);