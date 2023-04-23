const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

class UserController {
  static async create(req, res) {
    try {
      const data = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(data.password, salt);
      data.password = hashPass;
      const newUser = await userModel.create(data);
      if (!newUser) return res.status(500).send({ success: false, message: "create failed" });
      const token = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
      return res.send({ success: true, data: newUser, token: token });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async get(req, res) {
    try {
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const data = req.body;
      const find = await userModel.findOne({ email: data.email });
      if (!find) {
        return res.status(400).send({ success: false, message: "Incorrect email or password. Please check again!" });
      }
      const checkPass = await bcrypt.compareSync(data.password, find.password); // true
      if (!checkPass) {
        return res.status(400).send({
          success: false,
          message: "Incorrect email or password. Please check again!",
        });
      }
      const token = jwt.sign({ id: find._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
      return res.status(200).send({ success: true, token, message: "Login success!" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = UserController;
