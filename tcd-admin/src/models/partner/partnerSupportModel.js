const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");

const partnerSupportModel = new mongoose.Schema({
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
  subject: {
    type: String,
    trim: true
  },
  topic: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
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

const PartnerSupport = mongoose.model("PartnerSupport", partnerSupportModel);
module.exports = PartnerSupport;
