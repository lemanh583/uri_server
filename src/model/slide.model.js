const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slideSchema = new Schema({
  title: { type: String},
  descriptions: String,
  link: String,
  images: { type: Schema.Types.ObjectId, ref: "images" },
  url_image: {type: String},
  created_time: { type: Number, default: Date.now },
  updated_time: { type: Number, default: Date.now },
  deleted_time: { type: Number },
});

const slides = mongoose.model("slides", slideSchema);
module.exports = slides;
