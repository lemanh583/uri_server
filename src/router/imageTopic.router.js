const express = require("express");
const route = express.Router();
const ImageController = require("../controller/imageTopic.controller");
const { auth } = require("../middleware/auth.middleware")

route
  .post("/list", ImageController.list)
  .post("/list-v1", ImageController.listWithTopic)
  .post("/delete", auth, ImageController.delete)
    

module.exports = route;
