const express = require("express");
const route = express.Router();
const postController = require("../controller/post.controller");
const { auth } = require("../middleware/auth.middleware")


route
  .post("/list", postController.list)
  .get("/get/:slug", postController.get)
  .post("/update/:id", auth, postController.update)
  .delete("/delete/:id", auth, postController.delete)
  .post("/create", auth, postController.create)
    

module.exports = route;
