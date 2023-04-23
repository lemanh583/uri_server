const schema = require("../validate/contact.schema");
const contactModel = require("../model/contact.model");
const Helper = require("../utils/helper");

class ContactController {
  static async create(req, res) {
    try {
      const data = req.body;
      await schema.validateAsync(data);
      let response = await contactModel.create(data);
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      const { page, limit, sort, search } = req.body;
      let skip = (page - 1) * limit;
      let condition = { deleted_time: { $exists: false } };
      if (search) {
        const searchRegex = new RegExp(`.*${search}.*`, "i");
        condition["$or"] = [{ name: searchRegex }, { phone: searchRegex }, { email: searchRegex }];
      }
      let response = await contactModel
        .find(condition)
        .sort(sort || { created_time: -1 })
        .skip(Number(skip))
        .limit(Number(limit));
      let count = await contactModel.count();
      return res.send({ success: true, list: response, total: count, totalPage: count % limit == 0 ? count / limit : Math.floor(count / limit) + 1 });
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
      let response = await contactModel.findOne({ _id: id });
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      let response = await contactModel.findOneAndUpdate({ _id: id }, { deleted_time: Date.now() });
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = ContactController;
