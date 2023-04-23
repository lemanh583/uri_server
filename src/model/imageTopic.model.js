const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageTopicSchema = new Schema({
  image: { type: Schema.Types.ObjectId, ref: "images" },
  topic: { type: Schema.Types.ObjectId, ref: "topics" },
  created_time: { type: Number, default: Date.now },
  updated_time: { type: Number, default: Date.now },
  deleted_time: { type: Number }
});

const categories = mongoose.model("image-topics", imageTopicSchema);
module.exports = categories;
