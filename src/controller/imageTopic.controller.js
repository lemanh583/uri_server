const schema = require("../validate/contact.schema");
const imageTopicModel = require("../model/imageTopic.model");
const topicModel = require("../model/topic.model");
const Helper = require("../utils/helper");
const cache = require("../utils/cache");

class ImageController {
  static async list(req, res) {
    try {
      const { page, limit, sort, search, slug_topic } = req.body;
      let skip = (page - 1) * limit;
      let topic = await topicModel.findOne({ slug: slug_topic || "co-so-vat-chat" });
      let condition = { deleted_time: { $exists: false } };
      if (slug_topic) {
        condition.topic = topic._id;
      } else {
        condition.topic = { $ne: topic._id };
      }
      let response = await imageTopicModel
        .find(condition)
        .populate("image")
        .populate("topic")
        .sort(sort || { created_time: -1 })
        .skip(Number(skip) || 0)
        .limit(Number(limit) || 20);
      let count = await imageTopicModel.count(condition);
      return res.send({ success: true, list: response, total: count, totalPage: count % limit == 0 ? count / limit : Math.floor(count / limit) + 1 });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async listWithTopic(req, res) {
    try {
      const { page, limit, sort, search, slug_topic } = req.body;
      let data = cache.get(`URI-images-${page}-${limit}`)
      if(data) {
        return res.send(JSON.parse(data))
      }
      let skip = (page - 1) * limit;
      let condition = { deleted_time: { $exists: false } };
      condition.slug = { $ne: 'co-so-vat-chat' };
      let response = await topicModel.aggregate([
        { $match: condition },
        { $sort: { created_time: -1 } },
        { $lookup: { from: "image-topics", localField: "_id", foreignField: "topic", as: "image_topic" } },
        { $unwind: "$image_topic" },
        { $match: { "image_topic.deleted_time": { $exists: false } } },
        { $lookup: { from: "images", localField: "image_topic.image", foreignField: "_id", as: "image" } },
        { $unwind: "$image" },
        { $skip: Number(skip) || 0 },
        { $limit: Number(limit) || 30 },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            slug: { $first: "$slug" },
            created_time: { $first: "$created_time" },
            updated_time: { $first: "$updated_time" },
            images: { $push: "$image" },
          },
        },
      ]);
      let topic = await topicModel.findOne({ slug: "co-so-vat-chat" });
      let count = await imageTopicModel.count({ deleted_time: { $exists: false }, topic: { $ne: topic?._id } });
      let rs = { success: true, list: response, total: count, totalPage: count % limit == 0 ? count / limit : Math.floor(count / limit) + 1 }
      cache.set(`URI-images-${page}-${limit}`, JSON.stringify(rs))
      const stats = cache.getStats();
      console.log(stats, cache.keys());
      return res.send(rs);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { topicId, imagesId } = req.body;
      let response = await imageTopicModel.updateMany({ topic: topicId, image: { $in: imagesId } }, { $set: { deleted_time: Date.now() } });
      cache.del(cache.keys())
      return res.send({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = ImageController;
