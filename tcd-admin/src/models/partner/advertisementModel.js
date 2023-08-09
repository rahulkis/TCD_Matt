const mongoose = require('mongoose');
const ErrorResponse = require('../../utils/errorResponse');

const advertisementModel = new mongoose.Schema({
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
  },
  campaign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
  },
  type: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  placement_page: {
    type: Array,
  },
  video_package_qty: {
    type: Number,
  },
  total_cost: {
    type: Number,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  advertisement_image:{
    type: String,
    // contentType: String
  },
  is_deleted: {
    type: Number,
    default: 0,
  },
  deleted_at: {
    type: Date,
    default: '',
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

const Advertisement = mongoose.model('Advertisement', advertisementModel);
module.exports = Advertisement;
