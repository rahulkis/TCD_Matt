const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../../utils/errorResponse");

const partnerSchema = new mongoose.Schema({
  full_name: {
    type: String,
    trim: true,
    maxlength: [30, "First name can not be more than 30 character"],
  },
  email: {
    type: String,
    trim: true,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,64})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password should contain atleast 8 characters"],
  },
  partner_type: {
    type: Number,
    default: 1, // 1 => Partner Admin, 2 => Partner
  },
  partner_admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
  profile_image: {
    type: String,
    default: "",
  },
  contact_no: {
    type: String,
    default: "",
    match: [
      /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/,
      "Contact no format must be of (xxx) xxx-xxxx",
    ],
  },
  city: {
    type: String,
    default: "",
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
  },
  zipcode: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  company_name: {
    type: String,
  },
  company_email: {
    type: String,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,64})+$/,
      "Please add a valid email",
    ],
  },
  company_phone: {
    type: String,
    default: "",
    // match: [
    //   /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/,
    //   "Contact no format must be of (xxx) xxx-xxxx",
    // ],
  },
  company_email_invoice: {
    type: String,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,64})+$/,
      "Please add a valid email",
    ],
  },
  company_address: {
    type: String,
    default: "",
  },
  company_state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
  },
  company_zipcode: {
    type: String,
    default: "",
  },
  company_country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
  },
  // latitude:{
  //     type:String,
  //     default:''
  // },
  // longitude:{
  //     type:String,
  //     default:''
  // },
  gender: {
    type: String,
    enum: ["", "Male", "Female", "Others", "Rather not say"],
  },
  dob: {
    type: Date,
  },
  // cannabis_consumption:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:'ConsumptionFrequency'
  // },
  // physique:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref: 'Physique'
  // },
  // activity_level:{
  //     type:String,
  //     default:'',
  //     enum:['','Not active','Slightly Active','Somewhat active','Quite active','Very active']
  // },
  // height:{
  //     type:String,
  //     default:''
  // },
  // height_scale:{
  //     type:String,
  //     default:'',
  //     enum:['','cm','ft']
  // },
  // weight:{
  //     type:String,
  //     default:''
  // },
  // weight_scale:{
  //     type:String,
  //     default:'',
  //     enum:['','kg','lb']
  // },
  // symptoms:[{
  //     symptom_id:{
  //         type:mongoose.Schema.Types.ObjectId,
  //         ref: 'Symptom'
  //     }
  // }],
  // effects:[{
  //     effect_id:{
  //         type:mongoose.Schema.Types.ObjectId,
  //         ref: 'Effect'
  //     }
  // }],
  // activities:[{
  //     activity_id:{
  //         type:mongoose.Schema.Types.ObjectId,
  //         ref: 'Activity'
  //     }
  // }],
  // conditions:[{
  //     condition_id:{
  //         type:mongoose.Schema.Types.ObjectId,
  //         ref: 'Condition'
  //     }
  // }],
  // favourite_strains:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref: 'Strain'
  // },
  // cannabinoids:[{
  //     /// Cannanis Consumption Type
  //     cannabinoid_id:{
  //         type:mongoose.Schema.Types.ObjectId,
  //         ref: 'Cannabinoid'
  //     }
  // }],
  // consumption_reason:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref: 'ConsumptionReason'
  // },
  reset_password_otp: {
    type: String,
    default: "",
  },
  reset_password_attempted: {
    type: Number,
    default: 0,
  },
  reset_password_attempted_on: {
    type: Date,
  },
  website: {
    type: String,
    default: "",
    match: [
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    ],
  },
  account_verification_code: {
    type: String,
    default: "",
  },
  account_verification_attempted: {
    type: Number,
    default: 0,
  },
  account_verification_attempted_on: {
    type: Date,
  },
  login_otp_code: {
    type: String,
    default: "",
  },
  login_otp_expiry_on: {
    type: Date,
  },
  token: {
    type: String,
  },
  //   device_type: {
  //     type: Number,
  //     default: 0,
  //   },
  //   device_push_key: {
  //     type: String,
  //     default: "",
  //   },
  //   device_ids: [
  //     {
  //       device_id: {
  //         type: String,
  //         default: "",
  //       },
  //     },
  //   ],
  //   show_tutorial_flag: {
  //     type: Number,
  //     default: 2,
  //   },
  //   get_tcd_update: {
  //     type: Number,
  //     default: 2, //1 for on
  //   },
  twoFA_is_on: {
    type: Number,
    default: 2, //1 for on
  },
  twoFA_verification_code: {
    type: String,
    default: "",
  },

  // post_consumption_reminder_is_on:{
  //     type:Number,
  //     default:2 //1 for on
  // },
  // post_consumption_reminder_interval:{
  //     type:Number,
  //     default:0 // in minutes
  // },
  // last_reminder_sent_at:{
  //     type:Date,
  //     default: ''
  // },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  is_active: {
    type: Number,
    default: 1, // 1=active,0=blocked,2=email not verified, 3=suspended by admin,4=deactivated by user
  },
  is_deactivated: {
    type: Number,
    default: 0,
  },
  is_deleted: {
    type: Number,
    default: 0,
  },
  deleted_at: {
    type: Date,
    default: "",
  },
  deactivated_at: {
    type: Date,
    default: "",
  },
});

partnerSchema.methods.toJSON = function () {
  const partner = this;
  const partnerObject = partner.toObject();
  delete partnerObject.password;
  delete partnerObject.token;
  delete partnerObject.created_at;
  delete partnerObject.updated_at;
  delete partnerObject.__v;
  return partnerObject;
};

partnerSchema.methods.generateAuthToken = async function () {
  const partner = this;
  const token = jwt.sign(
    { _id: partner._id.toString() },
    process.env.JWT_SECRET
  );
  //user.tokens = user.tokens.concat({token})
  partner.token = token;
  await partner.save();
  return token;
};

partnerSchema.statics.checkOldPassword = async (partnerId, oldPassword) => {
  const partner = await Partner.findOne({ _id: partnerId });
  if (!partner) {
    throw new ErrorResponse("partner does not exist", 200);
  }
  const isMatchpass = await bcrypt.compare(oldPassword, partner.password);
  if (!isMatchpass) {
    throw new ErrorResponse("Invalid Old Password", 200);
  }
  return partner;
};

partnerSchema.statics.findByCredentials = async (email, password) => {
  const partner = await Partner.findOne({ email, is_deleted: 0 });
  if (!partner) {
    throw new ErrorResponse("Email does not exist", 200);
  }
  // if (partner.partner_type == 2) {
  //   throw new ErrorResponse(
  //     "Partner Admin credentials can not be used for partner login",
  //     200
  //   );
  // }
  const isMatch = await bcrypt.compare(password, partner.password);
  if (!isMatch) {
    throw new ErrorResponse("Invalid login credentials", 200);
  }

  return partner;
};

partnerSchema.pre("save", async function (next) {
  const partner = this;
  if (partner.isModified("password")) {
    partner.password = await bcrypt.hash(partner.password, 8);
  }
  next();
});

const Partner = mongoose.model("Partner", partnerSchema);
module.exports = Partner;
