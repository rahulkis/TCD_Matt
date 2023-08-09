const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");

const publishAdsModel = new mongoose.Schema({
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
  campaign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
  },
  type: {
    type: String,
    trim: true,
  },
  headline: {
    type: String,
    trim: true,
  },
  body_copy: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  media_link: {
    type: String,
    trim: true,
  },
  placement_page: {
    type: String,
    trim: true,
  },
  package_qty: {
    type: Number,
    default: 0,
  },
  total_cost: {
    type: Number,
    default: 0,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Advertisement = mongoose.model("PublishAds", publishAdsModel);
module.exports = Advertisement;
