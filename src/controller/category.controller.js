const schema = require("../validate/category.schema");
const categoryModel = require("../model/category.model");
const Helper = require("../utils/helper");

class CategoryController {
  static async create(req, res) {
    try {
      const data = req.body;
      await schema.validateAsync(data);
      data.slug = Helper.removeAccents(data.name, false);
      let find = await categoryModel.findOne({ slug: data.slug });
      if (find) {
        return res.status(500).send({ success: false, message: "category exists" });
      }
      let response = await categoryModel.create(data);
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      let response = await categoryModel.find();  
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
      let response = await categoryModel.findOne({ _id: id });
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      let response = await categoryModel.findOneAndUpdate({ _id: id }, { delete_time: Date.now });
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
      if (!id) {
        return res.status(500).send({ success: false, message: "no id" });
      }
      data.slug = Helper.removeAccents(data.name, false);
      let find = await categoryModel.findOne({ slug: data.slug });
      if (find) {
        return res.status(500).send({ success: false, message: "category exists" });
      }
      let response = await categoryModel.findOneAndUpdate({ _id: id }, data, { new: true });
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = CategoryController;
