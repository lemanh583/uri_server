const Helper = require("../utils/helper");
const postModel = require("../model/post.model");
const userModel = require("../model/user.model");
const categoryModel = require("../model/category.model");
const schema = require("../validate/post.schema");
const Upload = require("../controller/upload.controller");
const ObjectId = require("mongodb").ObjectId;

class PostController {
  static async create(req, res) {
    try {
      const data = req.body;
      await schema.validateAsync(data);
      const uid = req.user_id;
      const file = req?.files?.file;
      if(!Array.isArray(data.category)) {
        data.category = [data.category]
      }
      const find = await userModel.findById(uid);
      if (!find) return res.status(400).send({ success: false, message: "Not find user" });
      data.author = uid;
      const slug = Helper.removeAccents(data.title, true);
      data.slug = slug;
      if (file) {
        const rs = await Upload.uploadToCloudinary(file, "image");
        data.image = rs.img._id;
        data.url_image = rs.img.src;
      }
      const result = await postModel.create(data);
      return res.send({ success: true, data: result });
    } catch (error) {
      console.error(error);
      Upload.removeTmp(req?.files?.file?.tempFilePath);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      const { filter, search, sort, page, limit } = req.body;
      let condition = { deleted_time: { $exists: false } };
      PostController.mapFilter(condition, search, filter);

      let skip = (page - 1) * limit;

      const result = await postModel
        .find(condition)
        .populate({ path: "category", select: "name" })
        .populate({ path: "author", select: "name" })
        .populate({ path: "image", select: "src" })
        .sort(sort || { created_time: -1 })
        .skip(Number(skip) || 0)
        .limit(Number(limit) || 20);
      const count = await postModel.countDocuments(condition);
      return res.send({ success: true, list: result, total: count, totalPage: count % limit == 0 ? count / limit : Math.floor(count / limit) + 1 });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async get(req, res) {
    try {
      const slug = req.params.slug;
      let condition = { $or: [ { slug: slug } ] }
      if(ObjectId.isValid(slug)) {
        condition.$or.push( { _id: slug })
      }
      const post = await postModel
        .findOne({ ...condition , deleted_time: { $exists: false } })
        .populate({ path: "category", select: "name slug" })
        .populate({ path: "author", select: "name username email" })
        .populate({ path: "image", select: "src" });
      if (!post) return res.status(400).send({ success: false, message: "Not find post!" });
      return res.send({ success: true, data: post });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      if (!id) return res.status(500).send({ success: false, message: "no id" });
      let rs = await postModel.findByIdAndUpdate(id, { deleted_time: Date.now() });
      if (!rs) return res.status(500).send({ success: false, message: "no post" });
      return res.send({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const data = req.body;
      const id = req.params.id;
      const file = req?.files?.file;
      if (!id) return res.status(500).send({ success: false, message: "Not id" });
      if (file) {
        const rs = await Upload.uploadToCloudinary(file, "image");
        data.image = rs.img._id;
        data.url_image = rs.img.src;
      }
      if(!Array.isArray(data.category)) {
        data.category = [data.category]
      }
      const slug = Helper.removeAccents(data.title, true);
      data.slug = slug;
      const post = await postModel.findByIdAndUpdate(id, data, { new: true });
      if (!post) return res.status(500).send({ success: false, message: "Not find post" });
      return res.send({ success: true, data: post });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async mapFilter(condition, search, filter) {
    if (search) {
      const searchRegex = new RegExp(`.*${search}.*`, "i");
      condition["$or"] = [{ title: searchRegex }, { descriptions: searchRegex }];
    }
    if (!filter) return condition;
    if (filter.category) {
      condition.category = filter.category;
    }
    if(filter.slug_category) {
      let category = await categoryModel.findOne({slug: slug_category})
      condition.category = category._id
    }

    // if (filter.category) {
    //   condition.category = filter.category;
    // }
    // if (filter.approved) {
    //   condition.approved = filter.approved;
    // }
    // if (filter.author) {
    //   condition.author = filter.author;
    // }
    return condition;
  }
}

module.exports = PostController;
