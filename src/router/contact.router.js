const express = require("express");
const route = express.Router();
const contactController = require("../controller/contact.controller");
const { auth } = require("../middleware/auth.middleware")

route
  .post("/list", auth, contactController.list)
  .get("/get/:id", auth, contactController.get)
  .post("/update/:id", auth, contactController.update)
  .delete("/delete/:id", auth, contactController.delete)
  .post("/create", contactController.create)
    

module.exports = route;
