const express = require("express");
const route = express.Router();
const categoryController = require("../controller/category.controller");
const { auth } = require("../middleware/auth.middleware")


route
  .get("/list", categoryController.list)
  .get("/get/:id", categoryController.get)
  .post("/update/:id", auth, categoryController.update)
  .delete("/delete/:id", auth, categoryController.delete)
  .post("/create", auth, categoryController.create)
    

module.exports = route;
