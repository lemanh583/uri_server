const express = require("express")
const app = express()
const { auth } = require("../middleware/auth.middleware");
const checkUpload = require("../middleware/upload.middleware");


app.use("/api/user", require("./user.router"))
app.use("/api/post", require("./post.router"))
app.use("/api/category", require("./category.router"))
app.use("/api/contact", require("./contact.router"))
app.use("/api/topic", require("./topic.route"))
app.use("/api/image", require("./image.router"))
app.use("/api/image-topic", require("./imageTopic.router"))
app.use("/api/upload", auth, checkUpload, require("./upload.router"))

module.exports = app