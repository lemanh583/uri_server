const express = require("express");
const route = express.Router();
const ImageController = require("../controller/image.controller");
const { auth } = require("../middleware/auth.middleware")

route
  .post("/list", auth, ImageController.list)
  .delete("/delete/:id", auth, ImageController.delete)
    

module.exports = route;
