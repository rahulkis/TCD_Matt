const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");

const campaignModel = new mongoose.Schema({
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
  campaign_name: {
    type: String,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_deleted: {
    type: Number,
    default: 0,
  },
  deleted_at: {
    type: Date,
    default: "",
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

const Campaign = mongoose.model("Campaign", campaignModel);
module.exports = Campaign;
