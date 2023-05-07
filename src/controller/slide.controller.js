// const schema = require("../validate/category.schema");
const slideModel = require("../model/slide.model");
const Helper = require("../utils/helper");
const Upload = require("./upload.controller");

class SlideController {
  static async create(req, res) {
    try {
      const data = req.body;
      const file = req?.files?.file;
      if (file) {
        const rs = await Upload.uploadToCloudinary(file, "image");
        data.image = rs.img._id;
        data.url_image = rs.img.src;
      }
      let response = await slideModel.create(data);
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      Upload.removeTmp(req?.files?.file?.tempFilePath);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      let response = await slideModel.find({ deleted_time: { $exists: false } }).sort({ created_time: 1 });
      return res.send({ success: true, list: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async get(req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(500).send({ success: false, message: "no id" });
      }
      let response = await slideModel.findOne({ _id: id });
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      let response = await slideModel.findOneAndUpdate({ _id: id }, { deleted_time: Date.now() });
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const file = req?.files?.file;
      if (!id) {
        return res.status(500).send({ success: false, message: "no id" });
      }
      if (file) {
        const rs = await Upload.uploadToCloudinary(file, "image");
        data.image = rs.img._id;
        data.url_image = rs.img.src;
      }
      let response = await slideModel.findOneAndUpdate({ _id: id }, data, { new: true });
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = SlideController;
