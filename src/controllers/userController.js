const userModel = require("../models/userModel");
const countModel = require("../models/countModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("../validations/validator");

////////////////////////////aws////////////////////////////////

const createUser = async function (req, res) {
  try {
    const body = req.body;

    if (!validator.isValidDetails(body))
      return res
        .status(400)
        .send({ status: false, message: "Invalid Request" });

    let { name, email_id, password, User_name, Gender, Mobile, Profile } = body;

    if (!validator.isValidValue(name))
      return res
        .status(400)
        .send({ status: false, message: "Please provide First name" });

    if (!validator.isValidName(name))
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid First name" });

    if (!validator.isValidValue(email_id))
      return res
        .status(400)
        .send({ status: false, message: "Please provide Email" });

    if (!validator.isValidEmail(email_id)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid Email Address" });
    }

    const isDuplicateEmail = await userModel.findOne({ email_id });
    if (isDuplicateEmail) {
      return res
        .status(409)
        .send({ status: false, message: "email already exists" });
    }

    if (!validator.isValidValue(User_name))
      return res
        .status(400)
        .send({ status: false, message: "Please provide UserName" });

    const isDuplicateUserName = await userModel.findOne({ User_name });
    if (isDuplicateUserName) {
      return res
        .status(409)
        .send({ status: false, message: "This Username already exists" });
    }

    if (!validator.isValidValue(password)) {
      return res
        .status(400)
        .send({ status: false, messege: "Please provide password" });
    }

    if (!validator.isValidPassword(password)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Password must be of 8 letters and valid",
        });
    }

    if (!validator.isValidValue(Mobile)) {
      return res
        .status(400)
        .send({ status: false, messege: "Please provide phone number" });
    }

    if (!validator.isValidPhone(Mobile)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid phone number" });
    }

    const isDuplicatePhone = await userModel.findOne({ Mobile });
    if (isDuplicatePhone)
      return res
        .status(409)
        .send({ status: false, message: "phone no. already exists" });

    if (["Male", "Female", "Other"].indexOf(Gender) === -1) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Gender should be male,female or other",
        });
    }
    if (Profile) {
      if (["Public", "Private"].indexOf(Profile) === -1) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Profile should be public or private",
          });
      }
    }

    const salt = await bcrypt.genSalt(10);
    body["password"] = await bcrypt.hash(password, salt);

    const count_id = "62f49feee866dea2588cc4ba";
    const userCount = await countModel.findOneAndUpdate(
      count_id,
      { $inc: { users: 1 } },
      { new: true }
    );

    const newObj = { ...body, user_id: userCount.users };

    const newUser = await userModel.create(newObj);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: newUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//API #2 :POST /login
// Allow an user to login with their User_name and password.
// On a successful login attempt return the userId and a JWT token contatining the userId, exp, iat.

const loginUser = async function (req, res) {
  try {
    const loginData = req.body;

    const { User_name, password } = loginData;

    if (!validator.isValidDetails(loginData))
      return res
        .status(400)
        .send({ status: false, message: "Invalid Request" });

    if (!validator.isValidValue(User_name))
      return res
        .status(400)
        .send({ status: false, message: "EmailId is Required" });

    if (!validator.isValidValue(password))
      return res
        .status(400)
        .send({ status: false, message: "Password is Required" });

    const userDetail = await userModel.findOne({ User_name });
    if (!userDetail)
      return res
        .status(401)
        .send({ status: false, message: "User_name is NOT Correct" });

    const encryptedPassword = userDetail.password;

    const passwordCheck = await bcrypt.compare(password, encryptedPassword);

    if (!passwordCheck)
      return res
        .status(401)
        .send({ status: false, message: "Password is NOT Correct" });

    const userId = userDetail._id;
    const token = jwt.sign(
      {
        userId: userId,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // expirydate =24 hours
      },
      "Assignment"
    );

    return res
      .status(200)
      .send({ status: true, message: "User login successfull", data: token });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// Update User Profile
const updateUser = async function (req, res) {
  try {
    const userId = req.params.userId;
    if (!validator.isValidObjectId(userId))
      return res.status(400).send(`${userId} is not valid`);

    const findId = await userModel.findById(userId);
    if (!findId)
      return res
        .status(404)
        .send({ status: false, message: "No User With this Id" });

    if(req.userId!=userId)
       return res.status(403).send({ status: false, message: "Unauthorised Access" })

    const body = req.body;

    const { name, Profile, User_name, email_id, Mobile, password } = body;

    if (name) {
      if (!validator.isValidValue(name))
        return res
          .status(400)
          .send({ status: false, message: "Please provide First name" });

      if (!validator.isValidName(name))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid First name" });
    }

    if (email_id) {
      if (!validator.isValidValue(email_id))
        return res
          .status(400)
          .send({ status: false, message: "Please provide Email" });

      if (!validator.isValidEmail(email_id)) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Please provide valid Email Address",
          });
      }

      const isDuplicateEmail = await userModel.findOne({ email_id });
      if (isDuplicateEmail) {
        return res
          .status(409)
          .send({ status: false, message: "email already exists" });
      }
    }
    if (password) {
      if (!validator.isValidValue(password)) {
        return res
          .status(400)
          .send({ status: false, messege: "Please provide password" });
      }

      if (!validator.isValidPassword(password)) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Password must be of 8 letters and valid",
          });
      }

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }
    if (User_name) {
      if (!validator.isValidValue(User_name))
        return res
          .status(400)
          .send({ status: false, message: "Please provide UserName" });

      const isDuplicateUserName = await userModel.findOne({ User_name });
      if (isDuplicateUserName) {
        return res
          .status(409)
          .send({ status: false, message: "This Username already exists" });
      }
    }

    if (Mobile) {
      if (!validator.isValidValue(Mobile)) {
        return res
          .status(400)
          .send({ status: false, messege: "Please provide phone number" });
      }

      if (!validator.isValidPhone(Mobile)) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Please provide valid phone number",
          });
      }

      const isDuplicatePhone = await userModel.findOne({ Mobile });
      if (isDuplicatePhone)
        return res
          .status(409)
          .send({ status: false, message: "phone no. already exists" });
    }

    if (Profile) {
      if (["Public", "Private"].indexOf(Profile) === -1) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Profile should be public or private",
          });
      }
    }

    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "Success", data: updateUser });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.updateUser = updateUser;
