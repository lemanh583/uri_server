const express = require("express");
const route = express.Router();
const uploadController = require("../controller/upload.controller");


route
  .post("/", uploadController.uploadFile)
    

module.exports = route;
