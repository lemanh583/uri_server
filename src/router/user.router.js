const express = require("express");
const route = express.Router();
const userController = require("../controller/user.controller");


route
  .post("/list", userController.list)
  .get("/get", userController.get)
  .post("/update", userController.update)
  .delete("/delete/:id", userController.delete)
  .post("/create", userController.create)
  .post("/login", userController.login)
    

module.exports = route;
