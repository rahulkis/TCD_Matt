const path = require("path");
const randomstring = require("randomstring");
const asyncHandler = require("../middleware/async");
const moment = require("moment");
const CommonHelper = require("../utils/commonHelper");
const NotifyHelper = require("../utils/notifyHelper");
const Partner = require("../models/partner/partnerModel");
const PartnerLogging = require("../models/partner/partnerLoggingModel");
const Diary = require("../models/userDiaryModel");
const Users = require("../models/usersModel");
const Product = require("../models/productModel");
const Country = require("../models/countryModel");
const State = require("../models/stateModel");
const PartnerSupport = require("../models/partner/partnerSupportModel");
const Campaigns = require("../models/partner/campaignModel");
const ProductType = require("../models/productTypeModel");
const TCDUpdates = require("../models/tcdUpdatesModel");
const COA = require("../models/coaModel");
const Effects = require("../models/effectModel");
const Symptoms = require("../models/symptomModel");
const Activities = require("../models/activityModel");
const User = require("../models/usersModel");
const Conditions = require("../models/conditionModel");
const Strains = require("../models/strainsModel");
const States = require("../models/stateModel");
const ConsumptionReason = require("../models/consumptionReasonModel");
const Advertisement = require("../models/partner/advertisementModel");
const {
  partnerSupportEmail,
  sendPartnerForgotPasswordEmail,
  sendForgotPasswordEmail,
} = require("../utils/mailHelper");
var ObjectId = require("mongodb").ObjectId;
const _ = require("lodash");
const publicUploadDir = path.resolve(__dirname, "../../public/uploads/");
const { s3Upload, s3Remove, awsTextTract } = require("../utils/AWS");

//@desc login
//route POST /api/partner-login
//@access Public
exports.partnerLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return res.send({ success: false, message: "Please provide email" });
  }
  if (!password) {
    return res.send({ success: false, message: "Please provide password" });
  }
  const partner = await Partner.findByCredentials(
    email.toLowerCase().trim(),
    password
  );
  let isDeactivated = false;
  if (partner.is_active == 4) {
    isDeactivated = true;
    const deactivatedOn = CommonHelper.formatedDate(partner.deactivated_at, 7);
    return res.send({
      success: true,
      data: { is_deactivated: isDeactivated, deactivated_on: deactivatedOn },
      message: `You have deactivated your account on ${deactivatedOn} . To use the Partner Portal, you will need to activate your account again.`,
    });
  }
  if (partner.is_active == 0) {
    return res.send({
      success: false,
      data: { is_deactivated: isDeactivated },
      message: "Your account has blocked by administrator",
    });
  }
  if (partner.is_active == 3) {
    return res.send({
      success: true,
      data: { is_deactivated: isDeactivated, is_active: partner.is_active },
      message: "Please verify your email",
    });
  }
  const token = await partner.generateAuthToken();
  if (token) {
    const partnerDetail = new PartnerLogging({
      partner_id: partner._id,
      partner_token: token,
    });
    await partnerDetail.save();
  }
  /** 2FA*/
  if (partner.twoFA_is_on == 1) {
    const OTP = await randomstring.generate({
      length: 6,
      charset: "alphanumeric",
      capitalization: "uppercase",
    });
    let emailData = {
      email: partner.email,
      name: partner.full_name,
      code: OTP,
    };
    twoFactorMail(emailData);

    if (partner.contact_no) {
      var contactNO = partner.contact_no.replace(/[()\-]/g, "");
      var contact_no = contactNO.replace(/ /g, "");
      //SMSHelper.sendSMS(contact_no)
    }
    partner.twoFA_verification_code = OTP;
  }

  /** 2FA*/
  await partner.save();

  let partnerInfo = await Partner.findById(partner._id)
    .populate({
      path: "state",
      select: { name: 1 },
      populate: { path: "country", select: { name: 1 } },
    })
    .select({
      email: 1,
      full_name: 1,
      profile_image: 1,
      contact_no: 1,
      user_type: 1,
      gender: 1,
      dob: 1,
      city: 1,
      state: 1,
      country: 1,
      address: 1,
      zipcode: 1,
      is_active: 1,
      twoFA_is_on: 1,
    });

  res.send({
    success: true,
    message: "You have logged in successfully",
    data: {
      partnerInfo,
      token,
      is_deactivated: isDeactivated,
    },
  });
});

//@desc signup
//route POST /api/partner-signup
//@access Private
exports.partnerSignup = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    const partnerCheckEmail = await Partner.findOne({ email, is_deleted: 0 });
    if (!partnerCheckEmail) {
      await Partner.create({ full_name: name, email, password })
        .then((response) => {
          if (response) {
            res.send({
              success: true,
              message: "Partner Registered Successfully",
              data: response,
            });
          }
        })
        .catch((err) => {
          res.send({
            success: false,
            message: err.response.message,
          });
        });
    } else
      res.send({
        success: false,
        message: "Email already taken",
      });
  } catch (err) {
    res.send({
      success: false,
      message: err.response.message,
    });
  }
});

//@desc getPartnerEntries
//route GET /api/get-entries
//@access Private
exports.getPartnerEntries = asyncHandler(async (req, res, next) => {
  const { page, perPageRecord, from, to } = req.query;
  const pageRecordLimit = parseInt(perPageRecord);
  const skip = (parseInt(page) - 1) * pageRecordLimit;
  let findCond = {
    $and: [
      { is_active: 1 },
      { is_deleted: 0 },
      {
        created_at: {
          $gte: moment(from).format(),
          $lt: moment(to).format(),
        },
      },
    ],
  };

  const entriesTotalCount = await Diary.countDocuments(findCond);
  const entries = await Diary.find(findCond)
    .limit(pageRecordLimit)
    .skip(skip)
    .populate({
      path: "user",
      select: { full_name: 1, gender: 1, dob: 1 },
      populate: { path: "consumption_reason", select: { name: 1 } },
    })
    .populate({
      path: "product",
      select: { name: 1, COA_identifier: 1 },
      populate: { path: "product_type", select: { name: 1 } },
    })
    .populate({
      path: "user_comments",
      // select: { name: 1, COA_identifier: 1 },
      // populate: { path: "product_type", select: { name: 1 } },
    })
    .sort({ created_at: -1 });
  let pushEntries = [];
  for (let entry of entries) {
    const coaData = await COA.findOne({
      coa_no: entry.product.COA_identifier,
    }).select("batch_id");
    const objEntries = {
      userId: entry.user._id ? entry.user._id : "",
      entry_id: entry._id ? entry._id : "",
      userName: entry.user.full_name ? entry.user.full_name : "",
      product: entry.product.name ? entry.product.name : "",
      product_type: entry.product.product_type
        ? entry.product.product_type.name
        : "",
      consuption_reason:
        entry.user.consumption_reason && entry.user.consumption_reason.name
          ? entry.user.consumption_reason.name
          : "",
      average_rating: entry.average_ratings ? entry.average_ratings : "",
      isLikeDislike: entry.is_favourite,
      batchId: coaData ? coaData.batch_id : "-",
      createdAt: entry.created_at,
      sex: entry.user.gender ? entry.user.gender : "",
      dob: entry.user.dob ? entry.user.dob : "-",
      producer_name: coaData ? coaData.producer_name : "-",
      distributor_name: coaData ? coaData.distributor_name : "-",
      tested_at: coaData ? coaData.tested_at : "",
      reviews: "",
      negatives: "",
      location: "",
      time: "",
      setting: "",
    };
    pushEntries.push(objEntries);
  }
  res.send({
    success: true,
    message: "Your entry list",
    data: { entries: pushEntries, totalEntries: entriesTotalCount },
  });
});

//@desc getHomeData
//route GET /api//home-data
//@access Private
//total-enteries
exports.getHomeData = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const totalEntries = await Diary.countDocuments({
      is_active: 1,
      is_deleted: 0,
    });
    const totalProducts = await Product.countDocuments({ is_deleted: 0 });
    const uniqueUsers = await Partner.countDocuments({ partner_type: 2 });
    const objList = {
      totalEntries,
      totalProducts,
      uniqueUsers,
    };
    res.send({
      success: true,
      message: "Home data",
      data: objList,
    });
  } catch (err) {
    res.send({
      status: false,
      message: err.message,
    });
  }
});

//@desc getPartnerEntriesFilter
//route GET /api/get-entries-filter
//@access Private
exports.getPartnerEntriesFilter = asyncHandler(async (req, res, next) => {
  const { page, perPageRecord } = req.query;
  const pageRecordLimit = parseInt(perPageRecord);
  const skip = (parseInt(page) - 1) * pageRecordLimit;
  let searchByValue = req.query.searchValue
    ? req.query.searchValue.toLowerCase()
    : "";
  var query = [
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $match: {
        $and: [
          { is_active: 1 },
          { is_deleted: 0 },
          { "product.name": { $regex: "^" + searchByValue, $options: "i" } },
        ],
      },
    },
  ];
  const entriesTotalCount = await Product.countDocuments(query);
  const entries = await Diary.aggregate(query)
    .limit(pageRecordLimit)
    .skip(skip);
  let pushEntries = [];
  for (let entry of entries) {
    let findProductType = await ProductType.findById(
      entry.product[0].product_type
    ).select("name");
    const batchId = await COA.findOne({ coa_no: entry.product.COA_identifier });
    const objEntries = {
      userId: entry.user[0]._id ? entry.user[0]._id : "",
      entry_id: entry._id ? entry._id : "",
      userName: entry.user[0].full_name ? entry.user[0].full_name : "",
      product: entry.product[0].name ? entry.product[0].name : "",
      product_type: findProductType ? findProductType.name : "",
      average_rating: entry.average_ratings ? entry.average_ratings : "",
      isLikeDislike: entry.is_favourite,
      batchId,
      createdAt: entry.created_at,
      sex: entry.user[0].gender ? entry.user[0].gender : "",
      reviews: "",
      negatives: "",
      location: "",
      time: "",
      setting: "",
    };
    pushEntries.push(objEntries);
  }
  res.send({
    success: true,
    message: "Your entry list",
    data: { entries: pushEntries, totalEntries: entriesTotalCount },
  });
});

//@desc getPartnerProducts
//route GET /api/get-products
//@access Private
exports.getPartnerProducts = asyncHandler(async (req, res, next) => {
  const { page, perPageRecord } = req.query;
  const pageRecordLimit = parseInt(perPageRecord);
  const skip = (parseInt(page) - 1) * pageRecordLimit;
  let findCond = {
    $and: [{ is_deleted: 0, is_active: 1 }],
  };

  const entriesTotalCount = await Product.countDocuments(findCond);
  const products = await Product.find(findCond)
    .limit(pageRecordLimit)
    .skip(skip)
    .populate({
      path: "product_type",
      select: { name: 1 },
    });

  let pushProducts = [];
  for (let product of products) {
    let findCountCond = {
      $and: [
        { pre_activities: { $exists: true, $ne: null }, product: product._id },
      ],
    };
    const coaData = await COA.findOne({
      coa_no: product.COA_identifier,
    }).select("batch_id");
    const entries = await Diary.find({ product: product._id }).select(
      "average_ratings"
    );
    var x = 0;
    var average_ratings = 0;
    for (let entry of entries) {
      x++;
      average_ratings += parseInt(entry.average_ratings);
    }
    average_ratings = average_ratings / x;
    const totalEntriesCount = await Diary.countDocuments({
      product: product._id,
    });
    const totalObjective = await Diary.countDocuments(findCountCond);
    const objProduct = {
      productId: product._id,
      productName: product.name ? product.name : "",
      batchId: coaData ? coaData.batch_id : "-",
      totalObjective: totalObjective,
      totalEntriesCount: totalEntriesCount,
      rating: average_ratings ? average_ratings : 0,
      product_type:
        product && product.product_type ? product.product_type.name : "",
    };
    pushProducts.push(objProduct);
  }
  pushProducts.sort((a, b) => b.totalEntriesCount - a.totalEntriesCount);
  res.send({
    success: true,
    message: "Your product list",
    data: { products: pushProducts, totalEntries: entriesTotalCount },
  });
});

//@desc getPartnerProductTypes
//route GET /api/get-product-Types
//@access Private
exports.getPartnerProductTypes = asyncHandler(async (req, res, next) => {
  let findCond = {
    $and: [
      {
        is_deleted: 0,
        name: [
          "Flower",
          "Edibles",
          "Drinks",
          "Vapes",
          "Shatter / Resin",
          "Tinctures",
        ],
      },
    ],
  };

  const productTypes = await ProductType.find(findCond).select("name _id");
  res.send({
    success: true,
    message: "Your product types list",
    data: { productTypes },
  });
});

//@desc getPartnerProductFilter
//route POST get-product-filter-data/:id
//@access Private
exports.getPartnerProductFilter = asyncHandler(async (req, res, next) => {
  const { page, perPageRecord } = req.query;
  const pageRecordLimit = parseInt(perPageRecord);
  const skip = (parseInt(page) - 1) * pageRecordLimit;
  let searchByValue = req.query.searchValue
    ? req.query.searchValue.toLowerCase()
    : "";
  let searchById = req.query.id ? req.query.id : "";
  let findCond = {
    is_deleted: 0,
  };
  if (searchById) {
    findCond = {
      is_deleted: 0,
      product_type: searchById.toString(),
    };
  }
  if (searchByValue) {
    findCond = {
      is_deleted: 0,
      name: { $regex: "^" + searchByValue, $options: "i" },
    };
  }
  if (searchByValue && searchById) {
    findCond = {
      is_deleted: 0,
      product_type: searchById.toString(),
      name: { $regex: "^" + searchByValue, $options: "i" },
    };
  }
  const entriesTotalCount = await Product.countDocuments(findCond);
  const products = await Product.find(findCond)
    .limit(pageRecordLimit)
    .skip(skip)
    .populate({
      path: "product_type",
      select: { name: 1 },
    });
  let pushProducts = [];
  for (let product of products) {
    const coaData = await COA.findOne({
      coa_no: product.COA_identifier,
    }).select("batch_id");
    const objProduct = {
      productId: product._id,
      productName: product.name ? product.name : "",
      batchId: coaData ? coaData.batch_id : "-",
      product_type:
        product && product.product_type ? product.product_type.name : "",
    };
    pushProducts.push(objProduct);
  }
  res.send({
    success: true,
    message: "Your product list",
    data: { products: pushProducts, totalEntries: entriesTotalCount },
  });
});

//@desc partnerSupport
//route POST partner-support
//@access Private
exports.partnerSupport = asyncHandler(async (req, res, next) => {
  try {
    const { subject, topic, message, name, _id } = req.body;
    // const { name, _id } = req.user;
    await PartnerSupport.create({ partner_id: _id, subject, topic, message })
      .then((response) => {
        if (response) {
          res.send({
            success: true, //@desc partnerUpdateSetting
            //route POST update-setting-detail
            //@access Private
            message: "Our support will contact you shortly",
          });
          const emailData = {
            name,
            subject,
            topic,
            message,
          };
          partnerSupportEmail(emailData);
        }
      })
      .catch((err) => {
        res.send({
          success: false,
          message: err.response.message,
        });
      });
  } catch (err) {
    res.send({
      success: false,
      message: err.response.message,
    });
  }
});
//@desc partnerGetSetting
//route GET get-setting-detail
//@access Private
exports.partnerGetSetting = asyncHandler(async (req, res, next) => {
  const partnerDetail = await Partner.find({ _id: req.query.id });
  let country = await Country.find({ is_deleted: 0 })
    .sort({ name: 1 })
    .select({ name: 1 });
  let states = await State.find({ is_deleted: 0 })
    .sort({ name: 1 })
    .select({ name: 1 });
  res.send({
    success: true,
    message: "Partner detail",
    data: partnerDetail,
    country: country,
    states: states,
  });
});
//@desc partnerUpdateSetting
//route POST update-setting-detail
//@access Private
exports.partnerUpdateSetting = asyncHandler(async (req, res, next) => {
  try {
    const {
      full_name,
      email,
      password,
      company_name,
      company_email,
      company_phone,
      company_email_invoice,
      company_address,
      company_zipcode,
      company_state,
      company_country,
    } = req.body;
    let partnerDetail = await Partner.findOne({ _id: req.query.id });
    partnerDetail.full_name = full_name;
    partnerDetail.email = email;
    if (password) {
      partnerDetail.password = password;
    }
    partnerDetail.company_name = company_name;
    partnerDetail.company_email = company_email;
    partnerDetail.company_phone = company_phone;
    partnerDetail.company_email_invoice = company_email_invoice;
    partnerDetail.company_address = company_address;
    partnerDetail.company_zipcode = company_zipcode;
    partnerDetail.company_state = company_state;
    partnerDetail.company_country = company_country;
    await partnerDetail.save();
    res.send({
      success: true,
      message: "Partner detail",
      data: partnerDetail,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err._message,
    });
  }
});
//@desc partnerAddUser
//route POST add-user
//@access Private
exports.partnerAddUser = asyncHandler(async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;
    const partnerCheckEmail = await Partner.findOne({ email, is_deleted: 0 });
    if (!partnerCheckEmail) {
      await Partner.create({ full_name, email, password, partner_type: 2 })
        .then((response) => {
          if (response) {
            res.send({
              success: true,
              message: "Partner Registered Successfully",
              data: response,
            });
          }
        })
        .catch((err) => {
          res.send({
            success: false,
            message: err.response.message,
          });
        });
    } else
      res.send({
        success: false,
        message: "Email already taken",
      });
  } catch (err) {
    res.send({
      success: false,
      message: err.response.message,
    });
  }
});
//@desc partnerGetUser
//route GET get-user-list
//@access Private
exports.partnerGetUser = asyncHandler(async (req, res, next) => {
  try {
    const getUserList = await Partner.find({ partner_type: 2 });
    res.send({
      success: true,
      message: "Partner user detail",
      getUserList: getUserList,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.response.message,
    });
  }
});
//@desc partnerDeleteUser
//route POST delete-user
//@access Private
exports.partnerDeleteUser = asyncHandler(async (req, res, next) => {
  try {
    await Partner.deleteOne({ _id: req.query.id });
    const getUserList = await Partner.find({ partner_type: 2 });
    res.send({
      success: true,
      message: "Deleted successfully",
      getUserList: getUserList,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err._message,
    });
  }
});
//@desc partnerGetEditUser
//route GET get-user
//@access Private
exports.partnerGetEditUser = asyncHandler(async (req, res, next) => {
  try {
    const getUserList = await Partner.findOne({ _id: req.query.id });
    res.send({
      success: true,
      message: "Deleted successfully",
      getUserList: getUserList,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err._message,
    });
  }
});
//@desc partnerUpdateUser
//route POST update-user
//@access Private
exports.partnerUpdateUser = asyncHandler(async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;
    let partnerDetail = await Partner.findOne({ _id: req.query.id });
    partnerDetail.full_name = full_name;
    partnerDetail.email = email;
    if (password) {
      partnerDetail.password = password;
    }
    await partnerDetail.save();
    res.send({
      success: true,
      message: "Edit Successfully",
      data: partnerDetail,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err._message,
    });
  }
});
//@desc startCampaign
//route POST start-campaign
//@access Private
exports.startCampaign = asyncHandler(async (req, res, next) => {
  try {
    const { campaign_name, _id } = req.body;
    Campaigns.create({ campaign_name, partner_id: _id })
      .then((response) => {
        if (response) {
          res.send({
            success: true,
            message: "Campaign Added Successfully",
          });
        }
      })
      .catch((err) => {
        res.send({
          success: false,
          message: err.response.message,
        });
      });
  } catch (err) {
    res.send({
      success: false,
      message: err.response.message,
    });
  }
});
//@desc getCampaigns
//route GET get-campaigns
//@access Private
exports.getCampaigns = asyncHandler(async (req, res, next) => {
  try {
    const findCond = {
      $and: [
        {
          is_deleted: 0,
          is_active: true,
          partner_id: "620cc82a3ec0520fac2b20c8",
        },
      ],
    };

    const campaigns = await Campaigns.find(findCond).select(
      "campaign_name _id"
    );

    res.send({
      success: true,
      message: "Your campaigns list",
      data: { campaigns },
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.response.message,
    });
  }
});

//@desc get Advertisement by campaignId
//route GET view-campaigns
//@access Private
exports.viewCampaign = asyncHandler(async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    // const findCond = {
    //   $and: [{ is_deleted: 0, is_active: true, _id: campaignId }],
    // };
    // const campaign = await Campaigns.find(findCond).select('campaign_name _id');
    const getAdvertisementData = await Advertisement.find({
      campaign_id: campaignId,
    }).populate({
      path: "campaign_id",
      select: { campaign_name: 1, _id: 1 },
    });
    res.send({
      success: true,
      message: "Your campaign",
      // data:campaign
      data: getAdvertisementData,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.response.message,
    });
  }
});

//@desc viewCampaigns
//route update update-campaigns
//@access Private
exports.updateCampaign = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    await Campaigns.findByIdAndUpdate(id, req.body);

    res.send({
      success: true,
      message: "Updated Successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.response.message,
    });
  }
});

//@desc getPartnerProductsInfo
//route GET /api/get-products-info
//@access Private
exports.getPartnerProductsInfo = asyncHandler(async (req, res, next) => {
  let findCond = {
    $and: [{ is_deleted: 0 }, { _id: req.query.id }],
  };
  const products = await Product.findOne(findCond).populate({
    path: "product_type",
    select: { name: 1 },
  });
  let query = {
    $and: [{ is_active: 1 }, { is_deleted: 0 }, { product: products._id }],
  };
  let pushProducts = [];
  const coaData = await COA.findOne({ coa_no: products.COA_identifier }).select(
    "batch_id producer_name tested_at distributor_name"
  );
  const entries = await Diary.find({ product: products._id }).select(
    "average_ratings"
  );
  var x = 0;
  var average_ratings = 0;
  for (let entry of entries) {
    x++;
    average_ratings += parseInt(entry.average_ratings);
  }
  average_ratings = average_ratings / x;
  const activities = await Diary.find({
    pre_activities: { $exists: true, $ne: null },
    product: products._id,
  }).select("pre_activities");
  let pushActivities = [];
  for (let active of activities) {
    for (let getCount of active.pre_activities) {
      const getActivitiesValue = await Diary.countDocuments({
        pre_activities: { $exists: true, $ne: null },
        "pre_activities.activity_id": getCount.activity_id,
      });
      pushActivities.push(getActivitiesValue);
    }
  }
  const maxActivities = Math.max(...pushActivities);
  const preCondition = await Diary.find({
    pre_condition: { $exists: true, $ne: null },
    product: products._id,
  }).select("pre_condition");
  let pushCondition = [];
  for (let condition of preCondition) {
    for (let getCount of condition.pre_condition) {
      const getConditionValue = await Diary.countDocuments({
        pre_condition: { $exists: true, $ne: null },
        "pre_condition.activity_id": getCount.activity_id,
      });
      pushCondition.push(getConditionValue);
    }
  }
  const maxCondition = Math.max(...pushCondition);
  const preEffects = await Diary.find({
    desired_effects: { $exists: true, $ne: null },
    product: products._id,
  }).select("desired_effects");
  let pushEffects = [];
  for (let effect of preEffects) {
    for (let getCount of effect.desired_effects) {
      const getEffectValue = await Diary.countDocuments({
        desired_effects: { $exists: true, $ne: null },
        "desired_effects.effect_id": getCount.effect_id,
        actual_effects: { $exists: true, $ne: null },
        "actual_effects.effect_id": getCount.effect_id,
      });
      pushEffects.push(getEffectValue);
    }
  }
  const maxEffect = Math.max(...pushEffects);

  const entrieDetail = await Diary.find(query)
    .populate({
      path: "user",
      select: { full_name: 1 },
      populate: { path: "consumption_reason", select: { name: 1 } },
    })
    .populate({
      path: "product",
      select: { name: 1, COA_identifier: 1 },
      populate: { path: "product_type", select: { name: 1 } },
    })
    .sort({ created_at: -1 });
  let pushEntries = [];
  for (let entry of entrieDetail) {
    const coaData = await COA.findOne({
      coa_no: entry.product.COA_identifier,
    }).select("batch_id");
    const objEntries = {
      userId: entry.user._id ? entry.user._id : "",
      consuption_reason:
        entry.user.consumption_reason && entry.user.consumption_reason.name
          ? entry.user.consumption_reason.name
          : "",
      average_rating: entry.average_ratings ? entry.average_ratings : "",
      batchId: coaData ? coaData.batch_id : "-",
      createdAt: entry.created_at,
    };
    pushEntries.push(objEntries);
  }

  const objProduct = {
    productId: products._id,
    productName: products.name ? products.name : "",
    productType: products.product_type ? products.product_type.name : "",
    batch_id: coaData ? coaData.batch_id : "-",
    producer_name: coaData ? coaData.producer_name : "-",
    tested_at: coaData ? coaData.tested_at : "",
    distributor_name: coaData ? coaData.distributor_name : "-",
    entries: entries,
    entrieDetail: entrieDetail ? entrieDetail : "",
  };
  pushProducts.push(objProduct);
  res.send({
    success: true,
    message: "Your product list",
    data: {
      products: pushProducts,
      entriesData: pushEntries,
      maxActivities: maxActivities,
      maxEffect: maxEffect,
      maxCondition: maxCondition,
    },
  });
});

//@desc getPartnerEntriesInfo
//route GET /api/get-entries-info
//@access Private
exports.getPartnerEntriesInfo = asyncHandler(async (req, res, next) => {
  const { entryId, userId } = req.params;
  let findCond = {
    $and: [{ is_active: 1 }, { is_deleted: 0 }, { _id: entryId }],
  };
  const totalEntries = await Diary.countDocuments({ user: userId });
  const entry = await Diary.findOne(findCond)
    .populate({
      path: "user",
      select: { full_name: 1, gender: 1, dob: 1 },
      populate: { path: "consumption_reason", select: { name: 1 } },
    })
    .populate({
      path: "product",
      select: { name: 1, COA_identifier: 1 },
      populate: { path: "product_type", select: { name: 1 } },
    })
    .populate({
      path: "user_comments",
      // select: { name: 1, COA_identifier: 1 },
      // populate: { path: "product_type", select: { name: 1 } },
    });
  // entry.product.COA_identifier = '1A4060300004E2E000091371'
  const coaData = await COA.findOne({
    coa_no: entry.product.COA_identifier,
  }).select("batch_id producer_name distributor_name tested_at");
  const entryObj = {
    userId: entry.user._id ? entry.user._id : "",
    entry_id: entry._id ? entry._id : "",
    userName: entry.user.full_name ? entry.user.full_name : "",
    product: entry.product.name ? entry.product.name : "",
    product_type: entry.product.product_type
      ? entry.product.product_type.name
      : "",
    average_rating: entry.average_ratings ? entry.average_ratings : "",
    createdAt: entry.created_at,
    gender: entry.user.gender ? entry.user.gender : "-",
    dob: entry.user.dob ? entry.user.dob : "-",
    batch_id: coaData ? coaData.batch_id : "-",
    producer_name: coaData ? coaData.producer_name : "-",
    distributor_name: coaData ? coaData.distributor_name : "-",
    tested_at: coaData ? coaData.tested_at : "",
    consumption_reason: entry.user.consumption_reason
      ? entry.user.consumption_reason.name
      : "-",
    totalEntries,
    isLikeDislike: entry.is_favourite,
    reviews: "",
    negatives: "",
    location: "",
    time: "",
    setting: "",
    is_public: entry.is_public,
    comments: entry.comments,
  };
  res.send({
    success: true,
    message: "Your entry list",
    data: { entryInfo: entryObj },
  });
});

//@desc PartnerLogout
//route GET /api/partner-logout
//@access Private
exports.partnerLogout = async (req, res, next) => {
  const { token } = req.params;
  const logout = await PartnerLogging.findOne({ partner_token: token });
  logout.is_logout = 1;
  await logout.save();
  res.send({
    success: true,
    message: "Logout Successfully",
  });
};

//@desc getAdvertisementInfo
//route GET /api/get-advertisement-info
//@access Private
exports.getAdvertisementInfo = async (req, res, next) => {
  const findCond = {
    $and: [{ is_deleted: 0, is_active: true }],
  };
  const total_ads = await Campaigns.countDocuments(findCond);
  res.send({
    success: true,
    message: "Your entry list",
    totalAds: total_ads,
  });
};
//@desc publishAds
//route POST publish-ads
//@access Private
exports.publishAds = asyncHandler(async (req, res, next) => {
  console.log({file:req.file})
  const {
    type,
    headline,
    body,
    link,
    placementPageArray,
    video_package_qty,
    total_cost,
  } = req.body;
  const { campaign_id } = req.query;
  try {
    let getImagePath;
    if (req.file) {
      // const imagePath = publicUploadDir + '/preview_image/' + req.file.filename;
      // let splitPath = imagePath.split("public\\");
      // getImagePath = splitPath[1];

      const advertisementImage = {
        file: req.file,
        type: "advertisement_image",
      };
      const response = await s3Upload(advertisementImage);
      getImagePath = response.Location;
    }
    const publishData = new Advertisement({
      type,
      headline,
      body,
      link,
      placement_page: placementPageArray.split(","),
      video_package_qty,
      total_cost,
      advertisement_image: getImagePath,
      campaign_id,
    });
    await publishData.save();
    res.send({
      success: true,
      message: "Ad saved successfully",
      data: publishData,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err._message,
    });
  }
});

//@desc get viewAdvertisement from a campaign by _id
//route GET /create-new-ad/:campaignId
//@access Private
exports.viewAdvertisement = asyncHandler(async (req, res, next) => {
  const { advertisementId } = req.params;
  try {
    const getAdvertisementData = await Advertisement.findById({
      _id: advertisementId,
    });
    res.send({
      success: true,
      message: "Success",
      data: getAdvertisementData,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err._message,
    });
  }
});

//@desc get updateAdvertisement of a campaign by _id
//route PUT /publish-ads/:_id
//@access Private
exports.updateAdvertisement = asyncHandler(async (req, res, next) => {
  try {
    const { advertisementId } = req.params;
    const _id = advertisementId;
    req.body.placementPageArray = req.body.placementPageArray.split(",");
    req.body["placement_page"] = req.body.placementPageArray;
    let body = req.body;
    let getImagePath;
    if (req.file) {
      const advertisementImage = {
        file: req.file,
        type: "advertisement_image",
      };
      const response = await s3Upload(advertisementImage);
      getImagePath = response.Location;
      body["advertisement_image"] = getImagePath;
      await Advertisement.findByIdAndUpdate(_id, body);
      res.send({
        success: true,
        message: "Updated Successfully",
      });
    } else {
      await Advertisement.findByIdAndUpdate(_id, req.body);
      res.send({
        success: true,
        message: "Updated Successfully",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

//@desc request for a forgot password link
//route POST /forgot-password
//@access Private
exports.partnerForgotPassword = async (req, res, next) => {
  const { email, url, otp, password } = req.body;
  if (!email) {
    return res.send({
      success: false,
      status: 0,
      message: "Please provide email",
    });
  }
  const partner = await Partner.findOne({ email });
  if (!partner) {
    return res.send({
      success: false,
      status: 0,
      message: "User does not exist",
    });
  }
  const currentDate = CommonHelper.formatedDate(new Date(), 7);
  if (
    partner.reset_password_attempted_on == currentDate &&
    user.reset_password_attempted >= 3
  ) {
    return res.send({
      success: false,
      message: "Max number of attempt has been exceeded",
    });
  }
  const OTP = await randomstring.generate({
    length: 6,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });
  partner.reset_password_otp = OTP;
  if (partner.reset_password_attempted_on == currentDate)
    partner.reset_password_attempted = partner.reset_password_attempted + 1;
  else partner.reset_password_attempted = 1;

  partner.reset_password_attempted_on = new Date();
  await partner.save();
  const emailData = {
    email: partner.email,
    name: partner.full_name,
    OTP,
  };
  sendForgotPasswordEmail(emailData);
  res.send({
    success: true,
    status: 1,
    message: "A reset password OTP has been sent to you registered email",
  });
};

//@desc reset password
//route POST /api/partner-reset-password
//@access Private
exports.partnerResetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password } = req.body;
  if (!email) {
    return res.send({ success: false, message: "Please provide email" });
  }
  if (!otp) {
    return res.send({
      success: false,
      message: "Please provide reset password OTP",
    });
  }
  if (!password) {
    return res.send({ success: false, message: "Please provide password" });
  }
  const checkPartner = await Partner.findOne({ email });
  if (!checkPartner) {
    return res.send({ success: false, message: "Partner does not exist" });
  }
  if (checkPartner.reset_password_otp != otp) {
    return res.send({
      success: false,
      message: "It seems that you have entered wrong OTP",
    });
  }
  checkPartner.reset_password_otp = "";
  checkPartner.reset_password_attempted = 0;
  checkPartner.password = password;
  await checkPartner.save();
  res.send({
    success: true,
    message: "Your password has been changed",
  });
});

//@desc get profile ave age, top consumption purpose, top location & avg. frequency
//route POST /api/get-profiles-main
//@access Private
exports.getProfileMain = asyncHandler(async (req, res, next) => {
  try {
    var findUsers = { dob: { $exists: true, $ne: null } };
    var weeklyPipeline = [
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            week: { $week: "$created_at" },
          },
          created_at: { $first: "$created_at" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.created_at": 1 } },
    ];
    var monthlyPipeline = [
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            month: { $month: "$created_at" },
          },
          created_at: { $first: "$created_at" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.created_at": 1 } },
    ];
    var yearlyPipeline = [
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
          },
          created_at: { $first: "$created_at" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.created_at": 1 } },
    ];
    var dailyPipeline = [
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            month: { $month: "$created_at" },
            day: { $dayOfMonth: "$created_at" },
          },
          created_at: { $first: "$created_at" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.created_at": 1 } },
    ];
    const dailyEntries = await Diary.aggregate(dailyPipeline);
    var lengthEntries = 0,
      totalEntries = 0;
    for (var e = 0; e < dailyEntries.length; e++) {
      totalEntries += dailyEntries[e].count;
      lengthEntries++;
    }
    var dailyEntriesAverage = totalEntries / lengthEntries;
    const weeklyEntries = await Diary.aggregate(weeklyPipeline);
    const users = await Users.find(findUsers)
      .populate({
        path: "consumption_reason",
        select: { name: 1, _id: 1 },
      })
      .populate({
        path: "state",
        select: { name: 1 },
      })
      .select({ dob: 1, _id: 1, consumption_reason: 1, gender: 1, state: 1 });
    let user_age = [];
    var today = new Date(),
      length = 0,
      total = 0;
    if (users.length > 0) {
      for (var i = 0; i < users.length; i++) {
        var birthDate = new Date(users[i].dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        let UserEntries = "";
        user_age.push({
          id: users[i]._id,
          dob: users[i].dob,
          gender: users[i].gender,
          entries: UserEntries.length,
          consumption_reason: !!users[i].consumption_reason
            ? users[i].consumption_reason.name
            : "",
          consumption_reason_id: !!users[i].consumption_reason
            ? users[i].consumption_reason.id
            : "",
          state: !!users[i].state ? users[i].state.name : "",
          age: age,
        });
        total += age;
        length++;
      }
      var user_average = total / length;
    }
    var consumptionReasonTempResult = {};
    var consumptionReasonDataResult = {};
    var genderTempResult = {};
    var ageTempResult = {};
    var stateTempResult = {};

    for (let {
      id,
      dob,
      consumption_reason,
      consumption_reason_id,
      age,
      gender,
      state,
      entries,
    } of user_age) {
      if (consumption_reason !== "") {
        consumptionReasonTempResult[consumption_reason] = {
          consumption_reason,
          count: consumptionReasonTempResult[consumption_reason]
            ? consumptionReasonTempResult[consumption_reason].count + 1
            : 1,
        };
      } else {
        consumptionReasonTempResult["Undefined"] = {
          consumption_reason: "Undefined",
          count: consumptionReasonTempResult["Undefined"]
            ? consumptionReasonTempResult["Undefined"].count + 1
            : 1,
        };
      }
      if (consumption_reason !== "") {
        if (consumptionReasonDataResult[consumption_reason]) {
          const user_ids = consumptionReasonDataResult[
            consumption_reason
          ].users_ids.push(ObjectId(id));
          consumptionReasonDataResult[consumption_reason].total_users =
            consumptionReasonDataResult[consumption_reason].total_users + 1;
          const genders = !!gender
            ? consumptionReasonDataResult[consumption_reason].gender[
                gender
              ].push(ObjectId(id))
            : "";
        } else {
          consumptionReasonDataResult[consumption_reason] = {
            users_ids: [ObjectId(id)],
            total_users: 1,
            gender: { Male: [], Female: [], "Rather not say": [], Others: [] },
          };
          if (gender !== "" && !!gender) {
            consumptionReasonDataResult[consumption_reason].gender[gender] = [
              ObjectId(id),
            ];
          }
        }
        consumptionReasonDataResult[consumption_reason] = {
          id: consumption_reason_id,
          consumption_reason,
          total_users:
            consumptionReasonDataResult[consumption_reason].total_users,
          users_ids: consumptionReasonDataResult[consumption_reason].users_ids,
          gender: consumptionReasonDataResult[consumption_reason].gender,
        };
      } else {
        if (consumptionReasonDataResult["Undefined"]) {
          const user_ids = consumptionReasonDataResult[
            "Undefined"
          ].users_ids.push(ObjectId(id));
          consumptionReasonDataResult["Undefined"].total_users =
            consumptionReasonDataResult["Undefined"].total_users + 1;
          const genders = !!gender
            ? consumptionReasonDataResult["Undefined"].gender[gender].push(
                ObjectId(id)
              )
            : "";
        } else {
          consumptionReasonDataResult["Undefined"] = {
            users_ids: [ObjectId(id)],
            total_users: 1,
            gender: { Male: [], Female: [], "Rather not say": [], Others: [] },
          };
          if (gender !== "" && !!gender) {
            consumptionReasonDataResult["Undefined"].gender[gender] = [
              ObjectId(id),
            ];
          }
        }
        consumptionReasonDataResult["Undefined"] = {
          id: "N/A",
          consumption_reason: "Undefined",
          total_users: consumptionReasonDataResult["Undefined"].total_users,
          users_ids: consumptionReasonDataResult["Undefined"].users_ids,
          gender: consumptionReasonDataResult["Undefined"].gender,
        };
      }
      if (gender !== "" && !!gender) {
        genderTempResult[gender] = {
          gender,
          count: genderTempResult[gender]
            ? genderTempResult[gender].count + 1
            : 1,
        };
      }
      if (age !== "" && !!age) {
        ageTempResult[age] = {
          age,
          count: ageTempResult[age] ? ageTempResult[age].count + 1 : 1,
        };
      }
      if (state !== "" && !!state) {
        stateTempResult[state] = {
          state,
          count: stateTempResult[state] ? stateTempResult[state].count + 1 : 1,
        };
      }
    }
    const consumptionReasonResult = Object.values(consumptionReasonTempResult);
    const genderResult = Object.values(genderTempResult);
    const ageResult = Object.values(ageTempResult);
    const stateResult = Object.values(stateTempResult);
    const consumptionReasonData = Object.values(consumptionReasonDataResult);
    let findAllEntries = { is_active: 1, is_deleted: 0 };
    const getAllEntries = await Diary.find(findAllEntries);
    const totalUserEntries = getAllEntries.length;
    let purposeData = [];
    let totalComsumptionReasonUsers = 0;
    let totalComsumptionReasonEntries = 0;
    let totalComsumptionReasonAveEntries = 0;
    for (var d = 0; d < consumptionReasonData.length; d++) {
      let findUserEntries = {
        user: { $in: consumptionReasonData[d].users_ids },
      };
      let UserEntries = await Diary.find(findUserEntries);
      let averageRatingsTotal = 0;
      for (var w = 0; w < UserEntries.length; w++) {
        if (UserEntries[w].average_ratings) {
          averageRatingsTotal += Number(UserEntries[w].average_ratings);
        } else {
          averageRatingsTotal += 0;
        }
      }
      consumptionReasonData[d].gender = [
        {
          gender: "Male",
          count: (!!consumptionReasonData[d].gender["Male"]
            ? await Diary.find({
                user: { $in: consumptionReasonData[d].gender["Male"] },
              })
            : ""
          ).length,
        },
        {
          gender: "Female",
          count: (!!consumptionReasonData[d].gender["Female"]
            ? await Diary.find({
                user: { $in: consumptionReasonData[d].gender["Female"] },
              })
            : ""
          ).length,
        },
        {
          gender: "Rather not say",
          count: (!!consumptionReasonData[d].gender["Rather not say"]
            ? await Diary.find({
                user: {
                  $in: consumptionReasonData[d].gender["Rather not say"],
                },
              })
            : ""
          ).length,
        },
      ];
      purposeData.push({
        consumption_reason_id: consumptionReasonData[d].id,
        consumption_reason: consumptionReasonData[d].consumption_reason,
        total_users: consumptionReasonData[d].total_users,
        user_entries: UserEntries.length,
        genders: consumptionReasonData[d].gender,
        average_entries:
          Number((UserEntries.length / totalUserEntries) * 100).toFixed(2) +
          "%",
        all_users: "",
        all_entries: UserEntries,
        all_ave_entries: "",
        average_ratings: Number(averageRatingsTotal / w).toFixed(0),
      });
      totalComsumptionReasonUsers += consumptionReasonData[d].total_users;
      totalComsumptionReasonEntries += UserEntries.length;
      totalComsumptionReasonAveEntries += Number(
        (UserEntries.length / totalUserEntries) * 100
      ).toFixed(2);
    }
    /*purposeData.all_users = totalComsumptionReasonUsers
    purposeData.all_entries = totalComsumptionReasonEntries
    purposeData.all_ave_entries = totalComsumptionReasonAveEntries */
    const profile = {
      user: {
        average: 0,
        top_reason: consumptionReasonResult.reduce((max, obj) =>
          max.count > obj.count ? max : obj
        ),
        top_location: stateResult.reduce((max, obj) =>
          max.count > obj.count ? max : obj
        ),
        daily_average_entries: dailyEntriesAverage,
        consumption_reasons: purposeData,
        gender: genderResult,
        age: ageResult,
        state: stateResult,
        users: {},
        weekly_entries: weeklyEntries,
      },
    };
    profile.user.average = user_average;
    profile.user.users = user_age;
    res.send({
      success: true,
      data: profile,
    });
  } catch (e) {
    res.send({
      success: false,
      message: e,
    });
  }
});

//@desc get profile ave age, sex, location demographics
//route GET /api/get-profiles-demographics
//@access Private
exports.getProfileDemographics = asyncHandler(async (req, res, next) => {
  var demographDateFrom = new Date(req.query.demographfrom);
  var demographDateTo = new Date(req.query.demographTo);
  if (!!req.query.demographfrom && !!req.query.demographTo) {
    var findUsers = {
      dob: { $exists: true, $ne: null },
      created_at: {
        $gte: demographDateFrom.toDateString(),
        $lt: demographDateTo.toDateString(),
      },
    };
  } else {
    var findUsers = { dob: { $exists: true, $ne: null } };
  }
  const users = await Users.find(findUsers)
    .populate({
      path: "state",
      select: { name: 1 },
    })
    .select({ dob: 1, _id: 1, consumption_reason: 1, gender: 1, state: 1 });
  let user_age = [];
  var today = new Date(),
    length = 0,
    total = 0;
  if (users.length > 0) {
    for (var i = 0; i < users.length; i++) {
      var birthDate = new Date(users[i].dob);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      user_age.push({
        id: users[i]._id,
        gender: users[i].gender,
        state: !!users[i].state ? users[i].state.name : "",
        age: age,
      });
    }
  }
  var genderTempResult = {};
  var ageTempResult = {};
  var stateTempResult = {};

  for (let { id, age, gender, state } of user_age) {
    if (gender !== "" && !!gender) {
      genderTempResult[gender] = {
        gender,
        count: genderTempResult[gender]
          ? genderTempResult[gender].count + 1
          : 1,
      };
    }
    if (age !== "" && !!age) {
      ageTempResult[age] = {
        age,
        count: ageTempResult[age] ? ageTempResult[age].count + 1 : 1,
      };
    }
    if (state !== "" && !!state) {
      stateTempResult[state] = {
        state,
        count: stateTempResult[state] ? stateTempResult[state].count + 1 : 1,
      };
    }
  }
  const genderResult = Object.values(genderTempResult);
  const ageResult = Object.values(ageTempResult);
  const stateResult = Object.values(stateTempResult);

  const profile = {
    user: {
      gender: genderResult,
      age: ageResult,
      state: stateResult,
    },
  };

  res.send({
    success: true,
    data: profile,
  });
});

//@desc get profile purpose
//route GET /api/get-profiles-purpose
//@access Private
exports.getProfilePurpose = asyncHandler(async (req, res, next) => {
  var purposeDateFrom = new Date(req.query.purposefrom);
  var purposeDateTo = new Date(req.query.purposeTo);
  var purposeId = !!req.query.purposeId ? req.query.purposeId : null;
  if (!!req.query.purposefrom && !!req.query.purposeTo) {
    if (!!req.query.purposeId) {
      var findUsers = {
        dob: { $exists: true, $ne: null },
        created_at: {
          $gte: purposeDateFrom.toDateString(),
          $lt: purposeDateTo.toDateString(),
        },
        consumption_reason: ObjectId(purposeId),
      };
    } else {
      var findUsers = {
        dob: { $exists: true, $ne: null },
        created_at: {
          $gte: purposeDateFrom.toDateString(),
          $lt: purposeDateTo.toDateString(),
        },
      };
    }
  } else {
    if (!!req.query.purposeId) {
      var findUsers = {
        dob: { $exists: true, $ne: null },
        consumption_reason: ObjectId(purposeId),
      };
    } else {
      var findUsers = { dob: { $exists: true, $ne: null } };
    }
  }
  const users = await Users.find(findUsers)
    .populate({
      path: "consumption_reason",
      select: { name: 1 },
    })
    .select({ _id: 1, gender: 1, consumption_reason: 1, average_ratings: 1 });
  let user_age = [];
  if (users.length > 0) {
    for (var i = 0; i < users.length; i++) {
      user_age.push({
        id: users[i]._id,
        gender: users[i].gender,
        consumption_reason: !!users[i].consumption_reason
          ? users[i].consumption_reason.name
          : "",
      });
    }
  }
  var consumptionReasonDataResult = {};
  try {
    for (let { id, gender, consumption_reason } of user_age) {
      if (consumption_reason !== "") {
        if (consumptionReasonDataResult[consumption_reason]) {
          const user_ids = consumptionReasonDataResult[
            consumption_reason
          ].users_ids.push(ObjectId(id));
          consumptionReasonDataResult[consumption_reason].total_users =
            consumptionReasonDataResult[consumption_reason].total_users + 1;
          const genders =
            !!consumptionReasonDataResult[consumption_reason].gender[gender] &&
            !!gender
              ? consumptionReasonDataResult[consumption_reason].gender[
                  gender
                ].push(ObjectId(id))
              : "";
        } else {
          consumptionReasonDataResult[consumption_reason] = {
            users_ids: [ObjectId(id)],
            total_users: 1,
            gender: { Male: [], Female: [], "Rather not say": [] },
          };
          if (gender !== "" && !!gender) {
            consumptionReasonDataResult[consumption_reason].gender[gender] = [
              ObjectId(id),
            ];
          }
        }
        consumptionReasonDataResult[consumption_reason] = {
          consumption_reason,
          total_users:
            consumptionReasonDataResult[consumption_reason].total_users,
          users_ids: consumptionReasonDataResult[consumption_reason].users_ids,
          gender: consumptionReasonDataResult[consumption_reason].gender,
        };
      }
    }
  } catch (e) {
    console.log(e);
  }
  const consumptionReasonData = Object.values(consumptionReasonDataResult);
  let findAllEntries = { is_active: 1, is_deleted: 0 };
  const getAllEntries = await Diary.find(findAllEntries).select({
    _id: 1,
    average_ratings: 1,
  });
  const totalUserEntries = getAllEntries.length;
  let purposeData = [];
  let totalComsumptionReasonUsers = 0;
  let totalComsumptionReasonEntries = 0;
  let totalComsumptionReasonAveEntries = 0;
  for (var d = 0; d < consumptionReasonData.length; d++) {
    let findUserEntries = {
      user: { $in: consumptionReasonData[d].users_ids },
    };
    let UserEntries = await Diary.find(findUserEntries)
      .populate({
        path: "user",
        select: { full_name: 1 },
      })
      .select({
        _id: 1,
        average_ratings: 1,
        created_at: 1,
      });
    let averageRatingsTotal = 0;
    for (var w = 0; w < UserEntries.length; w++) {
      if (UserEntries[w].average_ratings) {
        averageRatingsTotal += Number(UserEntries[w].average_ratings);
      } else {
        averageRatingsTotal += 0;
      }
    }
    consumptionReasonData[d].gender = [
      {
        gender: "Male",
        count: (!!consumptionReasonData[d].gender["Male"]
          ? await Diary.find({
              user: { $in: consumptionReasonData[d].gender["Male"] },
            })
          : ""
        ).length,
      },
      {
        gender: "Female",
        count: (!!consumptionReasonData[d].gender["Female"]
          ? await Diary.find({
              user: { $in: consumptionReasonData[d].gender["Female"] },
            })
          : ""
        ).length,
      },
      {
        gender: "Rather not say",
        count: (!!consumptionReasonData[d].gender["Rather not say"]
          ? await Diary.find({
              user: { $in: consumptionReasonData[d].gender["Rather not say"] },
            })
          : ""
        ).length,
      },
    ];
    purposeData.push({
      consumption_reason: consumptionReasonData[d].consumption_reason,
      all_entries: UserEntries,
      total_users: consumptionReasonData[d].total_users,
      user_entries: UserEntries.length,
      genders: consumptionReasonData[d].gender,
      average_entries:
        Number((UserEntries.length / totalUserEntries) * 100).toFixed(2) + "%",
      average_ratings: Number(averageRatingsTotal / w).toFixed(0),
    });
    totalComsumptionReasonUsers += consumptionReasonData[d].total_users;
    totalComsumptionReasonEntries += UserEntries.length;
    totalComsumptionReasonAveEntries += Number(
      (UserEntries.length / totalUserEntries) * 100
    ).toFixed(2);
  }
  /*purposeData.all_users = totalComsumptionReasonUsers
  purposeData.all_entries = totalComsumptionReasonEntries
  purposeData.all_ave_entries = totalComsumptionReasonAveEntries */

  const profile = {
    user: {
      consumption_reasons: purposeData,
    },
  };

  res.send({
    success: true,
    data: profile,
  });
});

//@desc get profile purpose
//route POST /api/get-profiles-reason
//@access Private
exports.getProfileReason = asyncHandler(async (req, res, next) => {});

//@desc get profile frequency
//route POST /api/get-profiles-frequency
//@access Private
exports.getProfileFrequency = asyncHandler(async (req, res, next) => {});

//@desc get Objective Entries
//route GET /api/get-objectives-entries
//@access Private
exports.getObjectivesEntries = asyncHandler(async (req, res, next) => {
  let entryCond = { is_active: 1, is_deleted: 0 };
  let objectivesEntries = await Diary.find(entryCond)
    .populate({
      path: "pre_symptoms.symptom_id",
      select: { name: 1 },
    })
    .populate({
      path: "desired_effects.effect_id",
      select: { name: 1 },
    })
    .populate({
      path: "actual_effects.effect_id",
      select: { name: 1 },
    })
    .populate({
      path: "pre_activities.activity_id",
      select: { name: 1 },
    })
    .populate({
      path: "pre_condition.condition_id",
      select: { name: 1 },
    })
    .select({ _id: 1, created_at: 1 });
  let objectives = {};
  let entries = [];
  var symptomsTempResultCombined = {};
  var activityTempResultCombined = {};
  var desiredTempResultCombined = {};
  for (var i = 0; i < objectivesEntries.length; i++) {
    var symptomsTempResult = {};
    var desiredEffectsTempResult = {};
    var actualEffectsTempResult = {};
    var activityTempResult = {};
    var conditionsTempResult = {};

    for (let {
      _id,
      symptom_id,
      activity_id,
      condition_id,
    } of objectivesEntries[i].pre_symptoms) {
      var symptomName = symptom_id.name;
      var symptoms = "symptoms";
      if (symptomName !== "" && !!symptomName) {
        symptomsTempResult[symptomName] = {
          symptomName,
          count: symptomsTempResult[symptomName]
            ? symptomsTempResult[symptomName].count + 1
            : 1,
        };
        symptomsTempResultCombined["symptoms"] = {
          symptoms,
          count: symptomsTempResultCombined["symptoms"]
            ? symptomsTempResultCombined["symptoms"].count + 1
            : 1,
        };
      }
    }
    for (let { _id, activity_id } of objectivesEntries[i].pre_activities) {
      var activityName = activity_id.name;
      var activity = "activity";
      if (activityName !== "" && !!activityName) {
        activityTempResult[activityName] = {
          activityName,
          count: activityTempResult[activityName]
            ? activityTempResult[activityName].count + 1
            : 1,
        };
        activityTempResultCombined["activity"] = {
          activity,
          count: activityTempResultCombined["activity"]
            ? activityTempResultCombined["activity"].count + 1
            : 1,
        };
      }
    }

    if (objectivesEntries[i].desired_effects.length > 0) {
      for (let { _id, name } of objectivesEntries[i].desired_effects) {
        if (name !== "" && !!name) {
          desiredEffectsTempResult[name] = {
            name,
            count: desiredEffectsTempResult[name]
              ? desiredEffectsTempResult[name].count + 1
              : 1,
          };
        }
      }
    }
    if (objectivesEntries[i].actual_effects.length > 0) {
      for (let { _id, name } of objectivesEntries[i].actual_effects) {
        if (name !== "" && !!name) {
          actualEffectsTempResult[name] = {
            name,
            count: actualEffectsTempResult[name]
              ? actualEffectsTempResult[name].count + 1
              : 1,
          };
        }
      }
    }
    if (objectivesEntries[i].pre_activities.length > 0) {
      for (let { _id, name } of objectivesEntries[i].pre_activities) {
        if (name !== "" && !!name) {
          activitiesTempResult[name] = {
            name,
            count: activitiesTempResult[name]
              ? activitiesTempResult[name].count + 1
              : 1,
          };
        }
      }
    }
    /*if(objectivesEntries[i].pre_condition.length>0){
      for(let { _id, name } of objectivesEntries[i].pre_condition) {
        if (name!=='' && !!name) {
          conditionsTempResult[name] = {name, count: conditionsTempResult[name] ? conditionsTempResult[name].count + 1 : 1}
        }
      }
    }*/
    const symptomsResult = Object.values(symptomsTempResult);
    const activityResult = Object.values(activityTempResult);
    const desiredEffectsResult = Object.values(desiredEffectsTempResult);
    const actualEffectsResult = Object.values(actualEffectsTempResult);
    //const activitiesResult = Object.values(activitiesTempResult)
    //const conditionsResult = Object.values(conditionsTempResult)

    entries.push({
      id: objectivesEntries[i]._id,
      created_at: objectivesEntries[i].created_at,
      symptoms: symptomsResult,
      desired_effect: desiredEffectsResult,
      actual_effect: actualEffectsResult,
      activities: activityResult,
      //conditions: conditionsResult
    });
  }
  const symptomsResultCombined = Object.values(symptomsTempResultCombined);
  const activityResultCombined = Object.values(activityTempResultCombined);
  var resultSymptoms = _(entries)
    .groupBy(
      (x) =>
        new Date(x.created_at).getMonth() +
        1 +
        "-" +
        new Date(x.created_at).getFullYear()
    )
    .map((value, key) => ({ date: key, entries: value }))
    .value();
  var resultActivity = _(entries)
    .groupBy(
      (x) =>
        new Date(x.created_at).getMonth() +
        1 +
        "-" +
        new Date(x.created_at).getFullYear()
    )
    .map((value, key) => ({ date: key, entries: value }))
    .value();
  for (var l = 0; l < resultSymptoms.length; l++) {}
  objectives.total_symptoms = symptomsResultCombined;
  objectives.total_symptoms[0].entries = resultSymptoms;
  objectives.total_activity = activityResultCombined;
  objectives.total_activity[0].entries = resultActivity;
  res.send({
    success: true,
    data: objectives,
  });
});

//@desc get Objective Maiun
//route POST /api/get-objectives-main
//@access Private
exports.getObjectivesMain = asyncHandler(async (req, res, next) => {
  var objectivesFrom = new Date(req.query.objectivesFrom);
  var objectivesTo = new Date(req.query.objectivesTo);
  var findCondDefault = { is_active: 1, is_deleted: 0 };
  var findCondActivitiesEntries = { is_active: 1, is_deleted: 0 };
  var findCondConditionsEntries = { is_active: 1, is_deleted: 0 };
  var findCondEffectsEntries = { is_active: 1, is_deleted: 0 };
  var findCondSymptomsEntries = { is_active: 1, is_deleted: 0 };
  if (!!req.query.objectivesFrom && !!req.query.objectivesTo) {
    findCondActivitiesEntries.created_at = {
      $gte: objectivesFrom.toDateString(),
      $lt: objectivesTo.toDateString(),
    };
    findCondConditionsEntries.created_at = {
      $gte: objectivesFrom.toDateString(),
      $lt: objectivesTo.toDateString(),
    };
    findCondEffectsEntries.created_at = {
      $gte: objectivesFrom.toDateString(),
      $lt: objectivesTo.toDateString(),
    };
    findCondSymptomsEntries.created_at = {
      $gte: objectivesFrom.toDateString(),
      $lt: objectivesTo.toDateString(),
    };
  } else {
    var findCond = { is_deleted: 0, is_active: 1 };
  }
  let activitiesObj = await Activities.find(findCondDefault).select({
    _id: 1,
    name: 1,
  });
  let conditionsObj = await Conditions.find(findCondDefault).select({
    _id: 1,
    name: 1,
  });
  let effectsObj = await Effects.find(findCondDefault).select({
    _id: 1,
    name: 1,
  });
  let symptomsObj = await Symptoms.find(findCondDefault).select({
    _id: 1,
    name: 1,
  });
  let objectivesArray = [];
  //Activity
  let objectivesActivityArray = [];
  let objectivesActivityEntries = [];
  for (var i = 0; i < activitiesObj.length; i++) {
    findCondActivitiesEntries.pre_activities = {
      $elemMatch: { activity_id: { $in: activitiesObj[i]._id } },
    };
    let activitiesEntries = await Diary.find(findCondActivitiesEntries)
      .populate({ path: "user", select: { full_name: 1, dob: 1, gender: 1 } })
      .select({ user: 1, _id: 1, product: 1, created_at: 1 });
    var activitiesEntriesDateSorted = activitiesEntries.reduce(
      (r, { created_at }) => {
        let dateObj = new Date(created_at);
        let monthyear = dateObj.toLocaleString("en-us", {
          month: "long",
          year: "numeric",
        });
        if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
        else r[monthyear].entries++;
        return r;
      },
      {}
    );
    objectivesActivityArray.push({
      name: activitiesObj[i].name,
      total_entries: activitiesEntries.length,
      entries: activitiesEntries,
      entriesByDate: activitiesEntriesDateSorted,
    });
    objectivesActivityEntries.push(activitiesEntries);
  }
  objectivesActivityEntriesMerged = [].concat(...objectivesActivityEntries);

  const resultActivityData = objectivesActivityEntriesMerged.reduce(
    (r, { created_at }) => {
      let dateObj = new Date(created_at);
      let monthyear = dateObj.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
      });
      if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
      else r[monthyear].entries++;
      return r;
    },
    {}
  );

  //Conditions
  let objectivesConditionsArray = [];
  let objectivesConditionsEntries = [];
  for (var i = 0; i < conditionsObj.length; i++) {
    findCondConditionsEntries.pre_condition = {
      $elemMatch: { condition_id: { $in: conditionsObj[i]._id } },
    };
    let conditionsEntries = await Diary.find(findCondConditionsEntries)
      .populate({ path: "user", select: { full_name: 1, dob: 1, gender: 1 } })
      .select({ user: 1, _id: 1, product: 1, created_at: 1 });
    var conditionsEntriesDateSorted = conditionsEntries.reduce(
      (r, { created_at }) => {
        let dateObj = new Date(created_at);
        let monthyear = dateObj.toLocaleString("en-us", {
          month: "long",
          year: "numeric",
        });
        if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
        else r[monthyear].entries++;
        return r;
      },
      {}
    );
    objectivesConditionsArray.push({
      name: conditionsObj[i].name,
      total_entries: conditionsEntries.length,
      entries: conditionsEntries,
      entriesByDate: conditionsEntriesDateSorted,
    });
    objectivesConditionsEntries.push(conditionsEntries);
  }
  objectivesConditionsEntriesMerged = [].concat(...objectivesConditionsEntries);

  const resultConditionsData = objectivesConditionsEntriesMerged.reduce(
    (r, { created_at }) => {
      let dateObj = new Date(created_at);
      let monthyear = dateObj.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
      });
      if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
      else r[monthyear].entries++;
      return r;
    },
    {}
  );
  //Effects
  let objectivesEffectsArray = [];
  let objectivesEffectsEntries = [];
  for (var i = 0; i < effectsObj.length; i++) {
    findCondEffectsEntries.desired_effects = {
      $elemMatch: { effect_id: { $in: effectsObj[i]._id } },
    };
    let EffectsEntries = await Diary.find(findCondEffectsEntries)
      .populate({ path: "user", select: { full_name: 1, dob: 1, gender: 1 } })
      .select({ user: 1, _id: 1, product: 1, created_at: 1 });
    var EffectsEntriesDateSorted = EffectsEntries.reduce(
      (r, { created_at }) => {
        let dateObj = new Date(created_at);
        let monthyear = dateObj.toLocaleString("en-us", {
          month: "long",
          year: "numeric",
        });
        if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
        else r[monthyear].entries++;
        return r;
      },
      {}
    );
    objectivesEffectsArray.push({
      name: effectsObj[i].name,
      total_entries: EffectsEntries.length,
      entries: EffectsEntries,
      entriesByDate: EffectsEntriesDateSorted,
    });
    objectivesEffectsEntries.push(EffectsEntries);
  }
  objectivesEffectsEntriesMerged = [].concat(...objectivesEffectsEntries);

  const resultEffectsData = objectivesEffectsEntriesMerged.reduce(
    (r, { created_at }) => {
      let dateObj = new Date(created_at);
      let monthyear = dateObj.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
      });
      if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
      else r[monthyear].entries++;
      return r;
    },
    {}
  );
  //Symptoms
  let objectivesSymptomsArray = [];
  let objectivesSymptomsEntries = [];
  for (var i = 0; i < symptomsObj.length; i++) {
    findCondSymptomsEntries.pre_symptoms = {
      $elemMatch: { symptom_id: { $in: symptomsObj[i]._id } },
    };
    let symptomsEntries = await Diary.find(findCondSymptomsEntries)
      .populate({ path: "user", select: { full_name: 1, dob: 1, gender: 1 } })
      .select({ user: 1, _id: 1, product: 1, created_at: 1 });
    var symptomsEntriesDateSorted = symptomsEntries.reduce(
      (r, { created_at }) => {
        let dateObj = new Date(created_at);
        let monthyear = dateObj.toLocaleString("en-us", {
          month: "long",
          year: "numeric",
        });
        if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
        else r[monthyear].entries++;
        return r;
      },
      {}
    );
    objectivesSymptomsArray.push({
      name: symptomsObj[i].name,
      total_entries: symptomsEntries.length,
      entries: symptomsEntries,
      entriesByDate: symptomsEntriesDateSorted,
    });
    objectivesSymptomsEntries.push(symptomsEntries);
  }
  objectivesSymptomsEntriesMerged = [].concat(...objectivesSymptomsEntries);

  const resultSymptomsData = objectivesSymptomsEntriesMerged.reduce(
    (r, { created_at }) => {
      let dateObj = new Date(created_at);
      let monthyear = dateObj.toLocaleString("en-us", {
        month: "long",
        year: "numeric",
      });
      if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
      else r[monthyear].entries++;
      return r;
    },
    {}
  );

  objectivesArray.push({
    activity: [
      {
        total_objectives: objectivesActivityArray.length,
        objectives: objectivesActivityArray.sort(
          (a, b) => b.total_entries - a.total_entries
        ),
        merged_entries: Object.values(resultActivityData).sort(
          (a, b) => new Date(a.monthyear) - new Date(b.monthyear)
        ),
      },
    ],
    conditions: [
      {
        total_objectives: objectivesConditionsArray.length,
        objectives: objectivesConditionsArray.sort(
          (a, b) => b.total_entries - a.total_entries
        ),
        merged_entries: Object.values(resultConditionsData).sort(
          (a, b) => new Date(a.monthyear) - new Date(b.monthyear)
        ),
      },
    ],
    effects: [
      {
        total_objectives: objectivesEffectsArray.length,
        objectives: objectivesEffectsArray.sort(
          (a, b) => b.total_entries - a.total_entries
        ),
        merged_entries: Object.values(resultEffectsData).sort(
          (a, b) => new Date(a.monthyear) - new Date(b.monthyear)
        ),
      },
    ],
    symptoms: [
      {
        total_objectives: objectivesSymptomsArray.length,
        objectives: objectivesSymptomsArray.sort(
          (a, b) => b.total_entries - a.total_entries
        ),
        merged_entries: Object.values(resultSymptomsData).sort(
          (a, b) => new Date(a.monthyear) - new Date(b.monthyear)
        ),
      },
    ],
  });
  var activitiesMerged = objectivesArray[0].activity[0].objectives;
  var conditionsMerged = objectivesArray[0].conditions[0].objectives;
  var effectsMerged = objectivesArray[0].effects[0].objectives;
  var symptomsMerged = objectivesArray[0].symptoms[0].objectives;
  //var merged_arrays = {...activitiesMerged, ...conditionsMerged, ...effectsMerged, ...symptomsMerged}
  var merged_arrays = activitiesMerged.concat(
    conditionsMerged,
    effectsMerged,
    symptomsMerged
  );
  var merged_arraysSort = merged_arrays.sort(
    (a, b) => b.total_entries - a.total_entries
  );
  let mergedArrayAces = [];
  for (var i = 0; i < merged_arraysSort.length; i++) {
    var mergedArrayAcesEntries = [];
    for (var e = 0; e < merged_arraysSort[i].entries.length; e++) {
      mergedArrayAcesEntries.push({
        _id: merged_arraysSort[i].entries[e]._id,
        product: merged_arraysSort[i].entries[e].product,
        created_at: merged_arraysSort[i].entries[e].created_at,
        gender: merged_arraysSort[i].entries[e].user.gender,
        user: merged_arraysSort[i].entries[e].user,
      });
    }
    var genderTempResult = {};
    for (let { gender } of mergedArrayAcesEntries) {
      if (gender !== "" && !!gender) {
        genderTempResult[gender] = {
          gender,
          count: genderTempResult[gender]
            ? genderTempResult[gender].count + 1
            : 1,
        };
      }
    }
    const genderResult = Object.values(genderTempResult);
    mergedArrayAces.push({
      name: merged_arraysSort[i].name,
      total_entries: merged_arraysSort[i].total_entries,
      gender: genderResult,
      entries: mergedArrayAcesEntries,
    });
  }
  res.send({
    success: true,
    entriesReason: mergedArrayAces,
    mergedAces: merged_arraysSort,
    data: objectivesArray,
  });
});

//@desc get Objective Entries Top5
//route POST /api/get-objectives-top5
//@access Private
exports.getObjectivesTop5 = asyncHandler(async (req, res, next) => {});

//@desc get Objective Reason
//route POST /api/get-objectives-reason
//@access Private
exports.getObjectivesReason = asyncHandler(async (req, res, next) => {
  let findCond = { is_deleted: 0, is_active: 1 };
  let ConsumptionReasonData = await ConsumptionReason.find(findCond).select({
    name: 1,
    _id: 1,
  });
  let objectiveReasonsData = [];
  for (var i = 0; i < ConsumptionReasonData.length; i++) {
    var consumptionReasonUsers = await User.find({
      consumption_reason: ConsumptionReasonData[i]._id,
    });
    for (var i = 0; i < consumptionReasonUsers.length; i++) {
      var consumptionReasonUsersEntries = await Diary.find({
        user: consumptionReasonUsers[i]._id,
      });
    }
    objectiveReasonsData.push({
      consumption_reason: ConsumptionReasonData[i].name,
      user_entries: consumptionReasonUsersEntries,
    });
  }
  res.send({
    success: true,
    data: objectiveReasonsData,
  });
});

//@desc get Categories
//route POST /api/get-categories
//@access Private
exports.getCategories = asyncHandler(async (req, res, next) => {
  var categoriesFrom = new Date(req.query.categoriesFrom);
  var categoriesTo = new Date(req.query.categoriesTo);
  var findCond = { is_deleted: 0, is_active: 1 };
  var findCondEntries = { is_deleted: 0, is_active: 1 };
  if (!!req.query.categoriesFrom && !!req.query.categoriesTo) {
    findCondEntries.created_at = {
      $gte: categoriesFrom.toDateString(),
      $lt: categoriesTo.toDateString(),
    };
  }
  if (!!req.query.categoryId) {
    findCond._id = ObjectId(req.query.categoryId);
  }
  let ProductTypeData = await ProductType.find(findCond).select({
    name: 1,
    _id: 1,
  });
  let ProductTypeArray = [];
  for (var i = 0; i < ProductTypeData.length; i++) {
    let productData = await Product.find({
      product_type: { $in: ProductTypeData[i]._id },
    }).select({ _id: 1, name: 1, created_at: 1 });
    let productEntries = [];
    for (var x = 0; x < productData.length; x++) {
      findCondEntries.product = productData[x]._id;
      productEntries.push(
        await Diary.find(findCondEntries)
          .populate({ path: "user", select: { full_name: 1 } })
          .select({
            user: 1,
            _id: 1,
            product: 1,
            created_at: 1,
            average_ratings: 1,
          })
      );
    }
    productEntriesMerged = [].concat(...productEntries);
    productEntriesMerged.sort(function (a, b) {
      return new Date(a.created_at) - new Date(b.created_at);
    });
    let averageRating = 0;
    let b = 0;
    for (var z = 0; z < productEntriesMerged.length; z++) {
      if (!!productEntriesMerged[z].average_ratings) {
        b++;
        averageRating += parseInt(productEntriesMerged[z].average_ratings);
      }
    }

    const countUsers = productEntriesMerged.reduce((groups, item) => {
      const group = groups[item.user] || [];
      group.push(item);
      groups[item.user] = group;
      return groups;
    }, {});

    const resultCategoryData = productEntriesMerged.reduce(
      (r, { created_at }) => {
        let dateObj = new Date(created_at);
        let monthyear = dateObj.toLocaleString("en-us", {
          month: "long",
          year: "numeric",
        });
        if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
        else r[monthyear].entries++;
        return r;
      },
      {}
    );

    averageRatings = averageRating / b;
    ProductTypeArray.push({
      product_type_id: ProductTypeData[i].id,
      name: ProductTypeData[i].name,
      total_entries: productEntriesMerged.length,
      average_ratings: averageRatings,
      average_entries:
        parseInt(productEntriesMerged.length) /
        parseInt(_.size(resultCategoryData)),
      entries: productEntriesMerged,
      entries_by_month: resultCategoryData,
      users: countUsers.length,
      total_users: _.size(countUsers),
      users_entries: countUsers,
    });
  }
  res.send({
    success: true,
    data: ProductTypeArray.sort((a, b) => b.total_entries - a.total_entries),
  });
});

//@desc get Rating and Reviews Main
//route POST /api/home-data/entries
//@access Private
exports.getHomeEntries = asyncHandler(async (req, res, next) => {
  var entriesFrom = new Date(req.query.entriesFrom);
  var entriesTo = new Date(req.query.entriesTo);
  if (!!req.query.entriesFrom && !!req.query.entriesTo) {
    let findCond = {
      is_deleted: 0,
      is_active: 1,
      created_at: {
        $gte: entriesFrom.toDateString(),
        $lt: entriesTo.toDateString(),
      },
    };
  } else {
    let findCond = { is_deleted: 0, is_active: 1 };
  }
  let findCond = { is_deleted: 0, is_active: 1 };
  let AllEntries = await Diary.find(findCond).sort({ created_at: 1 });

  const resultEntriesData = AllEntries.reduce((r, { created_at }) => {
    let dateObj = new Date(created_at);
    let monthyear = dateObj.toLocaleString("en-us", {
      month: "long",
      year: "numeric",
    });
    if (!r[monthyear]) r[monthyear] = { monthyear, entries: 1 };
    else r[monthyear].entries++;
    return r;
  }, {});
  res.send({
    success: true,
    data: resultEntriesData,
  });
});

//@desc get Rating and Reviews Main
//route POST /api/get-ratingandreview-main
//@access Private
exports.getRatingAndReviewsMain = asyncHandler(async (req, res, next) => {});

//@desc get Rating and Reviews Comments
//route POST /api/get-ratingandreview-comments
//@access Private
exports.getRatingAndReviewsComments = asyncHandler(async (req, res, next) => {
  let entryCond = { is_deleted: 0 };
  let findUserComments = await Diary.find(entryCond)
    .populate({
      path: "user_comments",
      select: { comment: 1, created_at: 1 },
      populate: {
        path: "commented_by",
        select: {
          full_name: 1,
        },
      },
    })
    .populate({
      path: "product",
      select: { name: 1 },
    })
    .populate({
      path: "user",
      select: { _id: 1, full_name: 1 },
    })
    .select({ _id: 1, average_ratings: 1, created_at: 1, comments: 1 })
    .sort({ created_at: -1 });
  let checkComments = [];
  for (var l = 0; l < findUserComments.length; l++) {
    if (
      findUserComments[l].average_ratings !== "" ||
      findUserComments[l].user_comments.length > 0
    ) {
      checkComments.push({
        id: findUserComments[l]._id,
        average_ratings: findUserComments[l].average_ratings,
        product_name: findUserComments[l].product.name,
        comments: findUserComments[l].comments,
        user_comments: findUserComments[l].user_comments,
        created_at: findUserComments[l].created_at,
        entry_owner: findUserComments[l].user,
        entry_owner_name: findUserComments[l].user.full_name,
      });
    }
  }
  res.send({
    success: true,
    data: checkComments,
  });
});
//@desc get User Comment for homepage
//route Get /api/home-data/user-comments
//@access Private
exports.getHomeUserComment = asyncHandler(async (req, res, next) => {
  var findUsers = { user_comments: { $exists: true, $ne: null } };
  const entriesComment = await Diary.find(findUsers)
    .populate({
      path: "product",
      select: { name: 1 },
    })
    .populate({
      path: "user",
      select: { full_name: 1 },
    })
    .select({ _id: 1, created_at: 1, user_comments: 1 });
  console.log(entriesComment);

  res.send({
    success: true,
    data: entriesComment,
  });
});

// to get published tcd updates
exports.getPublishedUpdates = async (req, res, next) => {
  try {
    const getUpdates = await TCDUpdates.find({ is_published: 1 });
    res.send({
      success: true,
      data: getUpdates,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err._message,
    });
  }
};

exports.getPublishedUpdatesById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const getUpdates = await TCDUpdates.findById(id);
    res.send({
      success: true,
      data: getUpdates,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err._message,
    });
  }
};

//@desc getPartnerProducts
//route GET /api/get-products
//@access Private
exports.getTopProducts = asyncHandler(async (req, res, next) => {
  const { page, perPageRecord, from, to } = req.query;

  const pageRecordLimit = parseInt(perPageRecord);
  const skip = (parseInt(page) - 1) * pageRecordLimit;
  let findCond = {
    $and: [
      { is_deleted: 0 },
      {
        created_at: {
          $gte: moment(from).format(),
          $lt: moment(to).format(),
        },
      },
    ],
  };

  const entriesTotalCount = await Diary.countDocuments(findCond);
  const products = await Diary.find(findCond)
    .limit(pageRecordLimit)
    .skip(skip)
    .populate({
      path: "product",
      select: ["name", "COA_identifier"],
      populate: { path: "product_type", select: { name: 1 } },
    });

  let pushProducts = [];
  for (let product of products) {
    const producer = await COA.findOne({
      coa_no: product.product.COA_identifier,
    }).select("producer_name");

    const totalEntriesCount = await COA.countDocuments({
      product: product.product._id,
      created_at: {
        $gte: moment(from).format(),
        $lt: moment(to).format(),
      },
    });
    const objProduct = {
      totalEntriesCount,
      rating: product.average_ratings,
      productId: product._id,
      productName: product.product.name ? product.product.name : "",
      product_type: product.product.product_type
        ? product.product.product_type.name
        : "",
      brand: producer ? producer.producer_name : "",
    };
    pushProducts.push(objProduct);
  }
  const final_res = pushProducts.sort((a, b) => {
    return b.totalEntriesCount - a.totalEntriesCount;
  });
  res.send({
    success: true,
    message: "Your product list",
    data: { products: final_res, totalEntries: entriesTotalCount },
  });
});

exports.getTopCategories = asyncHandler(async (req, res, next) => {
  const { from, to } = req.query;
  let total_rating = 0;
  let objectives = []; //effects
  let reasons = []; //symptoms

  const final_arr = [];
  const findCond = {
    $and: [
      { is_deleted: 0 },
      {
        created_at: {
          $gte: moment(from).format(),
          $lt: moment(to).format(),
        },
      },
    ],
  };

  let entries = await COA.find(findCond).populate({
    path: "product",
    select: ["name"],
    populate: { path: "product_type", select: { name: 1 } },
  });
  entries = [...new Set(entries.map((entry) => entry.product))];

  for (let entry of entries) {
    const totalEntries = await COA.countDocuments({
      product: entry._id,
      created_at: {
        $gte: moment(from).format(),
        $lt: moment(to).format(),
      },
    });
    //calculating ratings-------------------------------
    const product_detail = await Diary.find({ product: entry._id }).select([
      "average_ratings",
      "pre_symptoms",
      "desired_effects",
    ]);

    product_detail.map((pro) => {
      if (pro.average_ratings) {
        return (total_rating = total_rating + parseInt(pro.average_ratings));
      }
    });
    const average_rating = total_rating / product_detail.length;
    //-----------------------------------------------

    //calculating objective

    product_detail.map((pro) => {
      if (pro.desired_effects.length)
        pro.desired_effects.map((e) => {
          objectives.push(e.effect_id);
        });

      return objectives;
    });
    const get_top_objective = this.findTopElement(objectives);
    const objective = await Effects.findById(get_top_objective);
    //----------------------------------------------------------

    //calculating reason
    product_detail.map((pro) => {
      if (pro.pre_symptoms.length)
        pro.pre_symptoms.map((e) => {
          reasons.push(e.symptom_id);
        });

      return reasons;
    });
    const get_top_reason = this.findTopElement(reasons);
    const reason = await Symptoms.findById(get_top_reason);
    //------------------------------------------------------------
    const obj = {
      totalEntries,
      average_rating,
      objective: objective.name,
      reason: reason.name,
      product_name: entry.name,
      category_name: entry.product_type.name,
    };
    final_arr.push(obj);
  }

  res.send({
    success: true,
    message: "Your categories list",
    categories: final_arr,
  });
});

exports.getTopActivities = asyncHandler(async (req, res, next) => {
  const { from, to } = req.query;
  let findCond = {
    $and: [
      { is_deleted: 0 },
      {
        created_at: {
          $gte: moment(from).format(),
          $lt: moment(to).format(),
        },
      },
    ],
  };
  let array = [];
  const activities = await User.find(findCond).select("activities");
  activities.map((act) => {
    if (act.activities.length)
      act.activities.map((a) => {
        array.push(a.activity_id);
      });

    return array;
  });
  const get_top_activities = this.findTopFiveElement(array);
  let activities_array = [];

  for (let activity of get_top_activities) {
    let total_rating = 0;
    const top_category_arr = [];

    //finding activities
    const act = await Activities.findById(activity);

    //calcualtion entries in diary table
    const entries = await Diary.countDocuments({
      pre_activities: { $elemMatch: { activity_id: activity } },
    });

    //calculation product related to activity
    const product = await Diary.countDocuments({
      pre_activities: { $elemMatch: { activity_id: activity } },
    }).distinct("product");

    //calculation ratings
    const rating = await Diary.find({
      pre_activities: { $elemMatch: { activity_id: activity } },
    }).select("average_ratings");

    rating.map((r) => {
      if (r.average_ratings)
        return (total_rating = total_rating + parseInt(r.average_ratings));
    });

    const average_rating = total_rating / rating.length;

    // calculating average age
    let age_arr = [];
    let total_age = 0;
    let age = await User.find({
      activities: { $elemMatch: { activity_id: activity } },
    }).select("dob");

    //converting into number from dob
    age.map((a) => {
      return age_arr.push(moment(a.dob).fromNow(true));
    });

    age_arr.map((ag) => {
      const get_number = ag.replace("years", "");
      total_age = total_age + parseInt(get_number);
    });
    const average_age = total_age / age_arr.length;

    // getting categories
    const product_arr = [];
    const category_arr = [];
    const products = await Diary.find({
      pre_activities: { $elemMatch: { activity_id: activity } },
    }).select("product");

    products.map((p) => {
      return product_arr.push(p.product);
    });
    const top_products = this.findTopFiveElement(product_arr);

    for (let product of top_products) {
      const category = await Diary.findOne({ product }).populate({
        path: "product",
        select: ["name"],
        populate: { path: "product_type", select: { name: 1 } },
      });

      const count = await Diary.countDocuments({ product });

      const category_name = category.product.product_type
        ? category.product.product_type.name
        : "";

      category_arr.push({ name: category_name, entries: count });
    }
    //------------------------------
    activities_array.push({
      name: act.name,
      entries,
      categories: category_arr,
      product: product.length,
      average_rating,
      average_age,
    });
  }

  res.send({
    success: true,
    message: "Your activities list",
    activities_array,
  });
});

exports.getTopHealthConditions = asyncHandler(async (req, res, next) => {
  const { from, to } = req.query;
  let findCond = {
    $and: [
      { is_deleted: 0 },
      {
        created_at: {
          $gte: moment(from).format(),
          $lt: moment(to).format(),
        },
      },
    ],
  };
  let array = [];
  const conditions = await User.find(findCond).select("conditions");
  conditions.map((cond) => {
    if (cond.conditions.length)
      cond.conditions.map((a) => {
        array.push(a.condition_id);
      });

    return array;
  });
  const get_top_conditions = this.findTopFiveElement(array);
  let conditions_array = [];

  for (let condition of get_top_conditions) {
    let total_rating = 0;

    //finding condition
    const cond = await Conditions.findById(condition);

    //calcualtion entries in diary table
    const entries = await Diary.countDocuments({
      pre_condition: { $elemMatch: { condition_id: condition } },
    });

    //calculation product related to condition
    const product = await Diary.countDocuments({
      pre_condition: { $elemMatch: { condition_id: condition } },
    }).distinct("product");

    //calculation ratings
    const rating = await Diary.find({
      pre_condition: { $elemMatch: { condition_id: condition } },
    }).select("average_ratings");

    rating.map((r) => {
      if (r.average_ratings)
        return (total_rating = total_rating + parseInt(r.average_ratings));
    });

    const average_rating = total_rating / rating.length;

    // calculating average age
    let age_arr = [];
    let total_age = 0;
    let age = await User.find({
      conditions: { $elemMatch: { condition_id: condition } },
    }).select("dob");

    //converting into number from dob
    age.map((a) => {
      return age_arr.push(moment(a.dob).fromNow(true));
    });

    age_arr.map((ag) => {
      const get_number = ag.replace("years", "");
      total_age = total_age + parseInt(get_number);
    });
    const average_age = total_age / age_arr.length;
    //categories
    const product_arr = [];
    const category_arr = [];
    const products = await Diary.find({
      pre_condition: { $elemMatch: { condition_id: condition } },
    }).select("product");

    products.map((p) => {
      return product_arr.push(p.product);
    });
    const top_products = this.findTopFiveElement(product_arr);

    for (let product of top_products) {
      const category = await Diary.findOne({ product }).populate({
        path: "product",
        select: ["name"],
        populate: { path: "product_type", select: { name: 1 } },
      });
      console.log({ category });
      const count = await Diary.countDocuments({ product });

      const category_name = category.product.product_type
        ? category.product.product_type.name
        : "";

      category_arr.push({ name: category_name, entries: count });
      console.log(category_arr);
    }
    //----------------------------------------------------------
    conditions_array.push({
      name: cond.name,
      entries,
      categories: category_arr,
      product: product.length,
      average_rating,
      average_age,
    });
  }
  res.send({
    success: true,
    message: "Your condition list",
    conditions_array,
  });
});

exports.getTopEffects = asyncHandler(async (req, res, next) => {
  const { from, to } = req.query;
  let findCond = {
    $and: [
      { is_deleted: 0 },
      {
        created_at: {
          $gte: moment(from).format(),
          $lt: moment(to).format(),
        },
      },
    ],
  };
  let array = [];
  const effects = await User.find(findCond).select("effects");
  effects.map((eff) => {
    if (eff.effects.length)
      eff.effects.map((a) => {
        array.push(a.effect_id);
      });

    return array;
  });
  const get_top_effects = this.findTopFiveElement(array);
  let effects_array = [];

  for (let effect of get_top_effects) {
    let total_rating = 0;

    //finding efffects
    const eff = await Effects.findById(effect);

    //calcualtion entries in diary table
    const entries = await Diary.countDocuments({
      desired_effects: { $elemMatch: { effect_id: effect } },
    });

    //calculation product related to efffects
    const product = await Diary.countDocuments({
      desired_effects: { $elemMatch: { effect_id: effect } },
    }).distinct("product");

    //calculation ratings
    const rating = await Diary.find({
      desired_effects: { $elemMatch: { effect_id: effect } },
    }).select("average_ratings");

    rating.map((r) => {
      if (r.average_ratings)
        return (total_rating = total_rating + parseInt(r.average_ratings));
    });

    const average_rating = total_rating / rating.length;

    // calculating average age
    let age_arr = [];
    let total_age = 0;
    let age = await User.find({
      effects: { $elemMatch: { effect_id: effect } },
    }).select("dob");

    //converting into number from dob
    age.map((a) => {
      return age_arr.push(moment(a.dob).fromNow(true));
    });

    age_arr.map((ag) => {
      const get_number = ag.replace("years", "");
      total_age = total_age + parseInt(get_number);
    });
    const average_age = total_age / age_arr.length;
    //categories
    const product_arr = [];
    const category_arr = [];
    const products = await Diary.find({
      desired_effects: { $elemMatch: { effect_id: effect } },
    }).select("product");

    products.map((p) => {
      return product_arr.push(p.product);
    });
    const top_products = this.findTopFiveElement(product_arr);

    for (let product of top_products) {
      const category = await Diary.findOne({ product }).populate({
        path: "product",
        select: ["name"],
        populate: { path: "product_type", select: { name: 1 } },
      });

      const count = await Diary.countDocuments({ product });

      const category_name = category.product.product_type
        ? category.product.product_type.name
        : "";

      category_arr.push({ name: category_name, entries: count });
    }
    //---------------------------------
    effects_array.push({
      name: eff.name,
      entries,
      categories: category_arr,
      product: product.length,
      average_rating,
      average_age,
    });
  }
  res.send({
    success: true,
    message: "Your effects list",
    effects_array,
  });
});

exports.getTopSymptoms = asyncHandler(async (req, res, next) => {
  const { from, to } = req.query;
  let findCond = {
    $and: [
      { is_deleted: 0 },
      {
        created_at: {
          $gte: moment(from).format(),
          $lt: moment(to).format(),
        },
      },
    ],
  };
  let array = [];
  // const symptoms = await User.find(findCond).select("symptoms");
  // symptoms.map((symp) => {
  //   if (symp.symptoms.length)
  //     symp.symptoms.map((a) => {
  //       array.push(a.symptom_id);
  //     });
  //   return array;
  // });
  const symptoms = await Symptoms.find().select("_id");

  for (const symp of symptoms) {
    const product = await Diary.countDocuments({
      pre_symptoms: { $elemMatch: { symptom_id: symp._id } },
    });
    array = [...array, { id: symp._id, count: product }];
  }
  array.sort((a, b) => {
    return b.count - a.count;
  });
  const first_five = array.slice(0, 5);
  let top_symptoms = [];
  first_five.map((symp) => {
    top_symptoms.push(symp.id);
  });
  // const get_top_symptoms = this.findTopFiveElement(syptoms_array);
  let symptoms_array = [];

  for (let symptom of top_symptoms) {
    let total_rating = 0;

    //finding efffects
    const symp = await Symptoms.findById(symptom);

    //calcualtion entries in diary table
    const entries = await Diary.countDocuments({
      pre_symptoms: { $elemMatch: { symptom_id: symptom } },
    });

    //calculation product related to efffects
    const product = await Diary.countDocuments({
      pre_symptoms: { $elemMatch: { symptom_id: symptom } },
    }).distinct("product");

    //calculation ratings
    const rating = await Diary.find({
      pre_symptoms: { $elemMatch: { symptom_id: symptom } },
    }).select("average_ratings");

    rating.map((r) => {
      if (r.average_ratings)
        return (total_rating = total_rating + parseInt(r.average_ratings));
    });

    const average_rating = total_rating / rating.length;

    // calculating average age
    let age_arr = [];
    let total_age = 0;
    let age = await User.find({
      symtoms: { $elemMatch: { symptom_id: symptom } },
    }).select("dob");

    //converting into number from dob
    age.map((a) => {
      return age_arr.push(moment(a.dob).fromNow(true));
    });

    age_arr.map((ag) => {
      const get_number = ag.replace("years", "");
      total_age = total_age + parseInt(get_number);
    });
    const average_age = total_age / age_arr.length;

    //categories
    const product_arr = [];
    const category_arr = [];
    const products = await Diary.find({
      pre_symptoms: { $elemMatch: { symptom_id: symptom } },
    }).select("product");

    products.map((p) => {
      return product_arr.push(p.product);
    });
    const top_products = this.findTopFiveElement(product_arr);

    for (let product of top_products) {
      const category = await Diary.findOne({ product }).populate({
        path: "product",
        select: ["name"],
        populate: { path: "product_type", select: { name: 1 } },
      });
      const count = await Diary.countDocuments({ product });

      const category_name = category.product.product_type
        ? category.product.product_type.name
        : "";

      category_arr.push({ name: category_name, entries: count });
    }
    //-------------------------------------------------------------------

    symptoms_array.push({
      name: symp.name,
      entries,
      categories: category_arr,
      product: product.length,
      average_rating,
      average_age,
    });
  }
  res.send({
    success: true,
    message: "Your symtoms list",
    symptoms_array,
  });
});

exports.getTopBrands = asyncHandler(async (req, res, next) => {
  let total_rating = 0;
  const objectives = []; //effects
  const reasons = []; //symptoms

  const final_arr = [];
  const brands = await Strains.find({ is_deleted: 0 }).select("name");
  for (const brand of brands) {
    let objective;
    let reason;
    let average_rating;
    // const entries = await COA.countDocuments({ strain: brand });
    // find top product
    const product = await COA.find({ strain: brand }).select("product");
    const products_arr = [];
    product.map((p) => {
      return products_arr.push(p.product);
    });
    const top_product = this.findTopElement(products_arr);
    const entries = await COA.countDocuments({ product: top_product });
    const product_name = await COA.findOne({ product: top_product }).populate({
      path: "product",
      select: ["name"],
    });

    const product_detail = await Diary.find({ product: top_product }).select([
      "average_ratings",
      "pre_symptoms",
      "desired_effects",
    ]);

    if (product_detail.length) {
      product_detail.map((pro) => {
        if (pro.average_ratings) {
          return (total_rating = total_rating + parseInt(pro.average_ratings));
        }
      });
      average_rating = total_rating / product_detail.length;
      //-----------------------------------------------

      //calculating objective
      product_detail.map((pro) => {
        if (pro.desired_effects.length)
          pro.desired_effects.map((e) => {
            objectives.push(e.effect_id);
          });

        return objectives;
      });
      if (objectives.length) {
        const get_top_objective = this.findTopElement(objectives);
        objective = await Effects.findById(get_top_objective);
      }
      //----------------------------------------------------------

      //calculating reason
      product_detail.map((pro) => {
        if (pro.pre_symptoms.length)
          pro.pre_symptoms.map((e) => {
            reasons.push(e.symptom_id);
          });

        return reasons;
      });
      if (reasons.length) {
        const get_top_reason = this.findTopElement(reasons);
        reason = await Symptoms.findById(get_top_reason);
      }
    }
    //------------------------------------------------------------
    const obj = {
      entries,
      average_rating: average_rating ? average_rating : 0,
      objective: objective ? objective.name : "",
      reason: reason ? reason.name : "",
      product_name: product_name.product ? product_name.product.name : "",
      brand_name: brand.name,
    };
    final_arr.push(obj);
  }

  res.send({
    success: true,
    message: "Your brands list",
    brands: final_arr,
  });
});

exports.getConsumer = asyncHandler(async (req, res, next) => {
  const { from, to, gender, state } = req.query;

  const final_arr = [];
  const findCond = {
    $and: [
      { is_deleted: 0 },
      {
        created_at: {
          $gte: moment(from).format(),
          $lt: moment(to).format(),
        },
      },
      {
        gender,
      },
    ],
  };

  const users = await User.find(findCond).select(["_id", "dob"]);
  let product_arr = [];
  let age_arr = [];
  for (let user of users) {
    const product = await Diary.find({ user: user._id }).select("product");
    product_arr = [...product_arr, ...product];
    age_arr.push(moment(user.dob).fromNow(true));
  }
  const product_id_arr = [];
  product_arr.map((pro) => {
    return product_id_arr.push(pro.product);
  });
  const top_products = this.findTopFiveElement(product_id_arr);
  for (let product of top_products) {
    let total_rating = 0;
    const entries = await Diary.countDocuments({ product });
    const rating = await Diary.find({ product }).select("average_ratings");
    rating.map((pro) => {
      if (pro.average_ratings) {
        return (total_rating = total_rating + parseInt(pro.average_ratings));
      }
    });
    const average_rating = total_rating / rating.length;
    const product_detail = await Diary.findOne({ product }).populate({
      path: "product",
      select: ["name"],
      populate: { path: "product_type", select: { name: 1 } },
    });
    const brand = await COA.findOne({ product }).populate({
      path: "strain",
      select: ["name"],
    });

    let effects_arr = [];

    const effects = await Diary.find({
      product,
    }).select("desired_effects");

    effects.map((eff) => {
      if (eff.desired_effects.length)
        eff.desired_effects.map((a) => {
          effects_arr.push(a.effect_id);
        });
    });

    const top_effect = this.findTopElement(effects_arr);
    const effect_name = await Effects.findById(top_effect).select("name");
    const total_entries_of_effect = await Diary.countDocuments({
      desired_effects: { $elemMatch: { effect_id: top_effect } },
    });
    console.log(product);
    const obj = {
      purpose: { effect: effect_name.name, entries: total_entries_of_effect },
      age_arr,
      entries,
      average_rating,
      brand: brand ? brand.strain.name : "",
      product_name: product_detail.product ? product_detail.product.name : "",
      category: product_detail.product
        ? product_detail.product.product_type.name
        : "",
    };
    console.log(product);
    final_arr.push(obj);
  }

  res.send({
    success: true,
    message: "Your Male Consumer list",
    consumers: final_arr,
  });
});

exports.getAllState = asyncHandler(async (req, res, next) => {
  const states = await States.find().select(["name", "local_name"]);
  res.send({
    success: true,
    message: "Your states list",
    states,
  });
});

exports.findTopElement = (arr) => {
  let compare = "";
  let mostFreq = "";

  arr.reduce((acc, val) => {
    if (val in acc) {
      // if key already exists
      acc[val]++; // then increment it by 1
    } else {
      acc[val] = 1; // or else create a key with value 1
    }
    if (acc[val] > compare) {
      // if value of that key is greater
      // than the compare value.
      compare = acc[val]; // than make it a new compare value.
      mostFreq = val; // also make that key most frequent.
    }
    return acc;
  }, {});
  return mostFreq;
};

exports.findTopFiveElement = (arr) => {
  const counts = arr.reduce((act, id) => {
    act[id] = (act[id] || 0) + 1;
    return act;
  }, {});
  // Then create a sorted array from the keys

  const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  // Then take the first 5

  const top5 = sorted.slice(0, 5);
  return top5;
};

//@desc get diary entry details
//route GET /api/get-partner-entry-details
//@access Private
exports.getPartnerEntryDetails = asyncHandler(async (req, res, next) => {
  const { entryId } = req.params;
  let findCond = {
    $and: [{ is_active: 1 }, { is_deleted: 0 }, { _id: entryId }],
  };
  const totalEntries = await Diary.countDocuments({});
  const entry = await Diary.findOne(findCond)
    .populate({
      path: "user",
      select: { full_name: 1, gender: 1, dob: 1 },
      populate: { path: "consumption_reason", select: { name: 1 } },
    })
    .populate({
      path: "product",
      select: { name: 1, COA_identifier: 1 },
      populate: { path: "product_type", select: { name: 1 } },
    })
    .populate({
      path: "user_comments",
      // select: { name: 1, COA_identifier: 1 },
      // populate: { path: "product_type", select: { name: 1 } },
    });
  // entry.product.COA_identifier = '1A4060300004E2E000091371'
  const coaData = await COA.findOne({
    coa_no: entry.product.COA_identifier,
  }).select("batch_id producer_name distributor_name tested_at");
  const entryObj = {
    userId: entry.user._id ? entry.user._id : "",
    entry_id: entry._id ? entry._id : "",
    userName: entry.user.full_name ? entry.user.full_name : "",
    product: entry.product.name ? entry.product.name : "",
    product_type: entry.product.product_type
      ? entry.product.product_type.name
      : "",
    average_rating: entry.average_ratings ? entry.average_ratings : "",
    createdAt: entry.created_at,
    gender: entry.user.gender ? entry.user.gender : "-",
    dob: entry.user.dob ? entry.user.dob : "-",
    batch_id: coaData ? coaData.batch_id : "-",
    producer_name: coaData ? coaData.producer_name : "-",
    distributor_name: coaData ? coaData.distributor_name : "-",
    tested_at: coaData ? coaData.tested_at : "",
    consumption_reason: entry.user.consumption_reason
      ? entry.user.consumption_reason.name
      : "-",
    totalEntries,
    isLikeDislike: entry.is_favourite,
    reviews: "",
    negatives: "",
    location: "",
    time: "",
    setting: "",
    is_public: entry.is_public,
    comments: entry.comments,
  };
  res.send({
    success: true,
    message: "Your entry list",
    data: { entryInfo: entryObj },
  });
});
