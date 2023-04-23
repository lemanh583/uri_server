const schema = require("../validate/contact.schema");
const imageTopicModel = require("../model/imageTopic.model");
const Helper = require("../utils/helper");

class ImageController {
  //   static async list(req, res) {
  //     try {
  //       const { page, limit, sort, search } = req.body;
  //       let skip = (page - 1) * limit;
  //       let response = await imageModel
  //         .find({})
  //         .sort(sort || { created_time: -1 })
  //         .skip(Number(skip))
  //         .limit(Number(limit));
  //       let count = await imageModel.count();
  //       return res.send({ success: true, list: response, total: count, totalPage: count % limit == 0 ? count / limit : Math.floor(count / limit) + 1 });
  //     } catch (error) {
  //       console.error(error);
  //       return res.status(500).send({ success: false, message: error.message });
  //     }
  //   }

  static async delete(req, res) {
    try {
      const { topicId, imagesId } = req.body;
      let response = await imageTopicModel.updateMany({ topic: topicId, image: { $in: imagesId } }, { $set: { deleted_time: Date.now() } });
      return res.send({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = ImageController;
