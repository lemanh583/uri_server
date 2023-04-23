const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  name: { type: String, required: true },
  descriptions: String,
  slug: String,
//   images: [{ type: Schema.Types.ObjectId, ref: "images" }],
  created_time: { type: Number, default: Date.now },
  updated_time: { type: Number, default: Date.now },
  deleted_time: { type: Number },
});

const topics = mongoose.model("topics", topicSchema);
module.exports = topics;
