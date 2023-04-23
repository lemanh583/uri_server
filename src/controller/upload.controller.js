const cloudinary = require("cloudinary").v2;
const imageModel = require("../model/image.model");
// const mediaModel = require("../model/medias");
// const { google } = require("googleapis");
const fs = require("fs").promises;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

class Upload {
  static async uploadFile(req, res) {
    try {
      let files = req?.files?.file;
      console.log('files', files)
      if (!Array.isArray(files)) {
        files = [files];
      }
      let rs = [];
      await Promise.all(
        files.map(async (file) => {
          let type = Upload.checkTypeFile(file);
          if (!type) {
            Upload.removeTmp(file.tempFilePath);
            return;
          }
          let data = await Upload.uploadToCloudinary(file, type);
          rs.push(data);
        })
      );
      return res.send({ success: true, imageURL: rs[0]?.src, list: rs });
    } catch (error) {
      let files = req?.files?.file;
      if (!Array.isArray(files)) {
        files = [files];
      }
      files.map(file => Upload.removeTmp(file.tempFilePath))
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async uploadToCloudinary(file, type) {
    try {
      let params = {
        folder: "URI",
        resource_type: type,
      };
      let result = await cloudinary.uploader.upload(file.tempFilePath, params);
      await Upload.removeTmp(file.tempFilePath);
      let data = {
        public_id: result.public_id,
        src: result.secure_url,
      };
      const img = await imageModel.create(data);
      data.img = img;
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static checkTypeFile(file) {
    if (/image\/.*/i.test(file.mimetype)) {
      return "image";
    }
    if (/video\/mp4/i.test(file.mimetype)) {
      return "video";
    }
    return "";
  }

  static async destroy(public_id) {
    try {
      let result = await cloudinary.uploader.destroy(public_id, async (error) => {
        if (error) throw error;
      });
      if (result.result != "ok") return false;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async removeTmp(path) {
    try {
      console.log("path", path);
      await fs.unlink(path);
    } catch (error) {
      return false;
    }
  }

  static checkFile(file) {
    if (file.size > 5 * 1024 * 1024) {
      return false;
    }
    if (/image\/.*/i.test(file.mimetype)) {
      return "image";
    }
    if (/video\/mp4/i.test(file.mimetype)) {
      return "video";
    }
    if (/application\/.*/i.test(file.mimetype) && file.mimetype != "application/x-msdownload") {
      return "file";
    }
    if (/audio\/mp3|audio\/mpe/i.test(type)) {
      return "audio";
    }
    return false;
  }
}

module.exports = Upload;
