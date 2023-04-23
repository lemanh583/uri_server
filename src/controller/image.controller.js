const schema = require("../validate/contact.schema");
const imageModel = require("../model/image.model");
const imageTopic = require("../model/imageTopic.model");
const Helper = require("../utils/helper");

class ImageController {
  static async list(req, res) {
    try {
      const { page, limit, sort, search, topicId } = req.body;
      let skip = (page - 1) * limit;
      let condition = {}
      if(topicId) {
        let imagesId = await imageTopic.find({ topic: topicId }).distinct("image");
        condition._id = {
          $nin: imagesId
        }
      }
      let response = await imageModel
        .find(condition)
        .sort(sort || { created_time: -1 })
        .skip(Number(skip))
        .limit(Number(limit));

      let count = await imageModel.count(condition);
      return res.send({ success: true, list: response, total: count, totalPage: count % limit == 0 ? count / limit : Math.floor(count / limit) + 1 });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      let response = await imageModel.findOneAndUpdate({ _id: id }, { delete_time: Date.now() });
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = ImageController;
