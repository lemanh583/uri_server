const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  public_id: { type: String, required: true },
  src: { type: String, required: true },
  descriptions: {type: String },
  post_id: { type: String, required: false},
  created_time: { type: Number, default: Date.now },
  updated_time: { type: Number, default: Date.now },
});

const images = mongoose.model("images", imageSchema);
module.exports = images;
