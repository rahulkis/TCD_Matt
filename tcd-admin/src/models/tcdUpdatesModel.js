const mongoose = require("mongoose");

const tcdUpdatesSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please add description"],
  },
  category: {
    type: String,
    trim: true,
    // required: [true, "Please add description"],
  },
  is_published: {
    type: Boolean,
    default: false,
  },
  published_at: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
const tcdUpdates = new mongoose.model("TCDUpdate", tcdUpdatesSchema);
module.exports = tcdUpdates;
