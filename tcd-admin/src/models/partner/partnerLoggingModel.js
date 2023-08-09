const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");

const partnerLoggingSchema = new mongoose.Schema({
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
  partner_token: {
    type: String,
  },
  is_deleted: {
    type: Number,
    default: 0,
  },
  is_logout: {
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

const PartnerLogging = mongoose.model("PartnerLogging", partnerLoggingSchema);
module.exports = PartnerLogging;
