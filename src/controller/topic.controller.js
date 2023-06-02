const schema = require("../validate/category.schema");
const topicModel = require("../model/topic.model");
const imageTopicModel = require("../model/imageTopic.model");
const Helper = require("../utils/helper");
const cache = require("../utils/cache");

class TopicController {
  static async create(req, res) {
    try {
      const data = req.body;
      await schema.validateAsync(data);
      data.slug = Helper.removeAccents(data.name, false);
      let find = await topicModel.findOne({ slug: data.slug });
      if (find) {
        return res.status(500).send({ success: false, message: "topic exists" });
      }
      let response = await topicModel.create(data);
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
      let response = await topicModel
        .find(condition)
        .sort(sort || { created_time: -1 })
        .skip(Number(skip))
        .limit(Number(limit));
      let count = await topicModel.count();
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
      let response = await topicModel.findOne({ _id: id });
      return res.send({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async listImageTopic(req, res) {
    try {
      const { topicId, page, limit } = req.body;
      if (!topicId) {
        return res.status(500).send({ success: false, message: "no id" });
      }
      let topic = await topicModel.findOne({ _id: topicId });
      if (!topic) {
        return res.status(500).send({ success: false, message: "no topic" });
      }
      let skip = (page - 1) * limit;
      let response = await imageTopicModel
        .find({ topic: topicId, deleted_time: { $exists: false } })
        .populate("image")
        .sort({ created_time: -1 })
        .skip(skip)
        .limit(limit);
      let count = await imageTopicModel.count({ topic: topicId, deleted_time: { $exists: false } });
      return res.send({ success: true, list: response, total: count, totalPage: count % limit == 0 ? count / limit : Math.floor(count / limit) + 1 });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      let response = await topicModel.findOneAndUpdate({ _id: id }, { deleted_time: Date.now() });
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
      let find = await topicModel.findOne({ slug: data.slug });
      if (find) {
        return res.status(500).send({ success: false, message: "category exists" });
      }
      if (data?.images?.length) {
        await Promise.all(
          data.images.map(async (item) => {
            await imageTopicModel.create({ topic: id, image: item });
          })
        );
      }
      if (data.name) {
        data.slug = Helper.removeAccents(data.name, false);
        let response = await topicModel.findOneAndUpdate({ _id: id }, data, { new: true });
      }
      cache.del(cache.keys())
      return res.send({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = TopicController;
