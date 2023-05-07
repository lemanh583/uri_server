const express = require("express");
const route = express.Router();
const slideController = require("../controller/slide.controller");
const { auth } = require("../middleware/auth.middleware")

route
  .get("/list", slideController.list)
  .post("/update/:id", auth, slideController.update)
//   .get("/get/:id", slideController.get)
  .delete("/delete/:id", auth, slideController.delete)
  .post("/create", auth, slideController.create)
    

module.exports = route;
