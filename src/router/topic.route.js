const express = require("express");
const route = express.Router();
const topicController = require("../controller/topic.controller");
const { auth } = require("../middleware/auth.middleware")

route
  .post("/list", topicController.list)
  .post("/list-image-topic", topicController.listImageTopic)
  .post("/update/:id", topicController.update)
  .get("/get/:id", topicController.get)
  .delete("/delete/:id", auth, topicController.delete)
  .post("/create", auth, topicController.create)
    

module.exports = route;
