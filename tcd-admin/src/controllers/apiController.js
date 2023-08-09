const path = require("path");
const randomstring = require("randomstring");
const asyncHandler = require("../middleware/async");
const CommonHelper = require("../utils/commonHelper");
const ResponseHandler = require("../utils/responseHandler");
const NotifyHelper = require("../utils/notifyHelper");
const User = require("../models/usersModel");
const Effect = require("../models/effectModel");
const Cannabinoid = require("../models/cannabinoidModel");
const Physique = require("../models/physiqueModel");
const Activity = require("../models/activityModel");
const Symptom = require("../models/symptomModel");
const Condition = require("../models/conditionModel");
const Mood = require("../models/moodModel");
const Video = require("../models/videoModel");
const Diary = require("../models/userDiaryModel");
const FavouriteEntry = require("../models/favouriteEntriesModel");
const Ratings = require("../models/entryRatingsModel");
const SearchLogs = require("../models/searchLoggingModel");
const Article = require("../models/articleModel");
const Strain = require("../models/strainsModel");
const CMS = require("../models/cmsPageModel");
const Contact = require("../models/contactModel");
const Feedback = require("../models/feedbackModel");
const FaqCategory = require("../models/faqCategoryModel");
const Faq = require("../models/faqModel");
const FavouriteVideo = require("../models/favouriteVideosModel");
const CommunityQuestion = require("../models/communityQuestionsModel");
const ConsumptionMethod = require("../models/cannabisConsumptionMethodsModel");
const COA = require("../models/coaModel");
const ConsumptionNegative = require("../models/consumptionNegativesModel");
const CommunityQuestionCategory = require("../models/communityQuestionsCategoryModel");
const Composition = require("../models/medicineCompositionParametersModel");
const FavouriteCommunityQuestion = require("../models/favouriteCommunityQuestionModel");
const Country = require("../models/countryModel");
const State = require("../models/stateModel");
const Product = require("../models/productModel");
const ProductType = require("../models/productTypeModel");
const ConsumptionFrequency = require("../models/consumptionFrequencyModel");
const ConsumptionReason = require("../models/consumptionReasonModel");
const BannerAdvertisement = require("../models/bannerAdvertisementModel");
const EntryAdditionalInformation = require("../models/entryAdditionalInformationModel");
const Statistic = require("../models/statisticModel");
const ReportSpam = require("../models/reportedCommentsModel");
const ReportVideo = require("../models/reportVideoModel");
const ReportPublicEntries = require("../models/reportPublicEntriesModel");
const ReportQuestion = require("../models/reportQuestionModel");
const ReportReason = require("../models/reportReasonModel");
const UserBlocked = require("../models/userBlockedModel");
const Advertisement = require("../models/partner/advertisementModel")
const COAJobsStatus = require("../models/coaJobsStatusModel");
const SettingsMyEntourage = require("../models/settingsMyEntourageModel");
const ApiCallsLogs = require("../models/apiCallsLogModel");
var publicUploadDir = path.resolve(__dirname, "../../public/uploads/");
var ObjectId = require("mongodb").ObjectId;
const { s3Upload, s3Remove, awsTextTract } = require("../utils/AWS");

const {
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendContactEmail,
  sendFeedbackEmail,
  contactSupportEmail,
  twoFactorMail,
  sendCommunityQuestionMail,
} = require("../utils/mailHelper");

const SMSHelper = require("../utils/smsHelper");

//@desc get all master data here
//route GET /api/get-master-data
//@access Public
exports.getMasterData = asyncHandler(async (req, res, next) => {
  let activities = [];
  let effects = [];
  let symptoms = [];
  let conditions = [];
  let consumptionMethods = [];
  let nagetives = [];
  let countries = [];
  let states = [];
  let cannabis_insights = [];
  //var imagePath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/condition/';
  //var uploadDirPath = req.protocol+'://'+req.get('host')+'/uploads';
  var uploadDirPath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin";
  //let physique = await Physique.find({is_active:1,is_deleted:0})
  let physique = [];
  let cannabinoidList = await Cannabinoid.find({
    is_active: 1,
    is_deleted: 0,
  }).sort({ sort: 1 });
  let cannabinoidLists = await Composition.find({
    is_active: 1,
    is_deleted: 0,
    type: 1,
  });
  let cannabinoidAndTerpenesLists = await Composition.find({
    is_active: 1,
    is_deleted: 0,
    type: 2,
  });
  let moodList = await Mood.find({ is_active: 1, is_deleted: 0 });
  let activityList = await Activity.find({
    is_active: 1,
    is_deleted: 0,
    type: 2,
  })
    .select({ name: 1, image: 1, icon: 1 })
    .sort({ sort_order: 1 });
  let methods = await ConsumptionMethod.find({
    type: 2,
    is_active: 1,
    is_deleted: 0,
  }).sort({ sort_order: 1 });
  let conditionList = await Condition.find({
    is_active: 1,
    is_deleted: 0,
  }).sort({ sort_order: 1 });
  if (activityList.length > 0) {
    for (var i = 0; i < activityList.length; i++) {
      activities.push({
        _id: activityList[i]._id,
        name: activityList[i].name,
        image: activityList[i].image
          ? uploadDirPath + "/activity/" + activityList[i].image
          : "",
        icon: activityList[i].icon
          ? uploadDirPath + "/activity/" + activityList[i].icon
          : "",
      });
    }
  }
  let symptomList = await Symptom.find({ is_active: 1, is_deleted: 0, type: 2 })
    .select({ name: 1, image: 1, icon: 1 })
    .sort({ name: 1 });
  if (symptomList.length > 0) {
    for (var i = 0; i < symptomList.length; i++) {
      symptoms.push({
        _id: symptomList[i]._id,
        name: symptomList[i].name,
        image: symptomList[i].image
          ? uploadDirPath + "/symptom/" + symptomList[i].image
          : "",
        icon: symptomList[i].icon
          ? uploadDirPath + "/symptom/" + symptomList[i].icon
          : "",
      });
    }
  }
  let effectList = await Effect.find({ is_active: 1, is_deleted: 0, type: 2 })
    .select({ name: 1, image: 1, icon: 1 })
    .sort({ name: 1 });
  if (effectList.length > 0) {
    for (var i = 0; i < effectList.length; i++) {
      effects.push({
        _id: effectList[i]._id,
        name: effectList[i].name,
        image: effectList[i].image
          ? uploadDirPath + "/effect/" + effectList[i].image
          : "",
        icon: effectList[i].icon
          ? uploadDirPath + "/effect/" + effectList[i].icon
          : "",
      });
    }
  }
  if (conditionList.length > 0) {
    for (var i = 0; i < conditionList.length; i++) {
      conditions.push({
        _id: conditionList[i]._id,
        name: conditionList[i].name,
        image: conditionList[i].image
          ? uploadDirPath + "/condition/" + conditionList[i].image
          : "",
        icon: conditionList[i].icon
          ? uploadDirPath + "/condition/" + conditionList[i].icon
          : "",
      });
    }
  }
  if (methods.length > 0) {
    var imagePath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/methods/";
    for (var i = 0; i < methods.length; i++) {
      let measurementScale = [];
      if (methods[i].measurement_scales.length > 0) {
        for (var s = 0; s < methods[i].measurement_scales.length; s++) {
          measurementScale.push(methods[i].measurement_scales[s].scale);
        }
      }
      consumptionMethods.push({
        _id: methods[i]._id,
        name: methods[i].name,
        icon: methods[i].icon ? imagePath + methods[i].icon : "",
        measurement_unit: methods[i].measurement_unit,
        measurement_scales: measurementScale,
      });
    }
  }
  countries = await Country.find({ is_deleted: 0, is_active: 1 })
    .select({ name: 1 })
    .sort({ name: 1 });
  let stateFindCond = { is_deleted: 0, is_active: 1 };
  if (req.query.country_id) {
    stateFindCond.country = req.query.country_id;
  }
  states = await State.find(stateFindCond)
    .select({ name: 1 })
    .sort({ name: 1 });
  let cNegatives = await ConsumptionNegative.find({
    is_active: 1,
    is_deleted: 0,
  })
    .select({ name: 1 })
    .sort({ name: 1 });
  //let consumptions = ['Daily','Medicinal','New','Occasionally','Socially']
  let cannabis_consumption = await ConsumptionFrequency.find({
    is_deleted: 0,
    is_active: 1,
  })
    .select({ name: 1 })
    .sort({ name: 1 });
  let consumption_reason = await ConsumptionReason.find({
    is_deleted: 0,
    is_active: 1,
  })
    .select({ name: 1 })
    .sort({ name: 1 });

  let genderList = ["Female", "Male", "Others", "Rather not say"];
  let genders = [];
  for (var index in genderList) {
    genders.push({ name: genderList[index] });
  }
  let consumptionTimeList = ["Morning", "Afternoon", "Evening", "Late Night"];
  let consumption_time = [];
  for (var index in consumptionTimeList) {
    consumption_time.push({ name: consumptionTimeList[index] });
  }
  let consumptionPlaceList = ["Home", "Friend", "Out", "Social"];
  let consumption_place = [];
  for (var index in consumptionPlaceList) {
    consumption_place.push({ name: consumptionPlaceList[index] });
  }
  let consumptionPartnerList = ["Alone", "Partner", "Friend", "Group"];
  let consumption_partner = [];
  for (var index in consumptionPartnerList) {
    consumption_partner.push({ name: consumptionPartnerList[index] });
  }
  let strainList = await Strain.find({ is_active: 1, is_deleted: 0 })
    .select({ name: 1 })
    .sort({ name: 1 });
  let communityQuestionCategories = await CommunityQuestionCategory.find({
    is_active: 1,
    is_deleted: 0,
  })
    .select({ name: 1 })
    .sort({ name: 1 });

  let areaList = [
    "Cannabis Insignt",
    "Community",
    "Data Insight",
    "Diary",
    "Entourage Profile",
    "Entry Summary",
    "FAQ",
    "New Entry",
    "Other",
    "Profile",
    "Recommendations",
    "Settings",
  ];
  let improvementArea = [];
  for (var index in areaList) {
    improvementArea.push({ name: areaList[index] });
  }
  cannabis_insights.push({
    id: '31',
    name: 'Cannabinoids',
    icon: uploadDirPath+'/cannabis_insights/cannabinoids.svg'
  },{
    id: '32',
    name: 'Terpenes',
    icon: uploadDirPath+'/cannabis_insights/terpenes.svg'
  },{
    id: '33',
    name: 'Endocannabinodis System',
    icon: uploadDirPath+'/cannabis_insights/ECS.svg'
  },{
    id: '34',
    name: 'Entourage Effect',
    icon: uploadDirPath+'/cannabis_insights/entourage effect.svg'
  },{
    id: '35',
    name: 'Videos',
    icon: uploadDirPath+'/cannabis_insights/videos.svg'
  },{
    id: '36',
    name: 'Articles',
    icon: uploadDirPath+'/cannabis_insights/articles.svg'
  },{
    id: '37',
    name: 'Glossary',
    icon: uploadDirPath+'/cannabis_insights/glossary.svg'
  });

  let topicList = [
    "General Feedback",
    "Cannabis Insight",
    "Community",
    "Diary",
    "Entourage Profile",
    "Entry Summary",
    "Legal",
    "New Entry",
    "Other",
    "Profile",
    "Recommendations",
    "Settings",
  ];
  let support_topics = [];
  for (var index in topicList) {
    support_topics.push({ name: topicList[index] });
  }

  let wScaleList = ["lb", "kg"];
  let weightScales = [];
  for (var index in wScaleList) {
    weightScales.push({ name: wScaleList[index] });
  }

  let hScaleList = ["ft", "cm"];
  let heightScales = [];
  for (var index in hScaleList) {
    heightScales.push({ name: hScaleList[index] });
  }

  let activityLevel = [
    "Not active",
    "Slightly Active",
    "Somewhat active",
    "Quite active",
    "Very active",
  ];
  let activity_level = [];
  for (var index in activityLevel) {
    activity_level.push({ name: activityLevel[index] });
  }

  let myEntourage = await SettingsMyEntourage.find({ is_deleted: 0 }).select({
    _id: 1,
    entourage_name: 1,
    max_selection: 1,
    image: 1,
  });
  let settingsEntourage = [];
  for (var l = 0; l < myEntourage.length; l++) {
    settingsEntourage.push({
      id: myEntourage[l]._id,
      name: myEntourage[l].entourage_name,
      image:
        "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/entourage//" +
        myEntourage[l].image,
      description: myEntourage[l].description,
      max_selection: myEntourage[l].max_selection,
    });
  }


  let settings = settingsEntourage;
  let dataResponse = {
    symptoms,
    physique,
    activities,
    effect_list: effects,
    conditions,
    cannabinoid_list: cannabinoidLists,
    cannabinoid_and_terpenes: cannabinoidAndTerpenesLists,
    mood_list: moodList,
    strains: strainList,
    cannabis_consumption,
    consumption_reason,
    genders,
    consumption_methods: consumptionMethods,
    negatives: cNegatives,
    consumption_time,
    consumption_place,
    consumption_partner,
    community_question_categories: communityQuestionCategories,
    area_of_improvement: improvementArea,
    support_topics,
    weight_scales: weightScales,
    height_scales: heightScales,
    activity_level,
    settings,
    states,
    countries,
    cannabis_insights: cannabis_insights,
  };

  let userId = (req.user) ? req.user._id: null;

  let resultResponse = await ResponseHandler.responseHandler('/api/get-master-data', req.body, dataResponse, userId);

  res.send(resultResponse);
});

//@desc get list of states
//route GET /api/get-statelist
//@access Public
exports.getStateList = asyncHandler(async (req, res, next) => {
  let stateFindCond = { is_deleted: 0, is_active: 1 };
  if (req.query.country_id) {
    stateFindCond.country = req.query.country_id;
  }
  states = await State.find(stateFindCond)
    .select({ name: 1 })
    .sort({ name: 1 });
  let dataResponse = { states };
  let userId = (req.user) ? req.user._id: null;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-statelist', request, dataResponse, userId);
  res.send(resultResponse);

  //res.send({ success: true, message: "", data: { states } });
});

//@desc get product types listed with tcd
//route GET /api/product-types
//@access Public
exports.getProductTypes = asyncHandler(async (req, res, next) => {
  if (req.query.parent_id) {
    let prdFindCond = { is_deleted: 0, is_active: 1, type: 2 };
    if (req.query.parent_id) {
      prdFindCond.parent_id = req.query.parent_id;
    }
    let types = await ProductType.find(prdFindCond)
      .select({ name: 1 })
      .sort({ name: 1 });
      let dataResponse = { types };
      let userId = (req.user) ? req.user._id: null;
      let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
      let resultResponse = await ResponseHandler.responseHandler('/api/product-types', request, dataResponse, userId);
      return res.send(resultResponse);
      //return res.send({ success: true, message: "", data: { types } });
  }

  let findParentTypeCondition = { is_deleted: 0, is_active: 1, type: 1 };
  let parent_types = await ProductType.find(findParentTypeCondition)
    .select({ name: 1 })
    .sort({ name: 1 });
    let dataResponse = { parent_types };
    let userId = (req.user) ? req.user._id: null;
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    let resultResponse = await ResponseHandler.responseHandler('/api/product-types', request, dataResponse, userId);
    res.send(resultResponse);
    //res.send({ success: true, message: "", data: { parent_types } });
});

//@desc get consumption methods listed with tcd
//route GET /api/get-consumption-methods
//@access Public
exports.getConsumptionMethods = asyncHandler(async (req, res, next) => {
  let consumptionMethods = [];
  let findCond = { type: 2, is_active: 1, is_deleted: 0 };
  if (req.query.category_id) {
    findCond.parent_method_id = req.query.category_id;
  }
  let methods = await ConsumptionMethod.find(findCond);
  if (methods.length > 0) {
    var imagePath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/methods/";
    for (var i = 0; i < methods.length; i++) {
      let subcategories = [];
      let subcategoryList = await ConsumptionMethod.find({
        parent_method_id: methods[i]._id,
        is_deleted: 0,
        is_active: 1,
      });
      if (subcategoryList.length > 0) {
        for (var sc = 0; sc < subcategoryList.length; sc++) {
          let subcatgMeasurementScale = [];
          if (subcategoryList[sc].measurement_scales.length > 0) {
            for (
              var s = 0;
              s < subcategoryList[sc].measurement_scales.length;
              s++
            ) {
              subcatgMeasurementScale.push(
                subcategoryList[sc].measurement_scales[s].scale
              );
            }
          }
          subcategories.push({
            _id: subcategoryList[sc]._id,
            name: subcategoryList[sc].name,
            icon: subcategoryList[sc].icon
              ? imagePath + subcategoryList[sc].icon
              : "",
            measurement_unit: subcategoryList[sc].measurement_unit,
            measurement_scales: subcatgMeasurementScale,
          });
        }
      }
      let measurementScale = [];
      if (methods[i].measurement_scales.length > 0) {
        for (var s = 0; s < methods[i].measurement_scales.length; s++) {
          measurementScale.push(methods[i].measurement_scales[s].scale);
        }
      }
      consumptionMethods.push({
        _id: methods[i]._id,
        name: methods[i].name,
        icon: methods[i].icon ? imagePath + methods[i].icon : "",
        measurement_unit: methods[i].measurement_unit,
        measurement_scales: measurementScale,
        subcategories,
      });
    }
  }
  let dataResponse = { consumption_methods: consumptionMethods };
  let userId = (req.user) ? req.user._id: null;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-consumption-methods', request, dataResponse, userId);
  res.send(resultResponse);
  /*res.send({
    success: true,
    message: "",
    data: { consumption_methods: consumptionMethods },
  });*/
});

//@desc get entry additional information with tcd
//route GET /api/get-entry-additional-information
//@access Public
exports.getEntryAdditionalInformation = asyncHandler(async (req, res, next) => {
  let yesNoQuestion = ["Yes", "No"];
  let consumptionMethods = [];
  let findCond = { type: 2, is_active: 1, is_deleted: 0 };
  if (req.query.category_id) {
    findCond.parent_method_id = req.query.category_id;
  }
  let methods = await ConsumptionMethod.find(findCond);
  if (methods.length > 0) {
    var imagePath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/methods/";
    for (var i = 0; i < methods.length; i++) {
      let subcategories = [];
      let subcategoryList = await ConsumptionMethod.find({
        parent_method_id: methods[i]._id,
        is_deleted: 0,
        is_active: 1,
      });
      if (subcategoryList.length > 0) {
        for (var sc = 0; sc < subcategoryList.length; sc++) {
          let subcatgMeasurementScale = [];
          if (subcategoryList[sc].measurement_scales.length > 0) {
            for (
              var s = 0;
              s < subcategoryList[sc].measurement_scales.length;
              s++
            ) {
              subcatgMeasurementScale.push(
                subcategoryList[sc].measurement_scales[s].scale
              );
            }
          }
          subcategories.push({
            _id: subcategoryList[sc]._id,
            name: subcategoryList[sc].name,
            icon: subcategoryList[sc].icon
              ? imagePath + subcategoryList[sc].icon
              : "",
            measurement_unit: subcategoryList[sc].measurement_unit,
            measurement_scales: subcatgMeasurementScale,
          });
        }
      }
      let measurementScale = [];
      if (methods[i].measurement_scales.length > 0) {
        for (var s = 0; s < methods[i].measurement_scales.length; s++) {
          measurementScale.push(methods[i].measurement_scales[s].scale);
        }
      }
      consumptionMethods.push({
        _id: methods[i]._id,
        name: methods[i].name,
        icon: methods[i].icon ? imagePath + methods[i].icon : "",
        measurement_unit: methods[i].measurement_unit,
        measurement_scales: measurementScale,
        subcategories,
      });
    }
  }
  let moodList = await Mood.find({ is_active: 1, is_deleted: 0 });
  let genderList = ["Female", "Male", "Others", "Rather not say"];
  let genders = [];
  for (var index in genderList) {
    genders.push({ name: genderList[index] });
  }
  let consumptionTimeList = ["Morning", "Afternoon", "Evening", "Late Night"];
  let consumption_time = [];
  for (var index in consumptionTimeList) {
    consumption_time.push({ name: consumptionTimeList[index] });
  }
  let consumptionPlaceList = ["Home", "Friend", "Out", "Social"];
  let consumption_place = [];
  for (var index in consumptionPlaceList) {
    consumption_place.push({ name: consumptionPlaceList[index] });
  }
  let consumptionPartnerList = ["Alone", "Partner", "Friend", "Group"];
  let consumption_partner = [];
  for (var index in consumptionPartnerList) {
    consumption_partner.push({ name: consumptionPartnerList[index] });
  }

  let listOfQuestions = [
    {
      question: "Do you plan to consume now?",
      answer: yesNoQuestion,
      parameter: "consume_now",
      type: "String",
    },
    {
      question: "How will you consume?",
      answer: consumptionMethods,
      parameter: "consumption_method",
      type: "ID",
    },
    {
      question: "What is your current mood?",
      answer: moodList,
      parameter: "mood_before_consumption",
      type: "ID",
    },
    {
      question: "Have you eaten anything recently?",
      answer: yesNoQuestion,
      parameter: "eat_before_consumption",
      type: "String",
    },
    {
      question: "Where will you consume?",
      answer: consumption_place,
      parameter: "consumption_place",
      type: "String",
    },
    {
      question: "Did you consume cannabis earlier today?",
      answer: yesNoQuestion,
      parameter: "consume_cannabis_before",
      type: "String",
    },
    {
      question: "Who will you consume with?",
      answer: consumption_partner,
      parameter: "consumption_partner",
      type: "String",
    },
    /*{
      question: "Select the time when you have consumed?",
      answer: consumption_time,
      parameter: "consumption_time",
      type: "String",
    },*/
  ];
  let dataResponse = { listOfQuestions };
  let userId = (req.user) ? req.user._id: null;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-entry-additional-information', request, dataResponse, userId);
  res.send(resultResponse);
  //let additionalInformation = await EntryAdditionalInformation.find(findCond)
  ///res.send({ success: true, message: "", data: { listOfQuestions } });
});

//@desc register a new user
//route POST /api/signup
//@access Public
exports.signup = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return res.send({ success: false, message: "Please provide email" });
  }
  if (!req.body.password) {
    return res.send({ success: false, message: "Please provide password" });
  }
  if (!req.body.dob) {
    return res.send({
      success: false,
      message: "Please provide date of birth",
    });
  }
  /*if(!req.body.contact_no){
        return res.send({success:false,message:"Please provide contact no"})
    }*/
  /*if(!req.body.state){
        return res.send({success:false,message:"Please provide state"})
    }*/
  /*if(!req.body.country){
        return res.send({success:false,message:"Please provide country"})
    }
    if(!req.body.activity_level){
        return res.send({success:false,message:"Please provide activity level"})
    }*/
  let checkUserEmail = await User.findOne({
    email: req.body.email,
    is_deleted: 0,
  });
  if (checkUserEmail) {
    return res.send({
      success: false,
      status: 0,
      message: "Email already exist",
    });
  }
  let user = new User({
    full_name: req.body.full_name ? req.body.full_name : "",
    email: req.body.email,
    password: req.body.password,
    contact_no: req.body.contact_no ? req.body.contact_no : "",
    gender: req.body.gender ? req.body.gender : "",
    dob: req.body.dob ? new Date(req.body.dob) : "",
    user_type: 2,
    device_type: req.body.device_type,
    is_active: 1,
  });
  if (req.body.state) {
    user.state = req.body.state;
  }
  if (req.body.country) {
    user.country = req.body.country;
  }
  if (req.body.zipcode) {
    user.zipcode = req.body.zipcode;
  }
  if (req.body.device_push_key) {
    user.device_push_key = req.body.device_push_key;
  }
  if (req.body.device_id) {
    var deviceId = req.body.device_id;
    user.device_ids.push({ device_id: deviceId });
  }
  if (req.body.cannabis_consumption) {
    user.cannabis_consumption = req.body.cannabis_consumption;
  }
  if (req.body.consumption_reason) {
    user.consumption_reason = req.body.consumption_reason;
  }
  if (req.body.physique) {
    user.physique = req.body.physique;
  }
  if (req.body.activity_level) {
    user.activity_level = req.body.activity_level;
  }
  if (req.body.height) {
    user.height = req.body.height;
  }
  if (req.body.height_scale) {
    user.height_scale = req.body.height_scale;
  }
  if (req.body.weight) {
    user.weight = req.body.weight;
  }
  if (req.body.weight_scale) {
    user.weight_scale = req.body.weight_scale;
  }
  if (req.body.symptoms) {
    let symptomInputs = req.body.symptoms;
    if (symptomInputs.length > 0) {
      for (var s = 0; s < symptomInputs.length; s++) {
        user.symptoms.push({ symptom_id: symptomInputs[s].symptom_id });
      }
    }
  }
  if (req.body.effects) {
    let effectInputs = req.body.effects;
    if (effectInputs.length > 0) {
      for (var s = 0; s < effectInputs.length; s++) {
        user.effects.push({ effect_id: effectInputs[s].effect_id });
      }
    }
  }
  if (req.body.activities) {
    let activityInputs = req.body.activities;
    if (activityInputs.length > 0) {
      for (var s = 0; s < activityInputs.length; s++) {
        user.activities.push({ activity_id: activityInputs[s].activity_id });
      }
    }
  }
  if (req.body.conditions) {
    let conditionInputs = req.body.conditions;
    if (conditionInputs.length > 0) {
      for (var s = 0; s < conditionInputs.length; s++) {
        user.conditions.push({ condition_id: conditionInputs[s].condition_id });
      }
    }
  }
  if (req.body.favourite_strains) {
    user.favourite_strains = req.body.favourite_strains;
  }
  if (req.body.cannabinoids) {
    let cannabinoInputs = req.body.cannabinoids;
    if (cannabinoInputs.length > 0) {
      for (var s = 0; s < cannabinoInputs.length; s++) {
        user.cannabinoids.push({
          cannabinoid_id: cannabinoInputs[s].cannabinoid_id,
        });
      }
    }
  }
  await user.save();
  const token = await user.generateAuthToken();
  let userInfo = await User.findById(user._id)
    .populate({
      path: "state",
      select: { name: 1 },
      populate: { path: "country", select: { name: 1 } },
    })
    .populate({
      path: "cannabis_consumption",
      select: { name: 1 },
    })
    .populate({
      path: "physique",
      select: { name: 1 },
    })
    .populate({
      path: "favourite_strains",
      select: { name: 1 },
    })
    .populate({
      path: "effects.effect_id",
      select: { name: 1 },
    })
    .populate({
      path: "symptoms.symptom_id",
      select: { name: 1 },
    })
    .populate({
      path: "activities.activity_id",
      select: { name: 1 },
    })
    .populate({
      path: "conditions.condition_id",
      select: { name: 1 },
    })
    .populate({
      path: "cannabinoids.cannabinoid_id",
      select: { name: 1 },
    })
    .populate({
      path: "consumption_reason",
      select: { name: 1 },
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
      favourite_strains: 1,
      is_active: 1,
      height: 1,
      height_scale: 1,
      weight: 1,
      weight_scale: 1,
      activity_level: 1,
      show_tutorial_flag: 1,
    });
  var userDetails = userInfo.toObject();
  userDetails.profile_image = userInfo.profile_image
    ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
      userInfo.profile_image
    : "";
  if (userInfo.dob) {
    userDetails.dob = CommonHelper.formatedDate(userInfo.dob, 7);
  }
  if (userInfo.state) {
    userDetails.state = userInfo.state._id;
    userDetails.state_name = userInfo.state.name;
    userDetails.country = userInfo.state.country._id;
    userDetails.country_name = userInfo.state.country.name;
  }
  if (userDetails.cannabis_consumption) {
    userDetails.cannabis_consumption_id = userInfo.cannabis_consumption._id;
    userDetails.cannabis_consumption = userInfo.cannabis_consumption.name;
  }
  if (userInfo.physique) {
    userDetails.physique_id = userInfo.physique._id;
    userDetails.physique = userInfo.physique.name;
  }
  if (userInfo.height) {
    userDetails.display_height = userInfo.height + " " + userInfo.height_scale;
  }
  if (userInfo.weight) {
    userDetails.display_weight = userInfo.weight + " " + userInfo.weight_scale;
  }
  if (userInfo.favourite_strains) {
    userDetails.favourite_strains_id = userInfo.favourite_strains._id;
    userDetails.favourite_strains = userInfo.favourite_strains.name;
  }
  if (userInfo.consumption_reason) {
    userDetails.consumption_reason_id = userInfo.consumption_reason._id;
    userDetails.consumption_reason = userInfo.consumption_reason.name;
  }
  if (userDetails.symptoms) {
    let symptoms = [];
    for (var i = 0; i < userDetails.symptoms.length; i++) {
      symptoms.push({
        symptom_id: userDetails.symptoms[i].symptom_id._id,
        symptom_name: userDetails.symptoms[i].symptom_id.name,
      });
    }
    userDetails.symptoms = symptoms;
  }
  if (userDetails.effects) {
    let effects = [];
    for (var i = 0; i < userDetails.effects.length; i++) {
      effects.push({
        effect_id: userDetails.effects[i].effect_id._id,
        effect_name: userDetails.effects[i].effect_id.name,
      });
    }
    userDetails.effects = effects;
  }
  if (userDetails.cannabinoids) {
    let cannabinoids = [];
    for (var i = 0; i < userDetails.cannabinoids.length; i++) {
      cannabinoids.push({
        cannabinoid_id: userDetails.cannabinoids[i].cannabinoid_id._id,
        cannabinoid_name: userDetails.cannabinoids[i].cannabinoid_id.name,
      });
    }
    userDetails.cannabinoids = cannabinoids;
  }
  if (userDetails.activities) {
    let activities = [];
    for (var i = 0; i < userDetails.activities.length; i++) {
      activities.push({
        activity_id: userDetails.activities[i].activity_id._id,
        activity_name: userDetails.activities[i].activity_id.name,
      });
    }
    userDetails.activities = activities;
  }
  if (userDetails.conditions) {
    let conditions = [];
    for (var i = 0; i < userDetails.conditions.length; i++) {
      conditions.push({
        conditions_id: userDetails.conditions[i].condition_id._id,
        conditions_name: userDetails.conditions[i].condition_id.name,
      });
    }
    userDetails.conditions = conditions;
  }
  /**WELCOME EMAIL */
  let emailData = {
    email: userDetails.email,
    name: userDetails.full_name,
    //code:OTP
  };
  sendWelcomeEmail(emailData);

  if (userDetails.contact_no) {
    var contactNO = userDetails.contact_no.replace(/[()\-]/g, "");
    var contact_no = contactNO.replace(/ /g, "");
    SMSHelper.sendSMS(contact_no);
  }
  /**WELCOME EMAIL */
  var has_incomplete_entry = false;
  var entry_id = "";
  let dataResponse = { user: userDetails, token, has_incomplete_entry, entry_id };
  let userId = (req.user) ? req.user._id: null;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let resultResponse = await ResponseHandler.responseHandler('/api/signup', request, dataResponse, userId, "You have registered successfully");
  res.send(resultResponse);
  /*res.send({
    success: true,
    data: { user: userDetails, token, has_incomplete_entry, entry_id },
    message: "You have registered successfully",
  });*/
  //res.status(201).send({success:true,data:{},message:'You have registered successfully and an email verification code has been sent to your registered email'})
});

//@desc login
//route POST /api/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return res.send({ success: false, message: "Please provide email" });
  }
  if (!req.body.password) {
    return res.send({ success: false, message: "Please provide password" });
  }
  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password;
  let user = await User.findByCredentials(email, password);
  var isDeactivated = false;
  if (user.is_active == 4) {
    isDeactivated = true;
    var deactivatedOn = CommonHelper.formatedDate(user.deactivated_at, 7);
    return res.send({
      success: true,
      data: { is_deactivated: isDeactivated, deactivated_on: deactivatedOn },
      message: `You have deactivated your account on ${deactivatedOn} . To use the TCD app, you will need to activate your account again.`,
    });
  }
  if (user.is_active == 0) {
    return res.send({
      success: false,
      data: { is_deactivated: isDeactivated },
      message: "Your account has blocked by administrator",
    });
  }
  if (user.is_active == 3) {
    return res.send({
      success: true,
      data: { is_deactivated: isDeactivated, is_active: user.is_active },
      message: "Please verify your email",
    });
  }
  const token = await user.generateAuthToken();

  user.device_type = req.body.device_type;
  if (req.body.device_push_key != undefined) {
    user.device_push_key = req.body.device_push_key;
  }
  if (req.body.device_id) {
    var deviceId = req.body.device_id;
    //console.log(user.device_ids)
    let existingDeviceIds = [];
    if (user.device_ids.length > 0) {
      for (var d = 0; d < user.device_ids.length; d++) {
        existingDeviceIds.push(user.device_ids[d].device_id);
      }
      var check = existingDeviceIds.includes(deviceId);
      if (check === false) {
        user.device_ids.push({ device_id: deviceId });
      }
    } else {
      user.device_ids.push({ device_id: deviceId });
    }
  }
  /** 2FA*/
  if (user.twoFA_is_on == 1) {
    const OTP = await randomstring.generate({
      length: 6,
      charset: "alphanumeric",
      capitalization: "uppercase",
    });
    let emailData = {
      email: user.email,
      name: user.full_name,
      code: OTP,
    };
    twoFactorMail(emailData);

    if (user.contact_no) {
      var contactNO = user.contact_no.replace(/[()\-]/g, "");
      var contact_no = contactNO.replace(/ /g, "");
      //SMSHelper.sendSMS(contact_no)
    }
    user.twoFA_verification_code = OTP;
  }

  /** 2FA*/
  await user.save();

  let userInfo = await User.findById(user._id)
    .populate({
      path: "state",
      select: { name: 1 },
      populate: { path: "country", select: { name: 1 } },
    })
    .populate({
      path: "cannabis_consumption",
      select: { name: 1 },
    })
    .populate({
      path: "physique",
      select: { name: 1 },
    })
    .populate({
      path: "favourite_strains",
      select: { name: 1 },
    })
    .populate({
      path: "effects.effect_id",
      select: { name: 1 },
    })
    .populate({
      path: "symptoms.symptom_id",
      select: { name: 1 },
    })
    .populate({
      path: "activities.activity_id",
      select: { name: 1 },
    })
    .populate({
      path: "conditions.condition_id",
      select: { name: 1 },
    })
    .populate({
      path: "cannabinoids.cannabinoid_id",
      select: { name: 1 },
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
      cannabis_consumption: 1,
      favourite_strains: 1,
      is_active: 1,
      show_tutorial_flag: 1,
      device_type: 1,
      device_push_key: 1,
      height: 1,
      height_scale: 1,
      weight: 1,
      weight_scale: 1,
      activity_level: 1,
      twoFA_is_on: 1,
    });
  //console.log(userInfo)
  var userDetails = userInfo.toObject();
  userDetails.profile_image = userInfo.profile_image
    ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
      userInfo.profile_image
    : "";
  if (userInfo.dob) {
    userDetails.dob = CommonHelper.formatedDate(userInfo.dob, 7);
  }
  if (userInfo.state) {
    userDetails.state = userInfo.state._id;
    userDetails.state_name = userInfo.state.name;
    userDetails.country = userInfo.state.country._id;
    userDetails.country_name = userInfo.state.country.name;
  }
  userDetails.cannabis_consumption_id = "";
  userDetails.cannabis_consumption = "";
  if (userDetails.cannabis_consumption) {
    userDetails.cannabis_consumption_id = userInfo.cannabis_consumption._id;
    userDetails.cannabis_consumption = userInfo.cannabis_consumption.name;
  }
  userDetails.favourite_strains_id = "";
  userDetails.favourite_strains = "";
  if (userInfo.favourite_strains) {
    userDetails.favourite_strains_id = userInfo.favourite_strains._id;
    userDetails.favourite_strains = userInfo.favourite_strains.name;
  }
  if (userInfo.physique) {
    userDetails.physique_id = userInfo.physique._id;
    userDetails.physique = userInfo.physique.name;
  }
  if (userDetails.symptoms) {
    let symptoms = [];
    for (var i = 0; i < userDetails.symptoms.length; i++) {
      symptoms.push({
        symptom_id: userDetails.symptoms[i].symptom_id._id,
        symptom_name: userDetails.symptoms[i].symptom_id.name,
      });
    }
    userDetails.symptoms = symptoms;
  }
  if (userDetails.effects) {
    let effects = [];
    for (var i = 0; i < userDetails.effects.length; i++) {
      effects.push({
        effect_id: userDetails.effects[i].effect_id._id,
        effect_name: userDetails.effects[i].effect_id.name,
      });
    }
    userDetails.effects = effects;
  }
  if (userDetails.cannabinoids) {
    let cannabinoids = [];
    for (var i = 0; i < userDetails.cannabinoids.length; i++) {
      cannabinoids.push({
        cannabinoid_id: userDetails.cannabinoids[i].cannabinoid_id._id,
        cannabinoid_name: userDetails.cannabinoids[i].cannabinoid_id.name,
      });
    }
    userDetails.cannabinoids = cannabinoids;
  }
  if (userDetails.activities) {
    let activities = [];
    for (var i = 0; i < userDetails.activities.length; i++) {
      activities.push({
        activity_id: userDetails.activities[i].activity_id._id,
        activity_name: userDetails.activities[i].activity_id.name,
      });
    }
    userDetails.activities = activities;
  }
  if (userDetails.conditions) {
    let conditions = [];
    for (var i = 0; i < userDetails.conditions.length; i++) {
      conditions.push({
        conditions_id: userDetails.conditions[i].condition_id._id,
        conditions_name: userDetails.conditions[i].condition_id.name,
      });
    }
    userDetails.conditions = conditions;
  }
  //check incomplete entries
  var has_incomplete_entry = false;
  var entry_id = "";
  let incompleteEntry = await Diary.findOne({
    has_incompleteness_notified: 2,
    is_complete: 2,
    user: userDetails._id,
  });
  if (incompleteEntry) {
    //console.log('has incomplete entry')
    has_incomplete_entry = true;
    entry_id = incompleteEntry._id;
    if (userDetails.device_push_key) {
      NotifyHelper.sendPush(
        userDetails.device_push_key,
        "Please complete your entry",
        "1"
      );
    }
  }

  let dataResponse = { 
    user: userDetails,
    token,
    has_incomplete_entry,
    entry_id,
    is_deactivated: isDeactivated,
   };
  let userId = (req.user) ? req.user._id: null;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let resultResponse = await ResponseHandler.responseHandler('/api/login', request, dataResponse, userId, "You have logged in successfully");
  res.send(resultResponse);

  /*res.send({
    success: true,
    message: "You have logged in successfully",
    data: {
      user: userDetails,
      token,
      has_incomplete_entry,
      entry_id,
      is_deactivated: isDeactivated,
    },
  });*/
});
//@desc forgot password
//route POST /api/forgot-password
//@access Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return res.send({
      success: false,
      status: 0,
      message: "Please provide email",
    });
  }
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    return res.send({
      success: false,
      status: 0,
      message: "User does not exist",
    });
  }
  var currentDate = CommonHelper.formatedDate(new Date(), 7);
  if (
    user.reset_password_attempted_on == currentDate &&
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
  //console.log(OTP)
  user.reset_password_otp = OTP;
  if (user.reset_password_attempted_on == currentDate) {
    user.reset_password_attempted = user.reset_password_attempted + 1;
  } else {
    user.reset_password_attempted = 1;
  }
  user.reset_password_attempted_on = new Date();
  await user.save();
  const emailData = {
    email: user.email,
    name: user.full_name,
    OTP,
  };
  sendForgotPasswordEmail(emailData);
  let dataResponse = {  };
  let userId = (req.user) ? req.user._id: null;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  await ResponseHandler.responseHandler('/api/forgot-password', request, dataResponse, userId, "A reset password OTP has been sent to you registered email");
  //res.send(resultResponse);

  res.send({
    success: true,
    status: 1,
    message: "A reset password OTP has been sent to you registered email",
  });
});

//@desc reset password
//route POST /api/reset-password
//@access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return res.send({ success: false, message: "Please provide email" });
  }
  if (!req.body.otp) {
    return res.send({
      success: false,
      message: "Please provide reset password OTP",
    });
  }
  if (!req.body.password) {
    return res.send({ success: false, message: "Please provide password" });
  }
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    return res.send({ success: false, message: "User does not exist" });
  }
  if (user.reset_password_otp != req.body.otp) {
    return res.send({
      success: false,
      message: "It seems that you have entered wrong OTP",
    });
  }
  user.reset_password_otp = "";
  user.reset_password_attempted = 0;
  user.password = req.body.password;
  await user.save();

  let dataResponse = {};
  let userId = (req.user) ? req.user._id: null;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  await ResponseHandler.responseHandler('/api/reset-password', request, dataResponse, userId, "Your password has been changed");
  //res.send(resultResponse);

  res.send({
    success: true,
    message: "Your password has been changed",
  });
});

//@desc view profile
//route GET /api/profile-view
//@access Private
exports.viewProfile = asyncHandler(async (req, res, next) => {
  let userId = req.user._id;
  let profileInfo = await User.findById(userId)
    .populate({
      path: "state",
      select: { name: 1 },
      populate: {
        path: "country",
        select: { name: 1 },
      },
    })
    .populate({
      path: "cannabis_consumption",
      select: { name: 1 },
    })
    .populate({
      path: "physique",
      select: { name: 1 },
    })
    .populate({
      path: "favourite_strains",
      select: { name: 1 },
    })
    .populate({
      path: "effects.effect_id",
      select: { name: 1, image: 1 },
    })
    .populate({
      path: "symptoms.symptom_id",
      select: { name: 1, image: 1 },
    })
    .populate({
      path: "activities.activity_id",
      select: { name: 1, image: 1 },
    })
    .populate({
      path: "conditions.condition_id",
      select: { name: 1, image: 1 },
    })
    .populate({
      path: "cannabinoids.cannabinoid_id",
      select: { name: 1, image: 1 },
    })
    .populate({
      path: "consumption_reason",
      select: { name: 1 },
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
      cannabis_consumption: 1,
      favourite_strains: 1,
      height: 1,
      height_scale: 1,
      weight: 1,
      weight_scale: 1,
      activity_level: 1,
      is_active: 1,
      show_tutorial_flag: 1,
    });
  var userDetails = profileInfo.toObject();
  userDetails.profile_image = profileInfo.profile_image
    ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
      profileInfo.profile_image
    : "";
  if (profileInfo.dob) {
    userDetails.dob = CommonHelper.formatedDate(profileInfo.dob, 7);
  }
  if (userDetails.state) {
    userDetails.state = profileInfo.state._id;
    userDetails.state_name = profileInfo.state.name;
    userDetails.country = profileInfo.state.country._id;
    userDetails.country_name = profileInfo.state.country.name;
  }
  if (userDetails.cannabis_consumption) {
    userDetails.cannabis_consumption_id = profileInfo.cannabis_consumption._id;
    userDetails.cannabis_consumption = profileInfo.cannabis_consumption.name;
  }
  if (profileInfo.physique) {
    userDetails.physique_id = profileInfo.physique._id;
    userDetails.physique = profileInfo.physique.name;
  }
  if (profileInfo.favourite_strains) {
    userDetails.favourite_strains_id = profileInfo.favourite_strains._id;
    userDetails.favourite_strains = profileInfo.favourite_strains.name;
  }
  if (profileInfo.consumption_reason) {
    userDetails.consumption_reason_id = profileInfo.consumption_reason._id;
    userDetails.consumption_reason = profileInfo.consumption_reason.name;
  }
  if (userDetails.symptoms) {
    let symptoms = [];
    for (var i = 0; i < userDetails.symptoms.length; i++) {
      symptoms.push({
        symptom_id: userDetails.symptoms[i].symptom_id._id,
        symptom_name: userDetails.symptoms[i].symptom_id.name,
        symptom_image: userDetails.symptoms[i].symptom_id.image
          ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/symptom/" +
            userDetails.symptoms[i].symptom_id.image
          : "",
      });
    }
    userDetails.symptoms = symptoms;
  }
  if (userDetails.effects) {
    let effects = [];
    for (var i = 0; i < userDetails.effects.length; i++) {
      effects.push({
        effect_id: userDetails.effects[i].effect_id._id,
        effect_name: userDetails.effects[i].effect_id.name,
        effect_image: userDetails.effects[i].effect_id.image
          ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/effect/" +
            userDetails.effects[i].effect_id.image
          : "",
      });
    }
    userDetails.effects = effects;
  }
  if (userDetails.cannabinoids) {
    let cannabinoids = [];
    for (var i = 0; i < userDetails.cannabinoids.length; i++) {
      cannabinoids.push({
        cannabinoid_id: userDetails.cannabinoids[i].cannabinoid_id._id,
        cannabinoid_name: userDetails.cannabinoids[i].cannabinoid_id.name,
        cannabinoid_image: userDetails.cannabinoids[i].cannabinoid_id.image
          ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/cannabinoid/" +
            userDetails.cannabinoids[i].cannabinoid_id.image
          : "",
      });
    }
    userDetails.cannabinoids = cannabinoids;
  }
  if (userDetails.activities) {
    let activities = [];
    for (var i = 0; i < userDetails.activities.length; i++) {
      activities.push({
        activity_id: userDetails.activities[i].activity_id._id,
        activity_name: userDetails.activities[i].activity_id.name,
        activity_image: userDetails.activities[i].activity_id.image
          ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/activity/" +
            userDetails.activities[i].activity_id.image
          : "",
      });
    }
    userDetails.activities = activities;
  }
  if (userDetails.conditions) {
    let conditions = [];
    for (var i = 0; i < userDetails.conditions.length; i++) {
      conditions.push({
        conditions_id: userDetails.conditions[i].condition_id._id,
        conditions_name: userDetails.conditions[i].condition_id.name,
        conditions_image: userDetails.conditions[i].condition_id.image
          ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/condition/" +
            userDetails.conditions[i].condition_id.image
          : "",
      });
    }
    userDetails.conditions = conditions;
  }
  //check incomplete entries
  var has_incomplete_entry = false;
  var entry_id = "";
  let incompleteEntry = await Diary.findOne({
    has_incompleteness_notified: 2,
    is_complete: 2,
    user: userDetails._id,
  });
  if (incompleteEntry) {
    has_incomplete_entry = true;
    entry_id = incompleteEntry._id;
  }
  let userEntriesCond = { user: userId, is_active: 1, is_deleted: 0 };
  let totalEntry = await Diary.countDocuments(userEntriesCond);
  userFind = { _id: userId };
  let findUser = await User.findOne(userFind);
  let isProfileComplete = true;
  if (findUser) {
    if (!findUser.full_name) {
      isProfileComplete = false;
    }
    if (!findUser.state) {
      isProfileComplete = false;
    }
    if (!findUser.cannabis_consumption) {
      isProfileComplete = false;
    }
    if (!findUser.dob) {
      isProfileComplete = false;
    }
  }
  let dataResponse = {
    user: userDetails,
    has_incomplete_entry,
    entry_id,
    total_entries: totalEntry,
    isProfileComplete: isProfileComplete,
  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let resultResponse = await ResponseHandler.responseHandler('/api/profile-view', request, dataResponse, userId, "User profile information");
  res.send(resultResponse);
  /*res.send({
    success: true,
    message: "User profile information",
    data: {
      user: userDetails,
      has_incomplete_entry,
      entry_id,
      total_entries: totalEntry,
      isProfileComplete: isProfileComplete,
    },
  });*/
});

//@desc update profile
//route POST /api/profile-update
//@access Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  try {
  const userId = req.user._id;
  if (req.body.email) {
    let check = "";
    check = await User.findOne({ _id: { $ne: userId }, email: req.body.email });
    if (check) {
      return res.send({ success: false, message: "Email already exist!" });
    }
    req.user.email = req.body.email;
  }
  if (req.body.dob) {
    req.user.dob = new Date(req.body.dob);
  }
  if (req.body.hasOwnProperty('gender')) {
    req.user.gender = req.body.gender;
  }
  if (req.body.hasOwnProperty('full_name')) {
    req.user.full_name = req.body.full_name;
  }
  if (req.body.hasOwnProperty('contact_no')) {
    req.user.contact_no = req.body.contact_no;
  }
  if (req.body.cannabis_consumption) {
    req.user.cannabis_consumption = req.body.cannabis_consumption;
  }
  if (req.body.consumption_reason) {
    req.user.consumption_reason = req.body.consumption_reason;
  }
  if (req.body.hasOwnProperty('physique')) {
    if (req.body.physique!=='') {
      req.user.physique = req.body.physique;
    } else {
      req.user.physique = undefined;
    }
  }
  if (req.body.hasOwnProperty('height')) {
    req.user.height = req.body.height;
  }
  if (req.body.hasOwnProperty('height_scale')) {
    req.user.height_scale = req.body.height_scale;
  }
  if (req.body.hasOwnProperty('weight')) {
    req.user.weight = req.body.weight;
  }
  if (req.body.hasOwnProperty('weight_scale')) {
    req.user.weight_scale = req.body.weight_scale;
  }
  if (req.body.hasOwnProperty('activity_level')) {
    req.user.activity_level = req.body.activity_level;
  }
  if (req.body.favourite_strains) {
    req.user.favourite_strains = req.body.favourite_strains;
  }
  if (req.body.state) {
    req.user.state = req.body.state;
  }
  if (req.body.country) {
    req.user.country = req.body.country;
  }
  if (req.body.zipcode) {
    req.user.zipcode = req.body.zipcode;
  }
  if (!(req.body.symptoms) && req.body.symptoms!='') {
    let symptomInputs = JSON.parse(req.body.symptoms);
    let symptomArr = [];
    if (symptomInputs.length > 0) {
      for (var s = 0; s < symptomInputs.length; s++) {
        symptomArr.push({ symptom_id: symptomInputs[s].symptom_id });
      }
    }
    req.user.symptoms = symptomArr;
  } else {
    req.user.symptoms = undefined;
  }
  if (!(req.body.effects) && req.body.effects!='') {
    let effectInputs = JSON.parse(req.body.effects);
    let effectArr = [];
    if (effectInputs.length > 0) {
      for (var e = 0; e < effectInputs.length; e++) {
        effectArr.push({ effect_id: effectInputs[e].effect_id });
      }
    }
    req.user.effects = effectArr;
  } else {
    req.user.effects = undefined;
  }
  if (!(req.body.activities) && req.body.activities!='') {
    let activityInputs = JSON.parse(req.body.activities);
    let activityArr = [];
    if (activityInputs.length > 0) {
      for (var s = 0; s < activityInputs.length; s++) {
        activityArr.push({ activity_id: activityInputs[s].activity_id });
      }
    }
    req.user.activities = activityArr;
  } else {
    req.user.activities = undefined;
  }

  if (!(req.body.conditions) && req.body.conditions!='') {
    let conditionInputs = JSON.parse(req.body.conditions);
    let conditionArr = [];
    if (conditionInputs.length > 0) {
      for (var s = 0; s < conditionInputs.length; s++) {
        conditionArr.push({ condition_id: conditionInputs[s].condition_id });
      }
    }
    req.user.conditions = conditionArr;
  }

  if (!(req.body.cannabinoids) && req.body.cannabinoids!='') {
    let cannabinoInputs = JSON.parse(req.body.cannabinoids);
    let cannabinoidArr = [];
    if (cannabinoInputs.length > 0) {
      for (var s = 0; s < cannabinoInputs.length; s++) {
        cannabinoidArr.push({
          cannabinoid_id: cannabinoInputs[s].cannabinoid_id,
        });
      }
    }
    req.user.cannabinoids = cannabinoidArr;
  }
  if (req.file) {
    // if(req.user.profile_image){
    //     var oldProfilePic = req.user.profile_image
    //     CommonHelper.unlinkFile(publicUploadDir + 'profile_image/' + oldProfilePic)
    // }
    // req.user.profile_image = req.file.filename

    const imagePath = publicUploadDir + "/profile_image/" + req.file.filename;
    if (req.user.profile_image) {
      const removeImage = {
        imgName: req.user.profile_image,
        type: "profile_image",
      };
      await s3Remove(removeImage);
    }
    const profileImage = {
      file: req.file,
      type: "profile_image",
    };
    const response = await s3Upload(profileImage);
    if (response) {
      req.user.profile_image = req.file.filename;
    }
    CommonHelper.unlinkFile(imagePath);
  }
  await req.user.save();
  let profileInfo = await User.findById(userId)
    .populate({
      path: "state",
      select: { name: 1 },
      populate: {
        path: "country",
        select: { name: 1 },
      },
    })
    .populate({
      path: "cannabis_consumption",
      select: { name: 1 },
    })
    .populate({
      path: "physique",
      select: { name: 1 },
    })
    .populate({
      path: "favourite_strains",
      select: { name: 1 },
    })
    .populate({
      path: "effects.effect_id",
      select: { name: 1 },
    })
    .populate({
      path: "symptoms.symptom_id",
      select: { name: 1 },
    })
    .populate({
      path: "activities.activity_id",
      select: { name: 1 },
    })
    .populate({
      path: "cannabinoids.cannabinoid_id",
      select: { name: 1 },
    })
    .populate({
      path: "consumption_reason",
      select: { name: 1 },
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
      cannabis_consumption: 1,
      favourite_strains: 1,
      height: 1,
      height_scale: 1,
      weight: 1,
      weight_scale: 1,
      activity_level: 1,
      is_active: 1,
    });
  var userDetails = profileInfo.toObject();
  userDetails.profile_image = profileInfo.profile_image
    ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
      profileInfo.profile_image
    : "";
  if (profileInfo.dob) {
    userDetails.dob = CommonHelper.formatedDate(profileInfo.dob, 7);
  }
  if (userDetails.state) {
    userDetails.state = profileInfo.state._id;
    userDetails.state_name = profileInfo.state.name;
    userDetails.country = profileInfo.state.country._id;
    userDetails.country_name = profileInfo.state.country.name;
  }
  if (userDetails.cannabis_consumption) {
    userDetails.cannabis_consumption_id = profileInfo.cannabis_consumption._id;
    userDetails.cannabis_consumption = profileInfo.cannabis_consumption.name;
  }
  if (profileInfo.physique) {
    userDetails.physique_id = profileInfo.physique._id;
    userDetails.physique = profileInfo.physique.name;
  }
  if (profileInfo.favourite_strains) {
    userDetails.favourite_strains_id = profileInfo.favourite_strains._id;
    userDetails.favourite_strains = profileInfo.favourite_strains.name;
  }
  if (userDetails.symptoms) {
    let symptoms = [];
    for (var i = 0; i < userDetails.symptoms.length; i++) {
      symptoms.push({
        symptom_id: userDetails.symptoms[i].symptom_id._id,
        symptom_name: userDetails.symptoms[i].symptom_id.name,
      });
    }
    userDetails.symptoms = symptoms;
  }
  if (profileInfo.consumption_reason) {
    userDetails.consumption_reason_id = profileInfo.consumption_reason._id;
    userDetails.consumption_reason = profileInfo.consumption_reason.name;
  }
  if (userDetails.effects) {
    let effects = [];
    for (var i = 0; i < userDetails.effects.length; i++) {
      effects.push({
        effect_id: userDetails.effects[i].effect_id._id,
        effect_name: userDetails.effects[i].effect_id.name,
      });
    }
    userDetails.effects = effects;
  }
  if (userDetails.cannabinoids) {
    let cannabinoids = [];
    for (var i = 0; i < userDetails.cannabinoids.length; i++) {
      cannabinoids.push({
        cannabinoid_id: userDetails.cannabinoids[i].cannabinoid_id._id,
        cannabinoid_name: userDetails.cannabinoids[i].cannabinoid_id.name,
      });
    }
    userDetails.cannabinoids = cannabinoids;
  }
  if (userDetails.activities) {
    let activities = [];
    for (var i = 0; i < userDetails.activities.length; i++) {
      activities.push({
        activity_id: userDetails.activities[i].activity_id._id,
        activity_name: userDetails.activities[i].activity_id.name,
      });
    }
    userDetails.activities = activities;
  }
  let dataResponse = { user: userDetails };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let resultResponse = await ResponseHandler.responseHandler('/api/profile-update', request, dataResponse, userId, "User profile information updated successfully");
  res.send(resultResponse);
  }catch(e) {
    console.log(e)
  }
  /*res.send({
    success: true,
    message: "User profile information updated successfully",
    data: { user: userDetails },
  });*/
});

//@desc view summarize data
//route GET /api/dashboard
//@access Private
exports.dashboard = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  let entryCond = { user: userId, is_active: 1, is_deleted: 0 };
  try {
  let latestPublicEntry = await Diary.find(entryCond)
    .populate({
      path: "user",
      select: { full_name: 1 },
    })
    .populate({
      path: "product",
      select: { name: 1 },
      populate: {
        path: "strain",
        select: {
          name: 1,
        },
      },
      populate: {
        path: "product_type",
        select: {
          name: 1,
        },
      },
    })
    .select({
      created_at: 1,
      comments: 1,
      average_ratings: 1,
      is_public: 1,
      day_of_week: 1,
      is_complete: 1,
      is_favourite: 1,
      has_incompleteness_notified: 1,
    })
    .limit(3)
    .sort({ created_at: -1 });
  let latestPublicEntryTop3 = [];
  if (latestPublicEntry) {
    for (var i = 0; i < latestPublicEntry.length; i++) {
      var entry = {};
      entry = latestPublicEntry[i].toObject();
      var strainName = "";
      if (latestPublicEntry[i].product) {
        if (latestPublicEntry[i].product.strain) {
          strainName = latestPublicEntry[i].product.strain.name;
        }
      }
      entry.name = latestPublicEntry[i].product
        ? latestPublicEntry[i].product.name
        : "";
      entry.strain = strainName;
      entry.product_type = (latestPublicEntry[i].product) ? (latestPublicEntry[i].product.product_type) ? latestPublicEntry[i].product.product_type.name : "" : "";
      entry.created_at = CommonHelper.formatedDate(
        latestPublicEntry[i].created_at,
        7
      );
      entry.created_at_hours = CommonHelper.formatedDate(
        latestPublicEntry[i].created_at,
        8
      );
      let entry_date = [];
      var dateObj = new Date(latestPublicEntry[i].created_at);
      var monthEntry = dateObj.getUTCMonth() + 1; //months from 1-12
      var dayEntry = dateObj.getUTCDate();
      var yearEntry = dateObj.getUTCFullYear();
      entry_date.push({
        day: dayEntry,
        month: monthEntry,
        year: yearEntry,
        hours: entry.created_at_hours,
      });
      entry.entry_date = entry_date;
      entry.user = latestPublicEntry[i].user.full_name;
      entry.is_favourite = latestPublicEntry[i].is_favourite;
      latestPublicEntryTop3.push(entry);
    }
  }
  //console.log(entry)
  const userEntries = await Diary.find(entryCond)
    .populate({
      path: "user",
      select: { full_name: 1 },
    })
    .populate({
      path: "product",
      select: { name: 1 },
      populate: {
        path: "strain",
        select: {
          name: 1,
        },
      },
      populate: {
        path: "product_type",
        select: {
          name: 1,
        },
      },
    })
    .select({
      created_at: 1,
      comments: 1,
      average_ratings: 1,
      is_public: 1,
      day_of_week: 1,
      is_complete: 1,
      is_favourite: 1,
      has_incompleteness_notified: 1,
    })
    .sort({ created_at: -1 });
  let userAllEntries = [];
  var allEntry = {};
  for (var i = 0; i < userEntries.length; i++) {
    allEntry = userEntries[i].toObject();
    var strainName = "";
    if (userEntries[i].product) {
      if (userEntries[i].product.strain) {
        strainName = userEntries[i].product.strain.name;
      }
    }
    var productTypeName = "";
    if (userEntries[i].product) {
      if (userEntries[i].product.product_type) {
        productTypeName = userEntries[i].product.product_type.name;
      }
    }
    allEntry.name = userEntries[i].product ? userEntries[i].product.name : "";
    //entry.strain = (latestPublicEntry.product) ? latestPublicEntry.product.strain.name :''
    allEntry.strain = strainName;
    allEntry.product_type = productTypeName;
    allEntry.created_at = CommonHelper.formatedDate(
      userEntries[i].created_at,
      7
    );
    allEntry.created_at_hours = CommonHelper.formatedDate(
      userEntries[i].created_at,
      4
    );
    let allEntry_date = [];
    var dateObj = new Date(userEntries[i].created_at);
    var monthEntry = dateObj.getUTCMonth() + 1; //months from 1-12
    var dayEntry = dateObj.getUTCDate();
    var yearEntry = dateObj.getUTCFullYear();
    allEntry_date.push({
      day: dayEntry,
      month: monthEntry,
      year: yearEntry,
      hours: entry.created_at_hours,
    });
    allEntry.entry_date = allEntry_date;
    allEntry.user = userEntries[i].user.full_name;
    allEntry.is_favourite = userEntries[i].is_favourite;
    userAllEntries.push(allEntry);
  }
  total = userEntries.length;
  let favEntryCond = {
    user: userId,
    is_active: 1,
    is_deleted: 0,
    is_favourite: 1,
  };
  let totalFavEntry = await Diary.countDocuments(favEntryCond);
  //Get monthly entries
  const year = new Date().getFullYear();
  var preMonth = parseInt(new Date().getMonth());
  var month = parseInt(new Date().getMonth() + 1);
  var noOfDaysInCurrentMonth = new Date(year, month, 0).getDate();
  //console.log(noOfDaysInCurrentMonth)
  let monthlyEntries = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        //"is_complete":1
      },
    },
    {
      $group: {
        _id: "$day_of_month",
        count: { $sum: 1 },
      },
    },
  ]).exec();
  //console.log(monthlyEntries)
  let calenderEntries = [];
  let days = [];
  for (var d = 1; d <= noOfDaysInCurrentMonth; d++) {
    days.push(d);
  }
  //console.log(days)
  if (monthlyEntries.length > 0) {
    let existingDays = [];
    for (var i = 0; i < monthlyEntries.length; i++) {
      existingDays.push(monthlyEntries[i]._id);
      calenderEntries.push({
        day: monthlyEntries[i]._id,
        count: monthlyEntries[i].count,
      });
    }
    for (var i = 0; i < days.length; i++) {
      if (existingDays.includes(days[i]) === false) {
        calenderEntries.push({
          day: days[i],
          count: 0,
        });
      }
    }
  } else {
    for (d = 0; d < days.length; d++) {
      calenderEntries.push({
        day: days[d],
        count: 0,
      });
    }
  }
  calenderEntries.sort((a, b) => parseFloat(a.day) - parseFloat(b.day));
  let dataResponse = { 
    latest_entry: latestPublicEntryTop3,
    total_entry: total,
    total_favourite_entry: totalFavEntry,
    calender_entries: calenderEntries,
    userAllEntries,
  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let resultResponse = await ResponseHandler.responseHandler('/api/dashboard', request, dataResponse, userId, "");
  res.send(resultResponse);
  /*res.send({
    success: true,
    message: "",
    data: {
      latest_entry: latestPublicEntryTop3,
      total_entry: total,
      total_favourite_entry: totalFavEntry,
      calender_entries: calenderEntries,
      userAllEntries,
    },
  });*/
  } catch(e) {
    console.log(e)
    //let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    let resultResponse = await ResponseHandler.responseHandler('/api/dashboard', e, {}, userId, "");
  }
});

//@desc change password
//route POST /api/change-password
//@access Private
exports.changePassword = asyncHandler(async (req, res, next) => {
  if (!req.body.old_password) {
    return res.send({ success: false, message: "Please provide old password" });
  }
  if (!req.body.new_password) {
    return res.send({ success: false, message: "Please provide new password" });
  }
  await User.checkOldPassword(req.user._id, req.body.old_password);
  req.user.password = req.body.new_password;
  await req.user.save();

  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let resultResponse = await ResponseHandler.responseHandler('/api/change-password', request, dataResponse, userId, "Password updated successfully");
  res.send(resultResponse);

  res.send({ success: true, message: "Password updated successfully" });
});


//@desc get introductory videos
//route GET /api/intro-videos
//@access Private
exports.getIntroVideos = asyncHandler(async (req, res, next) => {
  let findCond = { is_deleted: 0, is_active: 1, type: 1 };
  let list = await Video.find(findCond);
  let videos = [];
  if (list.length > 0) {
    var uploadDirPath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/";
    for (var i = 0; i < list.length; i++) {
      videos.push({
        id: list[i]._id,
        video_title: list[i].title,
        video_url: uploadDirPath + "video/introductory/" + list[i].video_url,
        video_thumb_image:
          uploadDirPath +
          "video_thumb_image/introductory/" +
          list[i].video_thumb_image,
        video_duration: list[i].duration,
      });
    }
  }
  let findTCond = { is_deleted: 0, is_active: 1, type: 5 };
  let tutorialVideo = await Video.findOne(findTCond).select({
    title: 1,
    video_url: 1,
    video_thumb_image: 1,
    duration: 1,
  });
  let tutorial = {};
  if (tutorialVideo) {
    let tutorialInfo = tutorialVideo.toObject();
    tutorial = {
      id: tutorialInfo._id,
      video_title: tutorialInfo.title,
      video_url: uploadDirPath + "video/introductory/" + tutorialInfo.video_url,
      video_thumb_image:
        uploadDirPath +
        "video_thumb_image/introductory/" +
        tutorialInfo.video_thumb_image,
      video_duration: tutorialInfo.duration,
    };
  }
  let dataResponse = { videos, tutorial };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/intro-videos', request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, message: "", data: { videos, tutorial } });
});

//@desc add new product
//route POST /api/create-product
//@access Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  if(!req.body.name){
      return res.send({success:false,message:"Please provide name"})
  }
  /*if(!req.body.description){
      return res.send({success:false,message:"Please provide description"})
  }*/
  if(!req.body.strain){
      return res.send({success:false,message:"Please provide strain"})
  }
  if(!req.body.product_type){
      return res.send({success:false,message:"Please provide product type"})
  }
  if(!req.body.weight){
      return res.send({success:false,message:"Please provide weight"})
  }
  let check = await Product.findOne({ name: req.body.name });
  if (check) {
    var product_id = check._id;
    return res.send({
      success: true,
      message: "A product with same name already exist",
      data: { product_id },
    });
  }
  const userId = req.user._id;
  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description ? req.body.description : "",
    product_name: req.body.product_name,
    product_type: req.body.product_type,
    chemical_compounds: [],
    updated_by: userId,
    weight: req.body.weight,
    has_identifier: 1,
  });
  if (req.body.name) {
    newProduct.name = req.body.name;
  }
  if (req.body.weight) {
    newProduct.weight = req.body.weight;
  }
  if (req.body.product_name) {
    newProduct.product_name = req.body.product_name;
  }
  if (req.body.product_type) {
    newProduct.product_type = req.body.product_type;
  }
  if (req.body.strain) {
    newProduct.strain = req.body.strain;
  }
  if (req.body.COA_identifier) {
    newProduct.COA_identifier = req.body.COA_identifier;
  }
  if (req.body.chemical_compounds) {
    let chemicalCompoundInputs = req.body.chemical_compounds;
    if (chemicalCompoundInputs.length > 0) {
      for (var c = 0; c < chemicalCompoundInputs.length; c++) {
        newProduct.chemical_compounds.push({
          composition_id: chemicalCompoundInputs[c].composition_id,
          composition_value: chemicalCompoundInputs[c].composition_value,
        });
      }
    }
  }
  let productInfo = await newProduct.save();
  let getProductInfo = await Product.findOne({ name: productInfo.product_name })
    .populate({
      path: "strain",
      select: { name: 1, _id: 1 },
    })
    .populate({
      path: "product_type",
      select: { name: 1, _id: 1 },
    });
    let dataResponse = {
      product_id: productInfo._id,
      product_name: productInfo.product_name,
      product_type: getProductInfo.product_type.name,
      product_type_id: getProductInfo.product_type._id,
      brand_name: getProductInfo.strain.name,
      brand_id: getProductInfo.strain._id,
    };
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    //let userId = (req.user) ? req.user._id: null;
    let resultResponse = await ResponseHandler.responseHandler('/api/create-product', request, dataResponse, userId, "");
    res.send(resultResponse);
  /*res.send({
    success: true,
    message: "",
    data: {
      product_id: productInfo._id,
      product_name: productInfo.product_name,
      product_type: getProductInfo.product_type.name,
      product_type_id: getProductInfo.product_type._id,
      brand_name: getProductInfo.strain.name,
      brand_id: getProductInfo.strain._id,
    },
  });*/
});

//@desc add new diary entry
//route POST /api/create-entry
//@access Private
exports.createEntry = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  var entry_id = "";
  if (!req.body.product_id) {
    let dataResponse = { error: "error" };
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    //let userId = (req.user) ? req.user._id: null;
    let resultResponse = await ResponseHandler.responseHandler('/api/create-entry', request, dataResponse, userId, "Your entry saved successfully");
    //res.send(resultResponse);
    return res.send({ success: false, message: "Please provide product id" });
  }
  var currentDate = new Date();
  let entry = new Diary({
    user: userId,
    product: req.body.product_id,
    day_of_week: CommonHelper.formatedDate(currentDate, 9),
    comments: req.body.comments ? req.body.comments : "",
    year: new Date().getFullYear(),
    month: parseInt(new Date().getMonth() + 1),
    day_of_month: parseInt(new Date().getDate()),
    updated_by: userId,
  });
  if (req.body.coa_id) {
    entry.coa_id = req.body.coa_id;
  }
  if (req.body.symptoms) {
    let symptomInputs = req.body.symptoms;
    if (symptomInputs.length > 0) {
      for (var s = 0; s < symptomInputs.length; s++) {
        entry.pre_symptoms.push({ symptom_id: symptomInputs[s].symptom_id });
      }
    }
  }
  // if(req.body.effects){
  //     let effectInputs = req.body.effects
  //     if(effectInputs.length > 0){
  //         for(var s = 0; s < effectInputs.length; s++){
  //             entry.pre_effects.push({effect_id:effectInputs[s].effect_id})
  //         }
  //     }
  // }
  if (req.body.desired_effects) {
    let effectInputs = req.body.desired_effects;
    if (effectInputs.length > 0) {
      for (var s = 0; s < effectInputs.length; s++) {
        entry.desired_effects.push({ effect_id: effectInputs[s].effect_id });
      }
    }
  }
  if (req.body.actual_effects) {
    let effectInputs = req.body.actual_effects;
    if (effectInputs.length > 0) {
      for (var s = 0; s < effectInputs.length; s++) {
        entry.actual_effects.push({ effect_id: effectInputs[s].effect_id });
      }
    }
  }
  if (req.body.activities) {
    let activityInputs = req.body.activities;
    if (activityInputs.length > 0) {
      for (var s = 0; s < activityInputs.length; s++) {
        entry.pre_activities.push({
          activity_id: activityInputs[s].activity_id,
        });
      }
    }
  }
  if (req.body.condition) {
    let conditionInputs = req.body.condition;
    if (conditionInputs.length > 0) {
      for (var s = 0; s < conditionInputs.length; s++) {
        entry.pre_condition.push({
          condition_id: conditionInputs[s].condition_id,
        });
      }
    }
  }
  if (req.body.cannabinoids) {
    let cannabinoidInputs = req.body.cannabinoids;
    if (cannabinoidInputs.length > 0) {
      for (var s = 0; s < cannabinoidInputs.length; s++) {
        entry.cannabinoid_profile.push({
          composition_id: cannabinoidInputs[s].composition_id,
          weight: cannabinoidInputs[s].weight,
        });
      }
    }
  }
  if (req.body.terpenes) {
    let terpeneInputs = req.body.terpenes;
    if (terpeneInputs.length > 0) {
      for (var s = 0; s < terpeneInputs.length; s++) {
        entry.terpenes.push({
          composition_id: terpeneInputs[s].composition_id,
          weight: terpeneInputs[s].weight,
        });
      }
    }
  }
  let userEntriesCond = { user: userId, is_active: 1, is_deleted: 0 };
  let totalEntry = await Diary.countDocuments(userEntriesCond);
  let createdEntry = await entry.save();
  if (createdEntry) {
    entry_id = createdEntry._id;
  }
  userFind = { _id: userId };
  let findUser = await User.findOne(userFind);
  let isProfileComplete = true;
  if (findUser) {
    if (!findUser.full_name) {
      isProfileComplete = false;
    }
    if (!findUser.state) {
      isProfileComplete = false;
    }
    if (!findUser.cannabis_consumption) {
      isProfileComplete = false;
    }
    if (!findUser.dob) {
      isProfileComplete = false;
    }
  }
  let dataResponse = { 
    entry_id,
    total_entries: totalEntry,
    isProfileComplete: isProfileComplete,
   };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/create-entry', request, dataResponse, userId, "Your entry saved successfully");
  res.send(resultResponse);

  /*res.send({
    success: true,
    data: {
      entry_id,
      total_entries: totalEntry,
      isProfileComplete: isProfileComplete,
    },
    message: "Your entry saved successfully",
  });*/
});

//@desc complete diary entry information
//route POST /api/save-complete-entry
//@access Private
exports.completeEntry = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  if (!req.body.entry_id) {
    return res.send({ success: false, message: "Please provide entry id" });
  }
  var entryId = req.body.entry_id;
  let entryInfo = await Diary.findOne({
    _id: entryId,
    user: userId,
    is_deleted: 0,
  });
  if (!entryInfo) {
    return res.send({ success: false, message: "Entry does not exist" });
  }
  if (req.body.product_id) {
    entryInfo.product = req.body.product_id;
  }
  if (req.body.coa_id) {
    entryInfo.coa_id = req.body.coa_id;
  }
  if (req.body.comments) {
    entryInfo.comments = req.body.comments;
  }
  if (req.body.is_public) {
    entryInfo.is_public = req.body.is_public;
  }
  if (req.body.mood_before_consumption) {
    entryInfo.mood_before_consumption = req.body.mood_before_consumption;
  }
  if (req.body.consumption_negative) {
    let negetiveInputs = req.body.consumption_negative;
    if (negetiveInputs.length > 0) {
      let negetives = [];
      for (var s = 0; s < negetiveInputs.length; s++) {
        negetives.push({ negative_id: negetiveInputs[s].negative_id });
      }
      entryInfo.consumption_negative = negetives;
    } else {
      let existingConsumptionNegetives = [];
      if (entryInfo.consumption_negative.length > 0) {
        for (var i = 0; i < entryInfo.consumption_negative.length; i++) {
          existingConsumptionNegetives.push(
            entryInfo.consumption_negative[i].negative_id
          );
        }
      }
      Diary.update(
        { _id: entryId },
        {
          $pull: {
            consumption_negative: { negative_id: existingConsumptionNegetives },
          },
        },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
    //entryInfo.consumption_negative = req.body.consumption_negative
  }
  if (req.body.consumption_partner) {
    entryInfo.consumption_partner = req.body.consumption_partner;
  }
  if (req.body.consumption_place) {
    entryInfo.consumption_place = req.body.consumption_place;
  }
  if (req.body.consumption_time) {
    entryInfo.consumption_time = req.body.consumption_time;
  }
  if (req.body.eat_before_consumption) {
    entryInfo.eat_before_consumption = req.body.eat_before_consumption;
  }
  if (req.body.consume_now) {
    entryInfo.consume_now = req.body.consume_now;
  }
  if (req.body.consume_cannabis_before) {
    entryInfo.consume_cannabis_before = req.body.consume_cannabis_before;
  }
  if (req.body.consume_time) {
    entryInfo.consume_time = req.body.consume_time;
  }
  if (req.body.consumption_method) {
    entryInfo.consumption_method = req.body.consumption_method;
  }
  if (req.body.consumption_unit) {
    entryInfo.consumption_unit = req.body.consumption_unit;
    entryInfo.consumption_scale = req.body.consumption_scale;
  }
  // Desired
  if (req.body.desired_effects) {
    let effectInputs = req.body.desired_effects;
    if (effectInputs.length > 0) {
      let desiredEffects = [];
      for (var s = 0; s < effectInputs.length; s++) {
        desiredEffects.push({ effect_id: effectInputs[s].effect_id });
      }
      entryInfo.desired_effects = desiredEffects;
    } else {
      let existingDesiredEffects = [];
      if (entryInfo.desired_effects.length > 0) {
        for (var i = 0; i < entryInfo.desired_effects.length; i++) {
          existingDesiredEffects.push(entryInfo.desired_effects[i].effect_id);
        }
      }
      Diary.update(
        { _id: entryId },
        { $pull: { desired_effects: { effect_id: existingDesiredEffects } } },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.desired_activities) {
    let desiredActivitiesInputs = req.body.desired_activities;
    if (desiredActivitiesInputs.length > 0) {
      let desiredActivities = [];
      for (var s = 0; s < desiredActivitiesInputs.length; s++) {
        desiredActivities.push({
          activity_id: desiredActivitiesInputs[s].activity_id,
        });
      }
      entryInfo.desired_activities = desiredActivities;
    } else {
      let existingDesiredActivities = [];
      if (entryInfo.desired_activities.length > 0) {
        for (var i = 0; i < entryInfo.desired_activities.length; i++) {
          existingDesiredActivities.push(
            entryInfo.desired_activities[i].activity_id
          );
        }
      }
      Diary.update(
        { _id: entryId },
        {
          $pull: {
            desired_activities: { activity_id: existingDesiredActivities },
          },
        },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.desired_symptoms) {
    let desiredSymptomsInputs = req.body.desired_symptoms;
    if (desiredSymptomsInputs.length > 0) {
      let desiredSymptoms = [];
      for (var s = 0; s < desiredSymptomsInputs.length; s++) {
        desiredSymptoms.push({
          symptom_id: desiredSymptomsInputs[s].symptom_id,
        });
      }
      entryInfo.desired_symptoms = desiredSymptoms;
    } else {
      let existingDesiredSymptoms = [];
      if (entryInfo.desired_symptoms.length > 0) {
        for (var i = 0; i < entryInfo.desired_symptoms.length; i++) {
          existingDesiredSymptoms.push(
            entryInfo.desired_symptoms[i].symptom_id
          );
        }
      }
      Diary.update(
        { _id: entryId },
        {
          $pull: { desired_symptoms: { symptom_id: existingDesiredSymptoms } },
        },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.desired_condition) {
    let desiredConditionInputs = req.body.desired_condition;
    if (desiredConditionInputs.length > 0) {
      let desiredCondition = [];
      for (var s = 0; s < desiredConditionInputs.length; s++) {
        desiredCondition.push({
          symptom_id: desiredConditionInputs[s].condition_id,
        });
      }
      entryInfo.desired_condition = desiredCondition;
    } else {
      let existingDesiredCondition = [];
      if (entryInfo.desired_condition.length > 0) {
        for (var i = 0; i < entryInfo.desired_condition.length; i++) {
          existingDesiredCondition.push(
            entryInfo.desired_condition[i].condition_id
          );
        }
      }
      Diary.update(
        { _id: entryId },
        {
          $pull: {
            desired_condition: { condition_id: existingDesiredCondition },
          },
        },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  //Actual
  if (req.body.actual_effects) {
    let effectInputs = req.body.actual_effects;
    if (effectInputs.length > 0) {
      let actualEffects = [];
      for (var s = 0; s < effectInputs.length; s++) {
        actualEffects.push({ effect_id: effectInputs[s].effect_id });
      }
      entryInfo.actual_effects = actualEffects;
    } else {
      let existingActualEffects = [];
      if (entryInfo.actual_effects.length > 0) {
        for (var i = 0; i < entryInfo.actual_effects.length; i++) {
          existingActualEffects.push(entryInfo.actual_effects[i].effect_id);
        }
      }
      Diary.update(
        { _id: entryId },
        { $pull: { actual_effects: { effect_id: existingActualEffects } } },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.actual_activities) {
    let activitiesInputs = req.body.actual_activities;
    if (activitiesInputs.length > 0) {
      let actualActivities = [];
      for (var s = 0; s < activitiesInputs.length; s++) {
        actualActivities.push({ activity_id: activitiesInputs[s].activity_id });
      }
      entryInfo.actual_activities = actualActivities;
    } else {
      let existingActualActivities = [];
      if (entryInfo.actual_activities.length > 0) {
        for (var i = 0; i < entryInfo.actual_activities.length; i++) {
          existingActualActivities.push(
            entryInfo.actual_activities[i].activity_id
          );
        }
      }
      Diary.update(
        { _id: entryId },
        {
          $pull: {
            actual_activities: { activity_id: existingActualActivities },
          },
        },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.actual_symptoms) {
    let symptomsInputs = req.body.actual_symptoms;
    if (symptomsInputs.length > 0) {
      let actualSymptoms = [];
      for (var s = 0; s < symptomsInputs.length; s++) {
        actualSymptoms.push({ symptom_id: symptomsInputs[s].symptom_id });
      }
      entryInfo.actual_symptoms = actualSymptoms;
    } else {
      let existingActualSymptoms = [];
      if (entryInfo.actual_symptoms.length > 0) {
        for (var i = 0; i < entryInfo.actual_symptoms.length; i++) {
          existingActualSymptoms.push(entryInfo.actual_symptoms[i].symptom_id);
        }
      }
      Diary.update(
        { _id: entryId },
        { $pull: { actual_symptoms: { symptom_id: existingActualSymptoms } } },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.actual_condition) {
    let actualConditionInputs = req.body.actual_condition;
    if (actualConditionInputs.length > 0) {
      let actualCondition = [];
      for (var s = 0; s < actualConditionInputs.length; s++) {
        actualCondition.push({
          condition_id: actualConditionInputs[s].condition_id,
        });
      }
      entryInfo.actual_condition = actualCondition;
    } else {
      let existingActualCondition = [];
      if (entryInfo.actual_condition.length > 0) {
        for (var i = 0; i < entryInfo.actual_condition.length; i++) {
          existingActualCondition.push(
            entryInfo.actual_condition[i].condition_id
          );
        }
      }
      Diary.update(
        { _id: entryId },
        {
          $pull: {
            actual_condition: { condition_id: existingActualCondition },
          },
        },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  // Midpoint
  if (req.body.midpoint_effects) {
    let effectMindpointInputs = req.body.midpoint_effects;
    if (effectMindpointInputs.length > 0) {
      let midpointEffects = [];
      for (var s = 0; s < effectMindpointInputs.length; s++) {
        midpointEffects.push({ effect_id: effectMindpointInputs[s].effect_id });
      }
      entryInfo.midpoint_effects = midpointEffects;
    } else {
      let existingMidpointEffects = [];
      if (entryInfo.midpoint_effects.length > 0) {
        for (var i = 0; i < entryInfo.midpoint_effects.length; i++) {
          existingMidpointEffects.push(entryInfo.midpoint_effects[i].effect_id);
        }
      }
      Diary.update(
        { _id: entryId },
        { $pull: { midpoint_effects: { effect_id: existingMidpointEffects } } },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.midpoint_activities) {
    let activitiesInputs = req.body.midpoint_activities;
    if (activitiesInputs.length > 0) {
      let midpointActivities = [];
      for (var s = 0; s < activitiesInputs.length; s++) {
        midpointActivities.push({
          activity_id: activitiesInputs[s].activity_id,
        });
      }
      entryInfo.midpoint_activities = midpointActivities;
    } else {
      let existingMidpointActivities = [];
      if (entryInfo.midpoint_activities.length > 0) {
        for (var i = 0; i < entryInfo.midpoint_activities.length; i++) {
          existingMidpointActivities.push(
            entryInfo.midpoint_activities[i].activity_id
          );
        }
      }
      Diary.update(
        { _id: entryId },
        {
          $pull: {
            midpoint_activities: { activity_id: existingMidpointActivities },
          },
        },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.midpoint_symptoms) {
    let symptomsInputs = req.body.midpoint_symptoms;
    if (symptomsInputs.length > 0) {
      let midpointSymptoms = [];
      for (var s = 0; s < midpointSymptoms.length; s++) {
        midpointSymptoms.push({ symptom_id: midpointSymptoms[s].symptom_id });
      }
      entryInfo.midpoint_symptoms = midpointSymptoms;
    } else {
      let existingMidpointSymptoms = [];
      if (entryInfo.midpoint_symptoms.length > 0) {
        for (var i = 0; i < entryInfo.midpoint_symptoms.length; i++) {
          existingMidpointSymptoms.push(
            entryInfo.midpoint_symptoms[i].symptom_id
          );
        }
      }
      Diary.update(
        { _id: entryId },
        {
          $pull: {
            midpoint_symptoms: { symptom_id: existingMidpointSymptoms },
          },
        },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.midpoint_condition) {
    let midpointConditionInputs = req.body.midpoint_condition;
    if (midpointConditionInputs.length > 0) {
      let midpointCondition = [];
      for (var s = 0; s < midpointConditionInputs.length; s++) {
        midpointCondition.push({
          condition_id: midpointConditionInputs[s].condition_id,
        });
      }
      entryInfo.midpoint_condition = midpointCondition;
    } else {
      let existingMidpointCondition = [];
      if (entryInfo.midpoint_condition.length > 0) {
        for (var i = 0; i < entryInfo.midpoint_condition.length; i++) {
          existingMidpointCondition.push(
            entryInfo.midpoint_condition[i].condition_id
          );
        }
      }
      Diary.update(
        { _id: entryId },
        {
          $pull: {
            midpoint_condition: { condition_id: existingMidpointCondition },
          },
        },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.symptoms) {
    let symptomInputs = req.body.symptoms;
    if (symptomInputs.length > 0) {
      let preSymptoms = [];
      for (var s = 0; s < symptomInputs.length; s++) {
        preSymptoms.push({ symptom_id: symptomInputs[s].symptom_id });
      }
      entryInfo.pre_symptoms = preSymptoms;
    } else {
      let existingSymptomIds = [];
      if (entryInfo.pre_symptoms.length > 0) {
        for (var i = 0; i < entryInfo.pre_symptoms.length; i++) {
          existingSymptomIds.push(entryInfo.pre_symptoms[i].symptom_id);
        }
      }
      Diary.update(
        { _id: entryId },
        { $pull: { pre_symptoms: { symptom_id: existingSymptomIds } } },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }

  if (req.body.activities) {
    let activityInputs = req.body.activities;
    if (activityInputs.length > 0) {
      let preActivity = [];
      for (var s = 0; s < activityInputs.length; s++) {
        preActivity.push({ activity_id: activityInputs[s].activity_id });
      }
      entryInfo.pre_activities = preActivity;
    } else {
      let existingActivityIds = [];
      if (entryInfo.pre_activities.length > 0) {
        for (var i = 0; i < entryInfo.pre_activities.length; i++) {
          existingActivityIds.push(entryInfo.pre_activities[i].activity_id);
        }
      }
      Diary.update(
        { _id: entryId },
        { $pull: { pre_activities: { activity_id: existingActivityIds } } },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.condition) {
    let conditionInputs = req.body.condition;
    if (conditionInputs.length > 0) {
      let preCondition = [];
      for (var s = 0; s < conditionInputs.length; s++) {
        preCondition.push({ condition_id: conditionInputs[s].condition_id });
      }
      entryInfo.pre_condition = preCondition;
    } else {
      let existingConditionIds = [];
      if (entryInfo.pre_condition.length > 0) {
        for (var i = 0; i < entryInfo.pre_condition.length; i++) {
          existingConditionIds.push(entryInfo.pre_condition[i].condition_id);
        }
      }
      Diary.update(
        { _id: entryId },
        { $pull: { pre_condition: { condition_id: existingConditionIds } } },
        { safe: true, multi: true },
        function (err, obj) {
          //do something smart
        }
      );
    }
  }
  if (req.body.is_favourite) {
    entryInfo.is_favourite = req.body.is_favourite;
  }
  if (req.body.enjoy_taste) {
    entryInfo.enjoy_taste = req.body.enjoy_taste;
  }
  if (req.body.ratings && req.body.ratings > 0) {
    entryInfo.average_ratings = req.body.ratings;
  }
  if (req.body.is_complete) {
    entryInfo.is_complete = req.body.is_complete;
  } else {
    entryInfo.is_complete = 1;
    entryInfo.has_incompleteness_notified = 1;
  }
  //console.log(entryInfo)
  await entryInfo.save();

  //update keywords section
  let updatedEntryInfo = await Diary.findById(entryId)
    .populate({
      path: "strain",
      select: { name: 1 },
    })
    .populate({
      path: "desired_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "desired_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "desired_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "desired_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_effects.effect_id",
      select: { name: 1, icon: 1 },
    });
  //console.log(updatedEntryInfo)
  let keywords = "";
  if (updatedEntryInfo.strain) {
    keywords = updatedEntryInfo.strain.name;
  }
  //Desired
  if (updatedEntryInfo.desired_effects.length > 0) {
    for (var i = 0; i < updatedEntryInfo.desired_effects.length; i++) {
      if (updatedEntryInfo.desired_effects[i].effect_id) {
        keywords += updatedEntryInfo.desired_effects[i].effect_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.desired_activities.length > 0) {
    for (var i = 0; i < updatedEntryInfo.desired_activities.length; i++) {
      if (updatedEntryInfo.desired_activities[i].activity_id) {
        keywords +=
          updatedEntryInfo.desired_activities[i].activity_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.desired_symptoms.length > 0) {
    for (var i = 0; i < updatedEntryInfo.desired_symptoms.length; i++) {
      if (updatedEntryInfo.desired_symptoms[i].symptom_id) {
        keywords += updatedEntryInfo.desired_symptoms[i].symptom_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.desired_condition.length > 0) {
    for (var i = 0; i < updatedEntryInfo.desired_condition.length; i++) {
      if (updatedEntryInfo.desired_condition[i].condition_id) {
        keywords +=
          updatedEntryInfo.desired_condition[i].condition_id.name + ", ";
      }
    }
  }
  //Actual
  if (updatedEntryInfo.actual_effects.length > 0) {
    for (var i = 0; i < updatedEntryInfo.actual_effects.length; i++) {
      if (updatedEntryInfo.actual_effects[i].effect_id) {
        keywords += updatedEntryInfo.actual_effects[i].effect_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.actual_symptoms.length > 0) {
    for (var i = 0; i < updatedEntryInfo.actual_symptoms.length; i++) {
      if (updatedEntryInfo.actual_symptoms[i].symptom_id) {
        keywords += updatedEntryInfo.actual_symptoms[i].symptom_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.actual_activities.length > 0) {
    for (var i = 0; i < updatedEntryInfo.actual_activities.length; i++) {
      if (updatedEntryInfo.actual_activities[i].activity_id) {
        keywords +=
          updatedEntryInfo.actual_activities[i].activity_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.actual_condition.length > 0) {
    for (var i = 0; i < updatedEntryInfo.actual_condition.length; i++) {
      if (updatedEntryInfo.actual_condition[i].condition_id) {
        keywords +=
          updatedEntryInfo.actual_condition[i].condition_id.name + ", ";
      }
    }
  }
  //Midpoint
  if (updatedEntryInfo.midpoint_effects.length > 0) {
    for (var i = 0; i < updatedEntryInfo.midpoint_effects.length; i++) {
      if (updatedEntryInfo.midpoint_effects[i].effect_id) {
        keywords += updatedEntryInfo.midpoint_effects[i].effect_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.midpoint_symptoms.length > 0) {
    for (var i = 0; i < updatedEntryInfo.midpoint_symptoms.length; i++) {
      if (updatedEntryInfo.midpoint_symptoms[i].symptom_id) {
        keywords +=
          updatedEntryInfo.midpoint_symptoms[i].symptom_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.midpoint_activities.length > 0) {
    for (var i = 0; i < updatedEntryInfo.midpoint_activities.length; i++) {
      if (updatedEntryInfo.midpoint_activities[i].activity_id) {
        keywords +=
          updatedEntryInfo.midpoint_activities[i].activity_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.midpoint_condition.length > 0) {
    for (var i = 0; i < updatedEntryInfo.midpoint_condition.length; i++) {
      if (updatedEntryInfo.midpoint_condition[i].condition_id) {
        keywords +=
          updatedEntryInfo.midpoint_condition[i].condition_id.name + ", ";
      }
    }
  }
  //Pre
  if (updatedEntryInfo.pre_activities.length > 0) {
    for (var i = 0; i < updatedEntryInfo.pre_activities.length; i++) {
      if (updatedEntryInfo.pre_activities[i].activity_id) {
        keywords += updatedEntryInfo.pre_activities[i].activity_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.pre_condition.length > 0) {
    for (var i = 0; i < updatedEntryInfo.pre_condition.length; i++) {
      if (updatedEntryInfo.pre_condition[i].condition_id) {
        keywords += updatedEntryInfo.pre_condition[i].condition_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.pre_symptoms.length > 0) {
    for (var i = 0; i < updatedEntryInfo.pre_symptoms.length; i++) {
      if (updatedEntryInfo.pre_symptoms[i].symptom_id) {
        keywords += updatedEntryInfo.pre_symptoms[i].symptom_id.name + ", ";
      }
    }
  }
  if (updatedEntryInfo.pre_effects.length > 0) {
    for (var i = 0; i < updatedEntryInfo.pre_effects.length; i++) {
      if (updatedEntryInfo.pre_effects[i].effect_id) {
        keywords += updatedEntryInfo.pre_effects[i].effect_id.name + ", ";
      }
    }
  }
  //console.log(keywords)
  if (keywords) {
    updatedEntryInfo.keywords = keywords;
    await updatedEntryInfo.save();
  }
  let dataResponse = updatedEntryInfo;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/save-complete-entry', request, dataResponse, userId, "Entry information updated successfully");
  res.send(resultResponse);
  //update keywords section END
  /*res.send({
    success: true,
    message: "Entry information updated successfully",
    data: updatedEntryInfo,
  });*/
});

//@desc get list of user's diary entries
//route GET /api/diary-entries
//@access Private
exports.getDiaryEntries = asyncHandler(async (req, res, next) => {
  try {
  var userId = req.user._id;
  var totalPages = 0;
  var limit = 20;
  var skip = 0;
  var total = 0;
  var uploadDirPath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin";
  //let findCond = {user:userId,is_deleted:0,is_complete:1}
  let findCond = { user: userId, is_deleted: 0 };
  if (req.query.search_text) {
    var searchQuery = req.query.search_text;
    /*var searchText = new RegExp(["^", searchQuery, "$"].join(""), "i");*/
    /*findCond.$or=[
            {keywords:{ '$regex' : searchText, '$options' : 'i' }},
            {name:{ '$regex' : searchText, '$options' : 'i' }}
        ]*/
    var logEntry = {
      search_terms: searchQuery,
      type: "getDiaryEntries",
      search_by: userId,
    };
    await SearchLogs.create(logEntry);
    getIdsSearch = await Diary.aggregate([
      // Activities
      {
        $lookup: {
          from: "activities",
          localField: "pre_activities.activity_id",
          foreignField: "_id",
          as: "ActivitiesR",
        },
      },
      { $unwind: "$ActivitiesR" },
      // Symptoms
      {
        $lookup: {
          from: "symptoms",
          localField: "pre_symptoms.symptom_id",
          foreignField: "_id",
          as: "SymptomsR",
        },
      },
      { $unwind: "$SymptomsR" },
      // Effects
      {
        $lookup: {
          from: "effects",
          localField: "desired_effects.effect_id",
          foreignField: "_id",
          as: "EffectsR",
        },
      },
      { $unwind: "$EffectsR" },
      /*// Conditions
                { "$lookup": {
                    "from": "conditions",
                    "localField": "pre_condition.condition_id",
                    "foreignField": "_id",
                    "as": "ConditionsR"
                } },
                { "$unwind": "$ConditionsR" },*/
      {
        $match: {
          $or: [
            { "SymptomsR.name": { $regex: searchQuery, $options: "i" } },
            { "ActivitiesR.name": { $regex: searchQuery, $options: "i" } },
            { "EffectsR.name": { $regex: searchQuery, $options: "i" } } /*,
                                { "ConditionsR.name": searchText }*/,
          ],
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    findCond._id = {
      $in: getIdsSearch.map(function (e) {
        return ObjectId(e._id);
      }),
    };
    //findCond.name =  { '$regex' : searchText, '$options' : 'i' }
  }
  if (req.query.page && req.query.page > 0) {
    var page = req.query.page;
    skip = parseInt(page - 1) * limit;
  }
  if (req.query.is_public) {
    findCond.is_public = req.query.is_public;
  }
  if (req.query.ratings) {
    findCond.average_ratings = req.query.ratings;
    // if(req.query.ratings == 0){
    //     findCond.average_ratings = {"$exists" : true, "$ne" : ""}
    // }else{
    //     findCond.average_ratings = req.query.ratings
    // }
  }
  if (req.query.search_date) {
    var start = new Date(req.query.search_date);
    start.setHours(0, 0, 0, 0);

    var end = new Date(req.query.search_date);
    end.setHours(23, 59, 59, 999);

    findCond.created_at = { $gte: start, $lte: end };
  }
  if (req.query.search_date_from && req.query.search_date_to) {
    var start = new Date(req.query.search_date_from);
    start.setHours(0, 0, 0, 0);

    var end = new Date(req.query.search_date_to);
    end.setHours(23, 59, 59, 999);

    findCond.created_at = { $gte: start, $lte: end };
  }
  if (req.query.product) {
    letProductFindCond = { name: { $regex: req.query.product, $options: "i" } };
    let productFind = await Product.find(letProductFindCond);
    let productIds = [];
    productFind.forEach((u) => {
      var o_id = new ObjectId(u._id);
      productIds.push(new ObjectId(o_id));
    });
    findCond.product = { $in: productIds };
  }
  total = await Diary.countDocuments(findCond);
  if (total == 0) {
    return res.send({ success: false, message: "No records available" });
  }
  totalPages = Math.ceil(total / limit, 2);
  let entryList = await Diary.find(findCond)
    .populate({
      path: "product",
      select: { name: 1, description: 1, weight: 1, laboratory_name: 1 },
      populate: {
        path: "strain",
        select: {
          name: 1,
        },
      },
    })
    .populate({
      path: "coa_id",
      select: { laboratory_name: 1, tested_at: 1 },
    })
    .populate({
      path: "pre_symptoms.symptom_id",
      select: { name: 1, icon: 1, image: 1 },
    })
    .populate({
      path: "desired_effects.effect_id",
      select: { name: 1, icon: 1, image: 1 },
    })
    .populate({
      path: "actual_effects.effect_id",
      select: { name: 1, icon: 1, image: 1 },
    })
    .populate({
      path: "pre_activities.activity_id",
      select: { name: 1, icon: 1, image: 1 },
    })
    .populate({
      path: "pre_condition.condition_id",
      select: { name: 1, icon: 1, image: 1 },
    })
    .limit(limit)
    .skip(skip)
    .sort({ created_at: -1 });
  //console.log(entryList)
  let entries = [];
  let entourage = [];
  let symptoms = [];
  let effects = [];
  let activities = [];
  let condition = [];
  if (entryList.length > 0) {
    for (var i = 0; i < entryList.length; i++) {
      if (entryList[i].pre_symptoms.length > 0) {
        for (var ii = 0; ii < entryList[i].pre_symptoms.length; ii++) {
          if (entryList[i].pre_symptoms[ii].symptom_id) {
            symptoms.push({
              symptom_id: entryList[i].pre_symptoms[ii].symptom_id._id,
              symptom_name: entryList[i].pre_symptoms[ii].symptom_id.name,
              symptom_image: entryList[i].pre_symptoms[ii].symptom_id.image
                ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/symptom/" +
                  entryList[i].pre_symptoms[ii].symptom_id.image
                : "https://admin.thecannabisdiary.net/images/logo.png",
              symptom_icon: entryList[i].pre_symptoms[ii].symptom_id.icon
                ? uploadDirPath +
                  "/symptom/" +
                  entryList[i].pre_symptoms[ii].symptom_id.icon
                : "https://admin.thecannabisdiary.net/images/logo.png",
            });
          }
        }
      }
      if (entryList[i].desired_effects.length > 0) {
        for (var ii = 0; ii < entryList[i].desired_effects.length; ii++) {
          if (entryList[i].desired_effects[ii].effect_id) {
          effects.push({
            effects_id: entryList[i].desired_effects[ii].effect_id._id,
            effects_name: entryList[i].desired_effects[ii].effect_id.name,
            effects_image: entryList[i].desired_effects[ii].effect_id.image
              ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/effect/" +
                entryList[i].desired_effects[ii].effect_id.image
              : "https://admin.thecannabisdiary.net/images/logo.png",
            effects_icon: entryList[i].desired_effects[ii].effect_id.icon
              ? uploadDirPath +
                "/effect/" +
                entryList[i].desired_effects[ii].effect_id.icon
              : "https://admin.thecannabisdiary.net/images/logo.png",
          });
        }
        }
      }
      if (entryList[i].pre_activities.length > 0) {
        for (var ii = 0; ii < entryList[i].pre_activities.length; ii++) {
          activities.push({
            activity_id: entryList[i].pre_activities[ii].activity_id._id,
            activity_name: entryList[i].pre_activities[ii].activity_id.name,
            activity_image: entryList[i].pre_activities[ii].activity_id.image
              ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/activity/" +
                entryList[i].pre_activities[ii].activity_id.image
              : "https://admin.thecannabisdiary.net/images/logo.png",
            activity_icon: entryList[i].pre_activities[ii].activity_id.icon
              ? uploadDirPath +
                "/activity/" +
                entryList[i].pre_activities[ii].activity_id.icon
              : "https://admin.thecannabisdiary.net/images/logo.png",
          });
        }
      }
      if (entryList[i].pre_condition.length > 0) {
        for (var ii = 0; ii < entryList[i].pre_condition.length; ii++) {
          condition.push({
            condition_id: entryList[i].pre_condition[ii].condition_id._id,
            condition_name: entryList[i].pre_condition[ii].condition_id.name,
            condition_image: entryList[i].pre_condition[ii].condition_id.image
              ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/condition/" +
                entryList[i].pre_condition[ii].condition_id.image
              : "https://admin.thecannabisdiary.net/images/logo.png",
            condition_icon: entryList[i].pre_condition[ii].condition_id.icon
              ? uploadDirPath +
                "/condition/" +
                entryList[i].pre_condition[ii].condition_id.icon
              : "https://admin.thecannabisdiary.net/images/logo.png",
          });
        }
      }
      entries.push({
        id: entryList[i]._id,
        name: entryList[i].product ? entryList[i].product.name : "",
        strain: entryList[i].product
          ? entryList[i].product.strain
            ? entryList[i].product.strain.name
            : ""
          : "",
        //created_at:CommonHelper.formatedDate(entryList[i].created_at,7) ,
        created_at: entryList[i].created_at,
        day: entryList[i].day_of_week,
        is_public: entryList[i].is_public,
        comments: entryList[i].comments,
        average_ratings: entryList[i].average_ratings,
        is_favourite: entryList[i].is_favourite,
        enjoy_taste: entryList[i].enjoy_taste,
        laboratory_name: entryList[i].coa_id
          ? entryList[i].coa_id.laboratory_name
          : "",
        tested_at: entryList[i].coa_id
          ? CommonHelper.formatedDate(entryList[i].coa_id.tested_at, 7)
          : "",
        weight: entryList[i].product ? entryList[i].product.weight : "",
        is_complete: entryList[i].is_complete,
        has_incompleteness_notified: entryList[i].has_incompleteness_notified,
      });
    }
    let mergedCondition = [];
    if (condition.length > 0) {
      mergedCondition = Object.values(
        condition.reduce((result, obj) => {
          let objKey = obj["condition_name"];
          result[objKey] = result[objKey] || {
            condition_id: obj["condition_id"],
            condition_name: obj["condition_name"],
            condition_image: obj["condition_image"],
            condition_icon: obj["condition_icon"],
            count: 0,
          };
          result[objKey].count += 1;
          return result;
        }, {})
      );
    }

    let mergedSymptoms = [];
    if (symptoms.length > 0) {
      mergedSymptoms = Object.values(
        symptoms.reduce((result, obj) => {
          let objKey = obj["symptom_name"];
          result[objKey] = result[objKey] || {
            symptom_id: obj["symptom_id"],
            symptom_name: obj["symptom_name"],
            symptom_image: obj["symptom_image"],
            symptom_icon: obj["symptom_icon"],
            count: 0,
          };
          result[objKey].count += 1;
          return result;
        }, {})
      );
    }

    let mergedEffects = [];
    if (effects.length > 0) {
      mergedEffects = Object.values(
        effects.reduce((result, obj) => {
          let objKey = obj["effects_name"];
          result[objKey] = result[objKey] || {
            effects_id: obj["effects_id"],
            effects_name: obj["effects_name"],
            effects_image: obj["effects_image"],
            effects_icon: obj["effects_icon"],
            count: 0,
          };
          result[objKey].count += 1;
          return result;
        }, {})
      );
    }

    let mergedActivities = [];
    if (activities.length > 0) {
      mergedActivities = Object.values(
        activities.reduce((result, obj) => {
          let objKey = obj["activity_name"];
          result[objKey] = result[objKey] || {
            activity_id: obj["activity_id"],
            activity_name: obj["activity_name"],
            activity_image: obj["activity_image"],
            activity_icon: obj["activity_icon"],
            count: 0,
          };
          result[objKey].count += 1;
          return result;
        }, {})
      );
    }
    mergedCondition.sort((a, b) =>
      a.condition_name > b.condition_name
        ? 1
        : b.condition_name > a.condition_name
        ? -1
        : 0
    );
    mergedSymptoms.sort((a, b) =>
      a.symptom_name > b.symptom_name
        ? 1
        : b.symptom_name > a.symptom_name
        ? -1
        : 0
    );
    mergedEffects.sort((a, b) =>
      a.effects_name > b.effects_name
        ? 1
        : b.effects_name > a.effects_name
        ? -1
        : 0
    );
    mergedActivities.sort((a, b) =>
      a.activity_name > b.activity_name
        ? 1
        : b.activity_name > a.activity_name
        ? -1
        : 0
    );

    entourage.push({
      pre_condition: mergedCondition,
      pre_symptoms: mergedSymptoms,
      actual_effects: mergedEffects,
      pre_activities: mergedActivities,
    });
  }
  let dataResponse = {
    entries,
    entourage,
    total,
    record_per_page: limit,
    total_pages: totalPages,
  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/diary-entries', request, dataResponse, userId, "Your entry list");
  res.send(resultResponse);
} catch(e) {
  console.log(e)
}
  /*res.send({
    success: true,
    message: "Your entry list",
    data: {
      entries,
      entourage,
      total,
      record_per_page: limit,
      total_pages: totalPages,
    },
  });*/
});

//@desc get list of user's incomplete diary entries
//route GET /api/incomplete-diary-entries
//@access Private
exports.getIncompleteDiaryEntries = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;

  let findCond = { user: userId, is_deleted: 0, is_active: 1, is_complete: 2 };
  if (req.query.search_date) {
    var start = new Date(req.query.search_date);
    start.setHours(0, 0, 0, 0);

    var end = new Date(req.query.search_date);
    end.setHours(23, 59, 59, 999);

    findCond.created_at = { $gte: start, $lte: end };
  }
  let entryList = await Diary.find(findCond)
    .populate({
      path: "product",
      select: { name: 1 },
      populate: {
        path: "strain",
        select: { name: 1 },
      },
    })
    .sort({ created_at: -1 });
  //console.log(entryList)
  let entries = [];
  if (entryList.length > 0) {
    for (var i = 0; i < entryList.length; i++) {
      var isMyEntryFlag = 2;
      if (entryList[i].user.equals(userId)) {
        isMyEntryFlag = 1;
      }

      entries.push({
        id: entryList[i]._id,
        name: entryList[i].product ? entryList[i].product.name : "",
        strain: entryList[i].product
          ? entryList[i].product.strain
            ? entryList[i].product.strain.name
            : ""
          : "",
        created_at: CommonHelper.formatedDate(entryList[i].created_at, 7),
        day: entryList[i].day_of_week,
        is_public: entryList[i].is_public,
        comments: entryList[i].comments,
        average_ratings: entryList[i].average_ratings,
        is_favourite: isMyEntryFlag == 1 ? entryList[i].is_favourite : 0,
        enjoy_taste: isMyEntryFlag == 1 ? entryList[i].enjoy_taste : false,
      });
    }
  }
  let dataResponse = { entries };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/incomplete-diary-entries', request, dataResponse, userId, "Your incomplete entry list");
  res.send(resultResponse);
  /*res.send({
    success: true,
    message: "Your incomplete entry list",
    data: { entries },
  });*/
});

//@desc get diary entry details
//route GET /api/get-entry-details
//@access Private
exports.getDiaryEntryDetails = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  var uploadDirPath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin";
  let findCond = { _id: req.query.entry_id, is_deleted: 0 };

  let entryInfo = await Diary.findOne(findCond)
    .populate({
      path: "user",
      select: {
        full_name: 1,
      },
    })
    .populate({
      path: "product",
      select: {
        name: 1,
        description: 1,
        product_image: 1,
        weight: 1,
        laboratory_name: 1,
        product_type: 1,
      },
      // populate:{
      //     path:"product_type",
      //     select:{"parent_id":1},
      //     // populate:{
      //     //     path:"parent_id",
      //     //     select:{"name":1}
      //     // }
      // },
      populate: [
        {
          path: "product_type",
          model: "ProductType",
          select: { name: 1, parent_id: 1, type: 1 },
          populate: {
            path: "parent_id",
            model: "ProductType",
            select: { name: 1 },
          },
        },
        {
          path: "strain",
          model: "Strain",
          select: { name: 1 },
        },
      ],
      /*populate:{
            path:'product_type',
            select:{"name":1,"parent_id":1}
        },
        populate:{
            path:'strain',
            select:{"name":1}
        }*/
    })
    .populate({
      path: "consumption_negative.negative_id",
      select: { name: 1 },
    })
    .populate({
      path: "desired_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "desired_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "desired_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "desired_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "cannabinoid_profile.composition_id",
      select: { name: 1, description: 1 },
    })
    .populate({
      path: "terpenes.composition_id",
      select: { name: 1, description: 1 },
    })
    .populate({
      path: "consumption_method",
      select: { name: 1 },
    })
    .populate({
      path: "mood_before_consumption",
      select: { name: 1 },
    })
    .populate({
      path: "consumption_negative",
      select: { name: 1 },
    })
    .populate({
      path: "user_comments.commented_by",
      select: { full_name: 1 },
    })
    .populate({
      path: "coa_id",
      select: { laboratory_name: 1, tested_at: 1 },
    });

  if (!entryInfo) {
    return res.send({ success: false, message: "Entry does not exist" });
  }
  var prdImagePath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/product/";
  var product_image = "";
  if (entryInfo.product) {
    product_image = entryInfo.product.product_image
      ? prdImagePath + entryInfo.product.product_image
      : "";
  }

  let consumptionNegetives = [];
  if (entryInfo.consumption_negative.length > 0) {
    for (var e = 0; e < entryInfo.consumption_negative.length; e++) {
      consumptionNegetives.push({
        negative_id: entryInfo.consumption_negative[e].negative_id._id,
        negative_name: entryInfo.consumption_negative[e].negative_id.name,
      });
    }
  }
  //Desired
  let desiredActivities = [];
  if (entryInfo.desired_activities.length > 0) {
    for (var e = 0; e < entryInfo.desired_activities.length; e++) {
      if (entryInfo.desired_activities[e].activity_id) {
        desiredActivities.push({
          activity_id: entryInfo.desired_activities[e].activity_id._id,
          activity_name: entryInfo.desired_activities[e].activity_id.name,
          activity_icon: entryInfo.desired_activities[e].activity_id.icon
            ? uploadDirPath +
              "/activity/" +
              entryInfo.desired_activities[e].activity_id.icon
            : "",
        });
      }
    }
  }
  let desiredSymptoms = [];
  if (entryInfo.desired_symptoms.length > 0) {
    for (var s = 0; s < entryInfo.desired_symptoms.length; s++) {
      desiredSymptoms.push({
        symptom_id: entryInfo.desired_symptoms[s].symptom_id._id,
        symptom_name: entryInfo.desired_symptoms[s].symptom_id.name,
        symptom_icon: entryInfo.desired_symptoms[s].symptom_id.icon
          ? uploadDirPath +
            "/symptom/" +
            entryInfo.desired_symptoms[s].symptom_id.icon
          : "",
      });
    }
  }
  let desiredEffects = [];
  if (entryInfo.desired_effects.length > 0) {
    for (var e = 0; e < entryInfo.desired_effects.length; e++) {
      if (entryInfo.desired_effects[e].effect_id) {
        desiredEffects.push({
          effect_id: entryInfo.desired_effects[e].effect_id._id,
          effect_name: entryInfo.desired_effects[e].effect_id.name,
          effect_icon: entryInfo.desired_effects[e].effect_id.icon
            ? uploadDirPath +
              "/effect/" +
              entryInfo.desired_effects[e].effect_id.icon
            : "",
        });
      }
    }
  }
  let desiredCondition = [];
  if (entryInfo.desired_condition.length > 0) {
    for (var e = 0; e < entryInfo.desired_condition.length; e++) {
      if (entryInfo.desired_condition[e].effect_id) {
        desiredCondition.push({
          condition_id: entryInfo.desired_condition[a].condition_id._id,
          condition_name: entryInfo.desired_condition[a].condition_id.name,
          condition_icon: entryInfo.desired_condition[a].condition_id.icon
            ? uploadDirPath +
              "/condition/" +
              entryInfo.desired_condition[a].condition_id.icon
            : "",
        });
      }
    }
  }
  let actualEffects = [];
  if (entryInfo.actual_effects.length > 0) {
    for (var e = 0; e < entryInfo.actual_effects.length; e++) {
      if (entryInfo.actual_effects[e].effect_id) {
        actualEffects.push({
          effect_id: entryInfo.actual_effects[e].effect_id._id,
          effect_name: entryInfo.actual_effects[e].effect_id.name,
          effect_icon: entryInfo.actual_effects[e].effect_id.icon
            ? uploadDirPath +
              "/effect/" +
              entryInfo.actual_effects[e].effect_id.icon
            : "",
        });
      }
    }
  }
  let actualActivities = [];
  if (entryInfo.actual_activities.length > 0) {
    for (var e = 0; e < entryInfo.actual_activities.length; e++) {
      if (entryInfo.actual_activities[e].activity_id) {
        actualActivities.push({
          activity_id: entryInfo.actual_activities[e].activity_id._id,
          activity_name: entryInfo.actual_activities[e].activity_id.name,
          activity_icon: entryInfo.actual_activities[e].activity_id.icon
            ? uploadDirPath +
              "/activity/" +
              entryInfo.actual_activities[e].activity_id.icon
            : "",
        });
      }
    }
  }
  let actualSymptoms = [];
  if (entryInfo.actual_symptoms.length > 0) {
    for (var s = 0; s < entryInfo.actual_symptoms.length; s++) {
      actualSymptoms.push({
        symptom_id: entryInfo.actual_symptoms[s].symptom_id._id,
        symptom_name: entryInfo.actual_symptoms[s].symptom_id.name,
        symptom_icon: entryInfo.actual_symptoms[s].symptom_id.icon
          ? uploadDirPath +
            "/symptom/" +
            entryInfo.actual_symptoms[s].symptom_id.icon
          : "",
      });
    }
  }
  let actualCondition = [];
  if (entryInfo.actual_condition.length > 0) {
    for (var e = 0; e < entryInfo.actual_condition.length; e++) {
      if (entryInfo.actual_condition[e].condition_id) {
        actualCondition.push({
          condition_id: entryInfo.actual_condition[e].condition_id._id,
          condition_name: entryInfo.actual_condition[e].condition_id.name,
          condition_icon: entryInfo.actual_condition[e].condition_id.icon
            ? uploadDirPath +
              "/condition/" +
              entryInfo.actual_condition[e].condition_id.icon
            : "",
        });
      }
    }
  }
  let midpointEffects = [];
  if (entryInfo.midpoint_effects.length > 0) {
    for (var e = 0; e < entryInfo.midpoint_effects.length; e++) {
      if (entryInfo.midpoint_effects[e].effect_id) {
        midpointEffects.push({
          effect_id: entryInfo.midpoint_effects[e].effect_id._id,
          effect_name: entryInfo.midpoint_effects[e].effect_id.name,
          effect_icon: entryInfo.midpoint_effects[e].effect_id.icon
            ? uploadDirPath +
              "/effect/" +
              entryInfo.midpoint_effects[e].effect_id.icon
            : "",
        });
      }
    }
  }
  let midpointActivities = [];
  if (entryInfo.midpoint_activities.length > 0) {
    for (var e = 0; e < entryInfo.midpoint_activities.length; e++) {
      if (entryInfo.midpoint_activities[e].activity_id) {
        midpointActivities.push({
          activity_id: entryInfo.midpoint_activities[e].activity_id._id,
          activity_name: entryInfo.midpoint_activities[e].activity_id.name,
          activity_icon: entryInfo.midpoint_activities[e].activity_id.icon
            ? uploadDirPath +
              "/activity/" +
              entryInfo.midpoint_activities[e].activity_id.icon
            : "",
        });
      }
    }
  }
  let midpointSymptoms = [];
  if (entryInfo.midpoint_symptoms.length > 0) {
    for (var s = 0; s < entryInfo.midpoint_symptoms.length; s++) {
      midpointSymptoms.push({
        symptom_id: entryInfo.midpoint_symptoms[s].symptom_id._id,
        symptom_name: entryInfo.midpoint_symptoms[s].symptom_id.name,
        symptom_icon: entryInfo.midpoint_symptoms[s].symptom_id.icon
          ? uploadDirPath +
            "/symptom/" +
            entryInfo.midpoint_symptoms[s].symptom_id.icon
          : "",
      });
    }
  }
  let midpointCondition = [];
  if (entryInfo.midpoint_condition.length > 0) {
    for (var e = 0; e < entryInfo.midpoint_condition.length; e++) {
      if (entryInfo.midpoint_condition[e].condition_id) {
        midpointCondition.push({
          condition_id: entryInfo.midpoint_condition[e].condition_id._id,
          condition_name: entryInfo.midpoint_condition[e].condition_id.name,
          condition_icon: entryInfo.midpoint_condition[e].condition_id.icon
            ? uploadDirPath +
              "/condition/" +
              entryInfo.midpoint_condition[e].condition_id.icon
            : "",
        });
      }
    }
  }
  let symptoms = [];
  if (entryInfo.pre_symptoms.length > 0) {
    for (var s = 0; s < entryInfo.pre_symptoms.length; s++) {
      symptoms.push({
        symptom_id: entryInfo.pre_symptoms[s].symptom_id._id,
        symptom_name: entryInfo.pre_symptoms[s].symptom_id.name,
        symptom_icon: entryInfo.pre_symptoms[s].symptom_id.icon
          ? uploadDirPath +
            "/symptom/" +
            entryInfo.pre_symptoms[s].symptom_id.icon
          : "",
      });
    }
  }
  let activities = [];
  if (entryInfo.pre_activities.length > 0) {
    for (var a = 0; a < entryInfo.pre_activities.length; a++) {
      activities.push({
        activity_id: entryInfo.pre_activities[a].activity_id._id,
        activity_name: entryInfo.pre_activities[a].activity_id.name,
        activity_icon: entryInfo.pre_activities[a].activity_id.icon
          ? uploadDirPath +
            "/activity/" +
            entryInfo.pre_activities[a].activity_id.icon
          : "",
      });
    }
  }
  let condition = [];
  if (entryInfo.pre_condition.length > 0) {
    for (var a = 0; a < entryInfo.pre_condition.length; a++) {
      condition.push({
        condition_id: entryInfo.pre_condition[a].condition_id._id,
        condition_name: entryInfo.pre_condition[a].condition_id.name,
        condition_icon: entryInfo.pre_condition[a].condition_id.icon
          ? uploadDirPath +
            "/condition/" +
            entryInfo.pre_condition[a].condition_id.icon
          : "",
      });
    }
  }
  let effects = [];
  if (entryInfo.pre_effects.length > 0) {
    for (var a = 0; a < entryInfo.pre_effects.length; a++) {
      condition.push({
        effect_id: entryInfo.pre_effects[a].effect_id._id,
        effect_name: entryInfo.pre_effects[a].effect_id.name,
        effect_icon: entryInfo.pre_effects[a].effect_id.icon
          ? uploadDirPath + "/effect/" + entryInfo.pre_effects[a].effect_id.icon
          : "",
      });
    }
  }
  //composition information

  let cannabinoid_profile = [];
  if (entryInfo.cannabinoid_profile.length > 0) {
    for (c = 0; c < entryInfo.cannabinoid_profile.length; c++) {
      if (
        entryInfo.cannabinoid_profile[c].weight &&
        entryInfo.cannabinoid_profile[c].weight > 0
      ) {
        cannabinoid_profile.push({
          composition_id: entryInfo.cannabinoid_profile[c].composition_id._id,
          composition_name:
            entryInfo.cannabinoid_profile[c].composition_id.name,
          composition_description: entryInfo.cannabinoid_profile[c]
            .composition_id.description
            ? entryInfo.cannabinoid_profile[c].composition_id.description
            : "",
          weight: entryInfo.cannabinoid_profile[c].weight,
        });
      }
    }
    cannabinoid_profile = cannabinoid_profile.sort(
      CommonHelper.dynamicSort("weight")
    );
  }
  let terpenes = [];
  if (entryInfo.terpenes.length > 0) {
    for (c = 0; c < entryInfo.terpenes.length; c++) {
      if (entryInfo.terpenes[c].weight && entryInfo.terpenes[c].weight > 0) {
        terpenes.push({
          composition_id: entryInfo.terpenes[c].composition_id._id,
          composition_name: entryInfo.terpenes[c].composition_id.name,
          composition_description: entryInfo.terpenes[c].composition_id
            .description
            ? entryInfo.terpenes[c].composition_id.description
            : "",
          weight: entryInfo.terpenes[c].weight,
        });
      }
    }
    terpenes = terpenes.sort(CommonHelper.dynamicSort("weight"));
  }
  // let user_comments = []
  // if(entryInfo.user_comments){
  //     for(var uc=0;uc<entryInfo.user_comments.length;uc++){
  //         user_comments.push({
  //             commented_by:entryInfo.user_comments[uc].commented_by.full_name,
  //             comment:entryInfo.user_comments[uc].comment,
  //             created_at:CommonHelper.formatedDate(entryInfo.user_comments[uc].created_at,7)
  //         })
  //     }
  // }
  var isMyEntryFlag = 2;
  if (entryInfo.user.equals(userId)) {
    isMyEntryFlag = 1;
  }
  var is_parent_product_type = 0;
  if (entryInfo.product) {
    is_parent_product_type = entryInfo.product.product_type
      ? entryInfo.product.product_type.type == 1
        ? 1
        : 2
      : 0;
  }
  // console.log('hi')
  // console.log(is_parent_product_type)
  let entryDetails = {
    id: entryInfo._id,
    user_name: entryInfo.user ? entryInfo.user.full_name : "",
    name: entryInfo.product ? entryInfo.product.name : "",
    is_parent: is_parent_product_type,
    parent_product_type:
      is_parent_product_type == 2
        ? entryInfo.product.product_type.parent_id
          ? entryInfo.product.product_type.parent_id._id
          : ""
        : "",
    parent_product_type_name:
      is_parent_product_type == 2
        ? entryInfo.product.product_type.parent_id.name
        : "",
    product_type: entryInfo.product
      ? entryInfo.product.product_type
        ? entryInfo.product.product_type._id
        : ""
      : "",
    product_type_name: entryInfo.product
      ? entryInfo.product.product_type
        ? entryInfo.product.product_type.name
        : ""
      : "",
    product_id: entryInfo.product ? entryInfo.product._id : "",
    strain: entryInfo.product
      ? entryInfo.product.strain
        ? entryInfo.product.strain.name
        : ""
      : "",
    description: entryInfo.product ? entryInfo.product.description : "",
    weight: entryInfo.product ? entryInfo.product.weight : "",
    consumption_method: entryInfo.consumption_method
      ? entryInfo.consumption_method._id
      : "",
    consumption_method_name: entryInfo.consumption_method
      ? entryInfo.consumption_method.name
      : "",
    consumption_scale: entryInfo.consumption_scale
      ? entryInfo.consumption_scale
      : "",
    consumption_unit: entryInfo.consumption_unit
      ? entryInfo.consumption_unit
      : "",
    consumed_amount:
      entryInfo.consumption_scale + " " + entryInfo.consumption_unit,
    created_at: CommonHelper.formatedDate(entryInfo.created_at, 7),
    day: entryInfo.day_of_week,
    is_public: entryInfo.is_public,
    comments: entryInfo.comments,
    average_ratings: entryInfo.average_ratings,
    pre_symptoms: symptoms,
    desired_effects: desiredEffects,
    desired_activities: desiredActivities,
    desired_symptoms: desiredSymptoms,
    desired_condition: desiredCondition,
    actual_effects: actualEffects,
    actual_activities: actualActivities,
    actual_symptoms: actualSymptoms,
    actual_condition: actualCondition,
    midpoint_effects: midpointEffects,
    midpoint_activities: midpointActivities,
    midpoint_symptoms: midpointSymptoms,
    midpoint_condition: midpointCondition,
    pre_activities: activities,
    pre_condition: condition,
    consumption_negative: consumptionNegetives,
    is_favourite: isMyEntryFlag == 1 ? entryInfo.is_favourite : 0,
    enjoy_taste: isMyEntryFlag == 1 ? entryInfo.enjoy_taste : false,
    cannabinoid_profile,
    terpenes,
    eat_before_consumption: entryInfo.eat_before_consumption,
    consumption_time: entryInfo.consumption_time,
    consumption_place: entryInfo.consumption_place,
    consumption_partner: entryInfo.consumption_partner,
    consumption_partner: entryInfo.consumption_partner,
    consumption_negative: entryInfo.consumption_negative
      ? entryInfo.consumption_negative._id
      : "",
    consumption_negative_name: entryInfo.consumption_negative
      ? entryInfo.consumption_negative.name
      : "",
    mood_before_consumption: entryInfo.mood_before_consumption
      ? entryInfo.mood_before_consumption._id
      : "",
    mood_before_consumption_name: entryInfo.mood_before_consumption
      ? entryInfo.mood_before_consumption.name
      : "",
    consume_cannabis_before: entryInfo.consume_cannabis_before,
    consume_time: entryInfo.consume_time,
    is_complete: entryInfo.is_complete,
    is_my_entry: isMyEntryFlag,
    product_image,
    laboratory_name: "",
    tested_at: "",
  };
  if (entryInfo.coa_id) {
    entryDetails.coa_id = entryInfo.coa_id._id;
    entryDetails.laboratory_name = entryInfo.coa_id
      ? entryInfo.coa_id.laboratory_name
      : "";
    entryDetails.tested_at = entryInfo.coa_id
      ? CommonHelper.formatedDate(entryInfo.coa_id.tested_at, 7)
      : "";
  } else {
    entryDetails.coa_id = "";
  }
  let dataResponse = { details: entryDetails };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-entry-details', request, dataResponse, userId, "Your entry details");
  res.send(resultResponse);
  /*res.send({
    success: true,
    message: "Your entry details",
    data: { details: entryDetails },
  });*/
});

//@desc get list of diary entries blocked
//route GET /api/public-entries/blocked
//@access Private
exports.getPublicEntriesBlocked = asyncHandler(async (req, res, next) => {
  try {
    var curUserId = req.user._id;
    let findCond = { is_deleted: 0, is_active: 1, blocked_by: curUserId };
    var profileImgPath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/";
    let userFind = await UserBlocked.find(findCond).populate({
      path: "blocked_userid",
      select: { full_name: 1, _id: 1, profile_image: 1 },
    });
    let blocked_users = [];
    for (var r = 0; r < userFind.length; r++) {
      blocked_users.push({
        blocked_userid: userFind[r].blocked_userid._id,
        user_fullname: userFind[r].blocked_userid.full_name,
        user_profileimage:
          !!profileImgPath + userFind[r].blocked_userid.profile_image
            ? profileImgPath + userFind[r].blocked_userid.profile_image
            : "",
        created_at: userFind[r].created_at,
        is_active: userFind[r].is_active,
        is_deleted: userFind[r].is_deleted,
      });
    }
    var total = userFind.length;
    let dataResponse = { blocked_users, total };
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    //let userId = (req.user) ? req.user._id: null;
    let resultResponse = await ResponseHandler.responseHandler('/api/public-entries/blocked', request, dataResponse, userId, "Blocked User Lists");
    res.send(resultResponse);
    /*res.send({
      success: true,
      message: "Blocked User Lists",
      data: { blocked_users, total },
    });*/
  } catch (e) {
    res.send({ success: false, message: e });
  }
});

//@desc post diary entries for un blocking
//route GET /api/public-entries/unblocked
//@access Private
exports.getPublicEntriesUnBlock = asyncHandler(async (req, res, next) => {
  try {
    var curUserId = req.user._id;
    let blockedUserid = req.body.user_id;
    let findCond = {
      is_deleted: 0,
      is_active: "1",
      blocked_by: ObjectId(curUserId),
      blocked_userid: ObjectId(blockedUserid),
    };
    const unblockUser = await UserBlocked.findOneAndUpdate(findCond, {
      is_deleted: 1,
    });
    if (unblockUser) {
      let dataResponse = {  };
      let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
      //let userId = (req.user) ? req.user._id: null;
      let resultResponse = await ResponseHandler.responseHandler('/api/public-entries/unblocked', request, dataResponse, userId, "User has been unblocked.");
      res.send(resultResponse);
      /*res.send({ success: true, message: "User has been unblocked." });*/
    }
  } catch (e) {
    res.send({ success: false, message: e });
  }
});

//@desc post diary entries for blocking
//route GET /api/public-entries/block
//@access Private
exports.getPublicEntriesBlock = asyncHandler(async (req, res, next) => {
  try {
    var curUserId = req.user._id;
    console.log(req.body.user_id);
    let blockedUserid = req.body.user_id;
    let findCond = {
      is_active: 1,
      is_deleted: 0,
      blocked_by: curUserId,
      blocked_userid: blockedUserid,
    };
    const userFind = await UserBlocked.find(findCond);
    if (userFind.length > 0) {
      let dataResponse = {  };
      let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
      //let userId = (req.user) ? req.user._id: null;
      let resultResponse = await ResponseHandler.responseHandler('/api/public-entries/block', request, dataResponse, userId, "User has already been blocked");
      res.send(resultResponse);
      //res.send({ success: false, message: "User has already been blocked" });
    } else {
      const newUserBlocked = new UserBlocked({
        blocked_userid: blockedUserid,
        blocked_by: curUserId,
      });

      await newUserBlocked.save();
      let dataResponse = {  };
      let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
      //let userId = (req.user) ? req.user._id: null;
      let resultResponse = await ResponseHandler.responseHandler('/api/public-entries/block', request, dataResponse, userId, "User has been blocked");
      res.send(resultResponse);
      //res.send({ success: true, message: "User has been blocked" });
    }
  } catch (e) {
    res.send({ success: false, message: e });
  }
});

//@desc post new coa entries
//route GET /api/upload-coa
//@access Private
exports.uploadCoa = asyncHandler(async (req, res, next) => {
  const processFile = await awsTextTract(req.file.key);

  if (!!processFile.success) {
    var new_coa = {
      job_id: processFile.JobId,
      filename: req.file.key,
      originalFilename: req.file.originalname,
      job_status: "In Progress",
    };
    await COAJobsStatus.create(new_coa)
      .then((response) => {
        if (response) {
          //req.flash('success_msg', req.file.originalname+' has been processed with JobID ' + processFile.JobId + ' .')
          res.send({
            success: true,
            message:
              req.file.originalname +
              " has been processed with JobID " +
              processFile.JobId +
              " .",
            data: { filename: req.file.originalname, JobID: processFile.JobId },
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send({ success: false, message: err });
      });
  } else {
    res.send({
      success: false,
      message: "Something went wrong please contact your admin!",
    });
  }
});

//@desc get list of diary entries
//route GET /api/public-entries
//@access Private
exports.getPublicEntries = asyncHandler(async (req, res, next) => {
  try {
  var userId = req.user._id;
  var limit = 20;
  var skip = 0;
  var total = 0;
  var totalPages = 0;
  let findCond = { is_complete: 1, is_deleted: 0, is_active: 1, is_public: 1 };
  if (req.query.search_text) {
    var searchText = req.query.search_text;
    findCond.$or = [
      { keywords: { $regex: searchText, $options: "i" } },
      {name:{ '$regex' : searchText, '$options' : 'i' }}
    ];
    var logEntry = {
      search_terms: searchText,
      type: "getDiaryEntries",
      search_by: userId,
    };
    await SearchLogs.create(logEntry);
  }
  console.log(findCond)
  if (req.query.is_public) {
    findCond.is_public = Number(req.query.is_public);
  }
  if (req.query.user) {
    letUserFindCond = { full_name: { $regex: req.query.user, $options: "i" } };
    let userFind = await User.find(letUserFindCond);
    let userIds = [];
    userFind.forEach((u) => {
      var o_id = new ObjectId(u._id);
      userIds.push(new ObjectId(o_id));
    });
    findCond.user = { $in: userIds };
  }
  if (req.query.product) {
    letProductFindCond = { name: { $regex: req.query.product, $options: "i" } };
    let productFind = await Product.find(letProductFindCond);
    let productIds = [];
    productFind.forEach((u) => {
      var o_id = new ObjectId(u._id);
      productIds.push(new ObjectId(o_id));
    });
    findCond.product = { $in: productIds };
  }
  if (req.query.state) {
    findCond.state = req.query.state;
  }
  //console.log(req.query.ratings)
  if (req.query.ratings) {
    findCond.average_ratings = req.query.ratings;
  }
  if (req.query.search_date_from && req.query.search_date_to) {
    var start = new Date(req.query.search_date_from);
    start.setHours(0, 0, 0, 0);

    var end = new Date(req.query.search_date_to);
    end.setHours(23, 59, 59, 999);

    findCond.created_at = { $gte: start, $lte: end };
  }
  if (req.query.page && req.query.page > 0) {
    var page = req.query.page;
    skip = parseInt(page - 1) * limit;
  }
  //console.log(findCond)
  total = await Diary.countDocuments(findCond);
  if (total == 0) {
    return res.send({ success: false, message: "No records available" });
  }
  let findBlockedCond = { is_active: 1, is_deleted: 0, blocked_by: userId };
  const userFind = await UserBlocked.find(findBlockedCond).select({
    blocked_userid: 1,
  });
  totalPages = Math.ceil(total / limit, 2);
  let entryList = await Diary.find(findCond)
    .populate({
      path: "user",
      select: { full_name: 1, _id: 1, profile_image: 1 },
    })
    .populate({
      path: "product",
      select: { name: 1, description: 1, product_image: 1, weight: 1 },
      populate: {
        path: "strain",
        select: { name: 1 },
      },
      populate: {
        path: "product_type",
        select: {
          name: 1,
        },
      },
    })
    .limit(limit)
    .skip(skip)
    .sort({ created_at: -1 });
  var profileImgPath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/";
  //console.log(entryList)
  let entries = [];
  if (entryList.length > 0) {
    for (var i = 0; i < entryList.length; i++) {
      let continuenext = false;
      var isMyEntryFlag = 2;
      if (entryList[i].user.equals(userId)) {
        isMyEntryFlag = 1;
      }
      for (var x = 0; x < userFind.length; x++) {
        let blockedUserId = JSON.stringify(userFind[x].blocked_userid);
        let useridCheck = JSON.stringify(entryList[i].user._id);
        if (blockedUserId === useridCheck) {
          continuenext = true;
        }
      }
      if (continuenext === true) continue;
      /*let effects = []
            if(entryList[i].pre_effects.length > 0){
                for(var e=0;e<entryList[i].pre_effects.length;e++){
                    effects.push({
                        effect_id:entryList[i].pre_effects[e].effect_id._id,
                        effect_name:entryList[i].pre_effects[e].effect_id.name
                    })
                }
            }
            let symptoms = []
            if(entryList[i].pre_symptoms.length > 0){
                for(var s=0;s<entryList[i].pre_symptoms.length;s++){
                    symptoms.push({
                        symptom_id:entryList[i].pre_symptoms[s].symptom_id._id,
                        symptom_name:entryList[i].pre_symptoms[s].symptom_id.name
                    })
                }
            }
            let activities = []
            if(entryList[i].pre_activities.length > 0){
                for(var a=0;a<entryList[i].pre_activities.length;a++){
                    activities.push({
                        activity_id:entryList[i].pre_activities[a].activity_id._id,
                        activity_name:entryList[i].pre_activities[a].activity_id.name
                    })
                }
            }*/
      var deFaultimagePath =
        "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png";
      entries.push({
        id: entryList[i]._id,
        user_name: entryList[i].user ? entryList[i].user.full_name : "",
        user_profileimage: entryList[i].user.profile_image
          ? profileImgPath + entryList[i].user.profile_image
          : deFaultimagePath,
        user_id: entryList[i].user ? entryList[i].user._id : "",
        name: entryList[i].product ? entryList[i].product.name : "",
        product_image: entryList[i].product
          ? entryList[i].product.product_image
          : "",
        product_type: entryList[i].product
          ? (entryList[i].product.product_type) ? entryList[i].product.product_type.name : ''
          : "",
        description: entryList[i].product
          ? CommonHelper.getExcerpt(entryList[i].product.description, 20)
          : "",
        //comments:(entryList[i].comments)? CommonHelper.getExcerpt(entryList[i].comments,20): entryList[i].comments,
        strain: entryList[i].product
          ? entryList[i].product.strain
            ? entryList[i].product.strain.name
            : ""
          : "",
        created_at: CommonHelper.formatedDate(entryList[i].created_at, 7),
        day: entryList[i].day_of_week,
        is_public: entryList[i].is_public,
        comments: entryList[i].comments,
        average_ratings: entryList[i].average_ratings,
        is_favourite: isMyEntryFlag == 1 ? entryList[i].is_favourite : 0,
        enjoy_taste: isMyEntryFlag == 1 ? entryList[i].enjoy_taste : false,
        is_my_entry: isMyEntryFlag,
      });
    }
  }

  let dataResponse = { entries, total, record_per_page: limit, total_pages: totalPages };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/public-entries', request, dataResponse, userId, "Public entries");
  res.send(resultResponse);
  } catch(e) {
    res.send({
      success: false,
      message: e
    });
    console.log(e)
  }

  /*res.send({
    success: true,
    message: "Public entries",
    data: { entries, total, record_per_page: limit, total_pages: totalPages },
  });*/
});

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

//@desc get list of all diary entries
//route GET /api/all-diary-entries
//@access Private
exports.getAllEntries = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  var limit = 20;
  var skip = 0;
  var total = 0;
  var totalPages = 0;
  let findCond = {
    $and: [
      //{is_complete:1},
      { is_active: 1 },
      { is_deleted: 0 },
      { $or: [{ user: userId }, { is_public: 1 }] },
    ],
  };
  if (req.query.search_text) {
    var searchText = req.query.search_text;
    findCond.$or = [
      { keywords: { $regex: searchText, $options: "i" } },
      { name: { $regex: searchText, $options: "i" } },
    ];
    var logEntry = {
      search_terms: searchText,
      type: "getAllEntries",
      search_by: userId,
    };
    await SearchLogs.create(logEntry);
  }
  if (req.query.is_public) {
    findCond.is_public = req.query.is_public;
  }
  if (req.query.ratings) {
    findCond.average_ratings = req.query.ratings;
  }
  if (req.query.search_date_from && req.query.search_date_to) {
    var start = new Date(req.query.search_date_from);
    start.setHours(0, 0, 0, 0);

    var end = new Date(req.query.search_date_to);
    end.setHours(23, 59, 59, 999);

    findCond.created_at = { $gte: start, $lte: end };
  }
  if (req.query.page && req.query.page > 0) {
    var page = req.query.page;
    skip = parseInt(page - 1) * limit;
  }
  total = await Diary.countDocuments(findCond);
  if (total == 0) {
    return res.send({ success: false, message: "No records available" });
  }
  totalPages = Math.ceil(total / limit, 2);
  let entryList = await Diary.find(findCond)
    .populate({
      path: "user",
      select: { full_name: 1 },
    })
    .populate({
      path: "product",
      select: {
        name: 1,
        description: 1,
        weight: 1,
        laboratory_name: 1,
        description: 1,
      },
      populate: {
        path: "strain",
        select: { name: 1 },
      },
    })
    .populate({
      path: "cannabinoid_profile",
      select: { _id: 1, weight: 1 },
      populate: {
        path: "composition_id",
        select: { name: 1 },
      },
    })
    .populate({
      path: "terpenes",
      select: { _id: 1, weight: 1 },
      populate: {
        path: "composition_id",
        select: { name: 1 },
      },
    })
    .populate({
      path: "coa_id",
      select: { tested_at: 1, laboratory_name: 1 },
    })
    .populate({
      path: "consumption_method",
      select: { name: 1, _id: 1 },
    })
    .populate({
      path: "desired_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "desired_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "desired_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "desired_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "actual_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "midpoint_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_symptoms.symptom_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_activities.activity_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_condition.condition_id",
      select: { name: 1, icon: 1 },
    })
    .populate({
      path: "pre_effects.effect_id",
      select: { name: 1, icon: 1 },
    })
    .limit(limit)
    .skip(skip)
    .sort({ created_at: -1 });
  //console.log(entryList)
  let entries = [];
  let filterEntries = [];
  if (entryList.length > 0) {
    let product_names = [];
    let cannabinoids_profile = [];
    let terpenes_profile = [];
    let consumption_method = [];
    let activities = [];
    let effects = [];
    let symptoms = [];
    let conditions = [];
    try {
      let proceed = false;
      for (var i = 0; i < entryList.length; i++) {
        proceed = false;
        var isMyEntryFlag = 2;
        if (entryList[i].user.equals(userId)) {
          isMyEntryFlag = 1;
        }
        if (entryList[i].product) {
          product_names.push({ name: entryList[i].product.name });
          if (req.query.advance_search) {
            if (entryList[i].product.name === req.query.advance_search) {
              proceed = true;
            }
          }
        }
        if (entryList[i].cannabinoid_profile.cannabinoid_id) {
          cannabinoids_profile.push({
            name: entryList[i].cannabinoid_profile.cannabinoid_id.name,
          });
          if (req.query.advance_search) {
            if (
              entryList[i].cannabinoid_profile.cannabinoid_id.name ===
              req.query.advance_search
            ) {
              proceed = true;
            }
          }
        }
        if (entryList[i].terpenes.cannabinoid_id) {
          terpenes_profile.push({
            name: entryList[i].terpenes.cannabinoid_id.name,
          });
          if (req.query.advance_search) {
            if (
              entryList[i].terpenes.cannabinoid_id.name ===
              req.query.advance_search
            ) {
              proceed = true;
            }
          }
        }
        if (entryList[i].consumption_method) {
          consumption_method.push({
            name: entryList[i].consumption_method.name,
            id: entryList[i].consumption_method._id,
          });
          if (req.query.advance_search) {
            if (
              entryList[i].consumption_method.name === req.query.advance_search
            ) {
              proceed = true;
            }
          }
        }
        if (entryList[i].pre_symptoms.length > 0) {
          for (var g = 0; g < entryList[i].pre_symptoms.length; g++) {
            if (entryList[i].pre_symptoms[g].symptom_id) {
              symptoms.push({
                name: entryList[i].pre_symptoms[g].symptom_id.name,
              });
              if (req.query.advance_search) {
                if (
                  entryList[i].pre_symptoms[g].symptom_id.name ===
                  req.query.advance_search
                ) {
                  proceed = true;
                }
              }
            }
          }
        }
        if (entryList[i].pre_condition.length > 0) {
          for (var d = 0; d < entryList[i].pre_condition.length; d++) {
            if (entryList[i].pre_condition[d].condition_id) {
              conditions.push({
                name: entryList[i].pre_condition[d].condition_id.name,
              });
              if (req.query.advance_search) {
                if (
                  entryList[i].pre_condition[d].condition_id.name ===
                  req.query.advance_search
                ) {
                  proceed = true;
                }
              }
            }
          }
        }
        if (entryList[i].pre_effects.length > 0) {
          for (var e = 0; e < entryList[i].pre_effects.length; e++) {
            if (entryList[i].pre_effects[e].effect_id) {
              effects.push({
                name: entryList[i].pre_effects[e].effect_id.name,
              });
              if (req.query.advance_search) {
                if (
                  entryList[i].pre_effects[e].effect_id.name ===
                  req.query.advance_search
                ) {
                  proceed = true;
                }
              }
            }
          }
        }
        if (entryList[i].pre_activities.length > 0) {
          for (var f = 0; f < entryList[i].pre_activities.length; f++) {
            if (entryList[i].pre_activities[f].activity_id) {
              activities.push({
                name: entryList[i].pre_activities[f].activity_id.name,
              });
              if (req.query.advance_search) {
                if (
                  entryList[i].pre_activities[f].activity_id.name ===
                  req.query.advance_search
                ) {
                  proceed = true;
                }
              }
            }
          }
        }
        if (req.query.advance_search) {
          if (proceed === false) {
            continue;
          }
        }
        entries.push({
          id: entryList[i]._id,
          user: entryList[i].user.full_name,
          name: entryList[i].product ? entryList[i].product.name : "",
          strain: entryList[i].product
            ? entryList[i].product.strain
              ? entryList[i].product.strain.name
              : ""
            : "",
          description: entryList[i].product
            ? entryList[i].product.description
            : "",
          created_at: CommonHelper.formatedDate(entryList[i].created_at, 7),
          day: entryList[i].day_of_week,
          is_public: entryList[i].is_public,
          comments: entryList[i].comments,
          average_ratings: entryList[i].average_ratings,
          is_favourite: isMyEntryFlag == 1 ? entryList[i].is_favourite : 0,
          enjoy_taste: isMyEntryFlag == 1 ? entryList[i].enjoy_taste : false,
          laboratory_name: entryList[i].coa_id
            ? entryList[i].coa_id.laboratory_name
            : "",
          tested_at: entryList[i].coa_id
            ? CommonHelper.formatedDate(entryList[i].coa_id.tested_at, 7)
            : "",
          weight: entryList[i].product ? entryList[i].product.weight : "",
          is_my_entry: isMyEntryFlag,
          is_complete: entryList[i].is_complete,
        });
      }
      product_names = getUniqueListBy(product_names, "name");
      cannabinoids_profile = getUniqueListBy(cannabinoids_profile, "name");
      terpenes_profile = getUniqueListBy(terpenes_profile, "name");
      consumption_method = getUniqueListBy(consumption_method, "name");
      symptoms = getUniqueListBy(symptoms, "name");
      effects = getUniqueListBy(effects, "name");
      activities = getUniqueListBy(activities, "name");
      conditions = getUniqueListBy(conditions, "name");
      filterEntries.push({
        product_names,
        cannabinoids_profile,
        terpenes_profile,
        consumption_method,
        symptoms,
        effects,
        activities,
        conditions,
      });
    } catch (e) {
      console.log(e);
    }
  }

  let dataResponse = { entries, total, record_per_page: limit, total_pages: totalPages };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/all-diary-entries', request, dataResponse, userId, "Your entry list");
  res.send(resultResponse);

  /*res.send({
    success: true,
    message: "Your entry list",
    data: { entries, total, record_per_page: limit, total_pages: totalPages },
    filterData: filterEntries,
  });*/
});

//@desc get list of favourite entries
//route GET /api/favourite-entries
//@access Private
exports.getFavouriteEntries = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  var limit = 20;
  var skip = 0;
  var total = 0;
  var totalPages = 0;
  let findCond = { user: userId, is_deleted: 0, is_favourite: 1 };
  if (req.query.is_public) {
    findCond.is_public = req.query.is_public;
  }
  if (req.query.ratings) {
    findCond.average_ratings = req.query.ratings;
  }
  if (req.query.search_date_from && req.query.search_date_to) {
    var start = new Date(req.query.search_date_from);
    start.setHours(0, 0, 0, 0);

    var end = new Date(req.query.search_date_to);
    end.setHours(23, 59, 59, 999);

    findCond.created_at = { $gte: start, $lte: end };
  }
  if (req.query.search_text) {
    var searchQuery = req.query.search_text;
    /*var searchText = new RegExp(["^", searchQuery, "$"].join(""), "i");*/
    /*findCond.$or=[
            {keywords:{ '$regex' : searchText, '$options' : 'i' }},
            {name:{ '$regex' : searchText, '$options' : 'i' }}
        ]*/
    var logEntry = {
      search_terms: searchQuery,
      type: "getFavouriteEntries",
      search_by: userId,
    };
    await SearchLogs.create(logEntry);
    getIdsSearch = await Diary.aggregate([
      { $match: { user: userId } },
      // Activities
      {
        $lookup: {
          from: "activities",
          localField: "pre_activities.activity_id",
          foreignField: "_id",
          as: "ActivitiesR",
        },
      },
      { $unwind: "$ActivitiesR" },
      // Symptoms
      {
        $lookup: {
          from: "symptoms",
          localField: "pre_symptoms.symptom_id",
          foreignField: "_id",
          as: "SymptomsR",
        },
      },
      { $unwind: "$SymptomsR" },
      // Effects
      {
        $lookup: {
          from: "effects",
          localField: "desired_effects.effect_id",
          foreignField: "_id",
          as: "EffectsR",
        },
      },
      { $unwind: "$EffectsR" },
      /*// Conditions
                { "$lookup": {
                    "from": "conditions",
                    "localField": "pre_condition.condition_id",
                    "foreignField": "_id",
                    "as": "ConditionsR"
                } },
                { "$unwind": "$ConditionsR" },*/
      {
        $match: {
          $or: [
            { "SymptomsR.name": { $regex: searchQuery, $options: "i" } },
            { "ActivitiesR.name": { $regex: searchQuery, $options: "i" } },
            { "EffectsR.name": { $regex: searchQuery, $options: "i" } } /*,
                                { "ConditionsR.name": searchText }*/,
          ],
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    findCond._id = {
      $in: getIdsSearch.map(function (e) {
        return ObjectId(e._id);
      }),
    };
    //findCond.name =  { '$regex' : searchText, '$options' : 'i' }
  }
  if (req.query.page && req.query.page > 0) {
    var page = req.query.page;
    skip = parseInt(page - 1) * limit;
  }
  total = await Diary.countDocuments(findCond);
  if (total == 0) {
    return res.send({ success: false, message: "No records available" });
  }
  totalPages = Math.ceil(total / limit, 2);
  let entryList = await Diary.find(findCond)
    .populate({
      path: "product",
      select: { name: 1, description: 1, laboratory_name: 1, weight: 1 },
      populate: {
        path: "strain",
        select: { name: 1 },
      },
    })
    .select({
      created_at: 1,
      day_of_week: 1,
      is_favourite: 1,
      enjoy_taste: true,
      is_complete: 1,
      has_incompleteness_notified: 1,
    })
    .limit(limit)
    .skip(skip)
    .sort({ created_at: -1 });
  //console.log(entryList)
  /**
   */
  let entries = [];
  if (entryList.length > 0) {
    for (var i = 0; i < entryList.length; i++) {
      /*let effects = []
            if(entryList[i].entry_id.pre_effects.length > 0){
                for(var e=0;e<entryList[i].entry_id.pre_effects.length;e++){
                    effects.push({
                        effect_id:entryList[i].entry_id.pre_effects[e].effect_id._id,
                        effect_name:entryList[i].entry_id.pre_effects[e].effect_id.name
                    })
                }
            }
            let symptoms = []
            if(entryList[i].pre_symptoms.entry_id.length > 0){
                for(var s=0;s<entryList[i].entry_id.pre_symptoms.length;s++){
                    symptoms.push({
                        symptom_id:entryList[i].entry_id.pre_symptoms[s].symptom_id._id,
                        symptom_name:entryList[i].entry_id.pre_symptoms[s].symptom_id.name
                    })
                }
            }
            let activities = []
            if(entryList[i].pre_activities.entry_id.length > 0){
                for(var a=0;a<entryList[i].entry_id.pre_activities.length;a++){
                    activities.push({
                        activity_id:entryList[i].entry_id.pre_activities[a].activity_id._id,
                        activity_name:entryList[i].entry_id.pre_activities[a].activity_id.name
                    })
                }
            }*/
      entries.push({
        id: entryList[i]._id,
        name: entryList[i].product ? entryList[i].product.name : "",
        strain: entryList[i].product
          ? entryList[i].product.strain
            ? entryList[i].product.strain.name
            : ""
          : "",
        //created_at:CommonHelper.formatedDate(entryList[i].created_at,7) ,
        created_at: entryList[i].created_at,
        day: entryList[i].day_of_week,
        is_favourite: entryList[i].is_favourite,
        enjoy_taste: entryList[i].enjoy_taste,
        is_complete: entryList[i].is_complete,
        has_incompleteness_notified: entryList[i].has_incompleteness_notified,
      });
    }
  }

  let dataResponse = { entries, total, record_per_page: limit, total_pages: totalPages };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/favourite-entries', request, dataResponse, userId, "Your entry list");
  res.send(resultResponse);

  res.send({
    success: true,
    message: "Your entry list",
    data: { entries, total, record_per_page: limit, total_pages: totalPages },
  });
});

//@desc update an entry as public entry
//route POST /api/mark-public-entry
//@access Private
exports.markPublicEntry = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  var message = "";
  if (!req.body.entry_id) {
    return res.send({ success: false, message: "Please provide entry id" });
  }
  if (!req.body.is_public) {
    return res.send({ success: false, message: "Please provide public flag" });
  }
  let entryInfo = await Diary.findOne({ _id: req.body.entry_id, user: userId });
  if (!entryInfo) {
    return res.send({ success: false, message: "Entry does not exist" });
  }
  if (entryInfo.is_public == req.body.is_public) {
    if (req.body.is_public == 1) {
      return res.send({
        success: false,
        message: "Entry has already marked as public",
      });
    }
    if (req.body.is_public == 2) {
      return res.send({
        success: false,
        message: "Entry is already not a public entry",
      });
    }
  }
  entryInfo.is_public = req.body.is_public;
  await entryInfo.save();
  if (req.body.is_public == 1) {
    message = "This entry marked as public";
  }
  if (req.body.is_public == 2) {
    message = "This entry marked as private";
  }
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/mark-public-entry', request, dataResponse, userId, message);
  res.send(resultResponse);
  //res.send({ success: true, message });
});

//@desc add ratings to an entry
//route POST /api/review-entry
//@access Private
exports.reviewEntry = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  if (!req.body.entry_id) {
    return res.send({ success: false, message: "Please provide entry id" });
  }
  if (!req.body.ratings) {
    return res.send({ success: false, message: "Please provide ratings" });
  }
  if (req.body.ratings == null) {
    return res.send({ success: false, message: "Ratings can not be null" });
  }
  let entryInfo = await Diary.findOne({
    _id: req.body.entry_id,
    is_deleted: 0,
  });
  if (!entryInfo) {
    return res.send({ success: false, message: "Entry does not exist" });
  }
  if (userId.toString() != entryInfo.user) {
    return res.send({
      success: false,
      message: "This entry does not belongs to you",
    });
  }
  entryInfo.average_ratings = req.body.ratings;
  await entryInfo.save();
  /*let ratings = await Ratings.findOne({entry_id:req.body.entry_id,user:userId})
    if(ratings){
        return res.send({success:false,message:"You already have rate this entry"})
    }
    let newRatings = new Ratings({
        entry_id:req.body.entry_id,
        user:userId,
        ratings:req.body.ratings,
    })
    await newRatings.save()
    let averageRating = await Ratings.aggregate([
        {$match: {entry_id:req.body.entry_id}},
        {
            $group: {
                _id: null, 
                average: {$avg: '$ratings'},
                count: { $sum: 1 }
            }
        }
    ]).exec()
    //console.log(averageRating)
    if(averageRating.length > 0){
        entryInfo.average_ratings = averageRating[0].average
        await entryInfo.save()
    }*/
    let dataResponse = {};
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    //let userId = (req.user) ? req.user._id: null;
    let resultResponse = await ResponseHandler.responseHandler('/api/review-entry', request, dataResponse, userId, "You have rate this entry successfully");
    res.send(resultResponse);
  res.send({ success: true, message: "You have rate this entry successfully" });
});

//@desc mark en entry as favourite entry
//route POST /api/mark-favourite-entry
//@access Private
exports.markFavouriteEntry = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  if (!req.body.entry_id) {
    return res.send({ success: false, message: "Please provide entry id" });
  }
  if (!req.body.is_favourite) {
    return res.send({
      success: false,
      message: "Please provide favourite falg",
    });
  }
  var success = false;
  var message = "";
  let entryInfo = await Diary.findOne({ _id: req.body.entry_id, user: userId });
  if (!entryInfo) {
    return res.send({ success: false, message: "Entry does not exist" });
  }
  if (entryInfo) {
    if (entryInfo.is_favourite == req.body.is_favourite) {
      if (req.body.is_favourite == 1) {
        message = "You already have like this entry";
      } else {
        message = "You already have disliked this entry";
      }
    } else {
      entryInfo.is_favourite = req.body.is_favourite;
      await entryInfo.save();
      success = true;
      if (req.body.is_favourite == 1) {
        message = "You like this entry";
      } else {
        message = "You dislike this entry";
      }
    }
  }
  //else{
  //     let favEntry = new FavouriteEntry({
  //         entry_id:req.body.entry_id,
  //         user:userId,
  //         is_favourite:req.body.is_favourite
  //     })
  //     await favEntry.save()
  //     success = true
  //     if(req.body.is_favourite == 1){
  //         message = "You like this entry"
  //     }else{
  //         message = "You dislike this entry"
  //     }
  // }
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/mark-favourite-entry', request, dataResponse, userId, message);
  res.send(resultResponse);
  //res.send({ success, message });
});

//@desc add comment to an entry
//route POST /api/add-entry-comment
//@access Private
exports.addEntryComment = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  if (!req.body.entry_id) {
    return res.send({ success: false, message: "Please provide entry id" });
  }
  if (!req.body.comment) {
    return res.send({ success: false, message: "Please provide comment" });
  }
  var entryId = req.body.entry_id;
  let entryInfo = await Diary.findById(entryId);
  if (!entryInfo) {
    return res.send({ success: false, message: "Entry does not exist" });
  }
  entryInfo.user_comments.push({
    commented_by: userId,
    comment: req.body.comment,
  });
  await entryInfo.save();
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/add-entry-comment', request, dataResponse, userId, "Comment added successfully");
  res.send(resultResponse);
  //res.send({ success: true, message: "Comment added successfully" });
});

//@desc list of articles added by super admin
//route GET /api/articles
//@access Private
exports.getArticles = asyncHandler(async (req, res, next) => {
  var limit = 10;
  var total = 0;
  var skip = 0;
  var totalPages = 0;
  if (req.query.page && req.query.page > 0) {
    var page = req.query.page;
    skip = parseInt(page - 1) * limit;
  }
  let findCond = { is_active: 1, is_deleted: 0 };
  total = await Article.countDocuments(findCond).populate({
    path: "author",
    select: { full_name: 1, profile_image: 1 },
  });
  if (total == 0) {
    return res.send({ success: false, message: "No records available" });
  }
  totalPages = Math.ceil(total / limit, 2);
  let articlesList = await Article.find(findCond)
    .populate({
      path: "category",
      select: { name: 1 },
    })
    .populate({ path: "author", select: { full_name: 1, profile_image: 1 } })
    .limit(limit)
    .skip(skip)
    .sort({ created_at: -1 });
  let articles = [];
  var deFaultimagePath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png";
  if (articlesList.length > 0) {
    var imagePath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/article/";
    for (var a = 0; a < articlesList.length; a++) {
      articles.push({
        article_id: articlesList[a]._id,
        title: articlesList[a].title,
        author_name: articlesList[a].author.full_name
          ? articlesList[a].author.full_name
          : "TCD",
        author_profile_image: articlesList[a].author.profile_image
          ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
            articlesList[a].author.profile_image
          : deFaultimagePath,
        excerpt: CommonHelper.getExcerpt(articlesList[a].content, 150),
        content: articlesList[a].content,
        image: articlesList[a].image ? imagePath + articlesList[a].image : "",
        created_at: CommonHelper.formatedDate(articlesList[a].created_at, 7),
      });
    }
  }
  let dataResponse = {
    articles,
    total,
    record_per_page: limit,
    total_pages: totalPages,
  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/articles', request, dataResponse, userId, "");

  res.send({
    success: true,
    articles,
    total,
    record_per_page: limit,
    total_pages: totalPages,
  });
});

//@desc list of all types of videos
//route GET /api/videos
//@access Private
exports.getVideos = asyncHandler(async (req, res, next) => {
  var uploadDirPath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/";
  //get favourite videos
  let favVideos = await FavouriteVideo.find({
    user: req.user._id,
    is_favourite: 1,
  });
  //console.log(favVideos)
  favVideoIds = [];
  if (favVideos.length > 0) {
    for (var v = 0; v < favVideos.length; v++) {
      var favVideoId = favVideos[v].video_id;
      favVideoIds.push(favVideoId);
    }
  }
  var deFaultimagePath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png";
  //console.log(favVideoIds)
  //get disliked videos
  let dislikedVideos = await FavouriteVideo.find({
    user: req.user._id,
    is_favourite: 2,
  });
  //console.log(favVideos)
  dislikedVideoIds = [];
  if (dislikedVideos.length > 0) {
    for (var v = 0; v < dislikedVideos.length; v++) {
      var dislikedVideoId = dislikedVideos[v].video_id;
      dislikedVideoIds.push(dislikedVideoId);
    }
  }
  try {
    let introFindCond = { is_deleted: 0, is_active: 1, type: 1 };
    let introVideoList = await Video.find(introFindCond)
      .populate({ path: "author", select: { full_name: 1, profile_image: 1 } })
      .sort({ created_at: -1 });
    let introvideos = [];
    if (introVideoList.length > 0) {
      for (var i = 0; i < introVideoList.length; i++) {
        var isFavouriteFlag = 0;
        if (favVideoIds.length > 0) {
          var isFavourite = favVideoIds.some(function (favVideo) {
            return favVideo.equals(introVideoList[i]._id);
          });
          if (isFavourite === true) {
            isFavouriteFlag = 1;
          }
        }
        if (dislikedVideoIds.length > 0) {
          var isFavourite = dislikedVideoIds.some(function (dislikedVideoId) {
            return dislikedVideoId.equals(introVideoList[i]._id);
          });
          if (isFavourite === true) {
            isFavouriteFlag = 2;
          }
        }
        introvideos.push({
          id: introVideoList[i]._id,
          video_title: introVideoList[i].title,
          video_description: introVideoList[i].description,
          video_author_name:
            typeof introVideoList[i].author !== "undefined" &&
            introVideoList[i].author
              ? introVideoList[i].author.full_name
              : "TCD",
          video_author_image:
            typeof introVideoList[i].author !== "undefined" &&
            introVideoList[i].author.profile_image
              ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
                introVideoList[i].author.profile_image
              : deFaultimagePath,
          video_url:
            uploadDirPath + "video/introductory/" + introVideoList[i].video_url,
          video_thumb_image:
            uploadDirPath +
            "video_thumb_image/introductory/" +
            introVideoList[i].video_thumb_image,
          video_duration: introVideoList[i].duration,
          video_created: introVideoList[i].created_at,
          is_favourite: isFavouriteFlag,
        });
      }
    }
    let eduFindCond = { is_deleted: 0, is_active: 1, type: 2 };
    let eduVideoList = await Video.find(eduFindCond)
      .populate({ path: "author", select: { full_name: 1, profile_image: 1 } })
      .sort({ created_at: -1 });
    let educationvideos = [];
    if (eduVideoList.length > 0) {
      for (var i = 0; i < eduVideoList.length; i++) {
        var isFavouriteFlag = 0;
        if (favVideoIds.length > 0) {
          var isFavourite = favVideoIds.some(function (favVideo) {
            return favVideo.equals(eduVideoList[i]._id);
          });
          if (isFavourite === true) {
            isFavouriteFlag = 1;
          }
        }
        if (dislikedVideoIds.length > 0) {
          var isFavourite = dislikedVideoIds.some(function (dislikedVideoId) {
            return dislikedVideoId.equals(eduVideoList[i]._id);
          });
          if (isFavourite === true) {
            isFavouriteFlag = 2;
          }
        }
        educationvideos.push({
          id: eduVideoList[i]._id,
          video_title: eduVideoList[i].title,
          video_description: eduVideoList[i].description,
          video_author_name:
            typeof eduVideoList[i].author !== "undefined" &&
            eduVideoList[i].author
              ? eduVideoList[i].author.full_name
              : "TCD",
          video_author_image:
            typeof eduVideoList[i].author !== "undefined" &&
            eduVideoList[i].author
              ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
                eduVideoList[i].author.profile_image
              : deFaultimagePath,
          video_url:
            uploadDirPath + "video/educational/" + eduVideoList[i].video_url,
          video_thumb_image:
            uploadDirPath +
            "video_thumb_image/educational/" +
            eduVideoList[i].video_thumb_image,
          video_duration: eduVideoList[i].duration,
          video_created: eduVideoList[i].created_at,
          is_favourite: isFavouriteFlag,
        });
      }
    }
    let newsFindCond = { is_deleted: 0, is_active: 1, type: 3 };
    let newsVideoList = await Video.find(newsFindCond)
      .populate({ path: "author", select: { full_name: 1, profile_image: 1 } })
      .sort({ created_at: -1 });
    let newsvideos = [];
    if (newsVideoList.length > 0) {
      for (var i = 0; i < newsVideoList.length; i++) {
        var isFavouriteFlag = 0;
        if (favVideoIds.length > 0) {
          var isFavourite = favVideoIds.some(function (favVideo) {
            return favVideo.equals(newsVideoList[i]._id);
          });
          if (isFavourite === true) {
            isFavouriteFlag = 1;
          }
        }
        if (dislikedVideoIds.length > 0) {
          var isFavourite = dislikedVideoIds.some(function (dislikedVideoId) {
            return dislikedVideoId.equals(newsVideoList[i]._id);
          });
          if (isFavourite === true) {
            isFavouriteFlag = 2;
          }
        }
        newsvideos.push({
          id: newsVideoList[i]._id,
          video_title: newsVideoList[i].title,
          video_description: newsVideoList[i].description,
          video_author_name:
            typeof newsVideoList[i].author !== "undefined" &&
            newsVideoList[i].author
              ? newsVideoList[i].author.full_name
              : "TCD",
          video_author_image:
            typeof newsVideoList[i].author !== "undefined" &&
            newsVideoList[i].author.profile_image
              ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
                newsVideoList[i].author.profile_image
              : deFaultimagePath,
          video_url: uploadDirPath + "video/news/" + newsVideoList[i].video_url,
          video_thumb_image:
            uploadDirPath +
            "video_thumb_image/news/" +
            newsVideoList[i].video_thumb_image,
          video_duration: newsVideoList[i].duration,
          video_created: introVideoList[i].newsVideoList,
          is_favourite: isFavouriteFlag,
        });
      }
    }
  let dataResponse = {
    Introduction: introvideos,
    Educational: educationvideos,
    News: newsvideos,
  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/videos', request, dataResponse, userId, "Comment added successfully");
  res.send(resultResponse);
  /*  res.send({
      success: true,
      data: {
        Introduction: introvideos,
        Educational: educationvideos,
        News: newsvideos,
      },
    });*/
  } catch (e) {
    console.log(e);
    res.send({ success: false, error_msg: "Please contact admin support." });
  }
});

//@desc get video details
//route GET /api/video-details
//@access Private
exports.getVideoDetails = asyncHandler(async (req, res, next) => {
  if (!req.query.video_id) {
    return res.send({ success: false, message: "Please provide video id" });
  }
  const userId = req.user._id;
  const videoId = req.query.video_id;
  var uploadDirPath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/";

  let videoInfo = await Video.findOne({
    _id: videoId,
    is_active: 1,
    is_deleted: 0,
  })
    .populate({
      path: "comments.commented_by",
      select: { full_name: 1, profile_image: 1 },
    })
    .select({
      title: 1,
      type: 1,
      author: 1,
      video_url: 1,
      video_thumb_image: 1,
      duration: 1,
      comments: 1,
      created_at: 1,
    });
  if (!videoInfo) {
    return res.send({ success: false, message: "Video does not exist" });
  }
  //console.log(videoInfo)

  //get favourite videos
  let favVideos = await FavouriteVideo.find({
    user: req.user._id,
    is_favourite: 1,
  });
  //console.log(favVideos)
  favVideoIds = [];
  if (favVideos.length > 0) {
    for (var v = 0; v < favVideos.length; v++) {
      var favVideoId = favVideos[v].video_id;
      favVideoIds.push(favVideoId);
    }
  }
  //get disliked videos
  let dislikedVideos = await FavouriteVideo.find({
    user: req.user._id,
    is_favourite: 2,
  });
  //console.log(favVideos)
  dislikedVideoIds = [];
  if (dislikedVideos.length > 0) {
    for (var v = 0; v < dislikedVideos.length; v++) {
      var dislikedVideoId = dislikedVideos[v].video_id;
      dislikedVideoIds.push(dislikedVideoId);
    }
  }

  var isFavouriteFlag = 0;
  if (favVideoIds.length > 0) {
    var isFavourite = favVideoIds.some(function (favVideo) {
      return favVideo.equals(videoInfo._id);
    });
    if (isFavourite === true) {
      isFavouriteFlag = 1;
    }
  }
  if (dislikedVideoIds.length > 0) {
    var isFavourite = dislikedVideoIds.some(function (dislikedVideoId) {
      return dislikedVideoId.equals(videoInfo._id);
    });
    if (isFavourite === true) {
      isFavouriteFlag = 2;
    }
  }
  let videoComments = [];
  let findBlockedCond = { is_active: 1, is_deleted: 0, blocked_by: userId };
  const userFind = await UserBlocked.find(findBlockedCond).select({
    blocked_userid: 1,
  });
  if (videoInfo.comments.length > 0) {
    var profileImgPath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/";
    for (var c = 0; c < videoInfo.comments.length; c++) {
      let continuenext = false;
      for (var x = 0; x < userFind.length; x++) {
        let blockedUserId = JSON.stringify(userFind[x].blocked_userid);
        let useridCheck = JSON.stringify(
          videoInfo.comments[c].commented_by._id
        );
        if (blockedUserId === useridCheck) {
          continuenext = true;
        }
      }
      if (continuenext === true) continue;
      videoComments.push({
        comment_id: videoInfo.comments[c]._id,
        commented_by: videoInfo.comments[c].commented_by.full_name,
        commented_by_user_id: videoInfo.comments[c].commented_by._id,
        commented_by_image: videoInfo.comments[c].commented_by.profile_image
          ? profileImgPath + videoInfo.comments[c].commented_by.profile_image
          : "",
        comment: videoInfo.comments[c].comment,
        created_at: CommonHelper.formatedDate(
          videoInfo.comments[c].created_at,
          7
        ),
      });
    }
    videoComments = videoComments.sort(CommonHelper.dynamicSort("created_at"));
  }
  let video = videoInfo.toObject();
  video.id = videoInfo._id;
  video.video_title = videoInfo.title;
  video.author = videoInfo.author;
  video.video_url = videoInfo.video_url
    ? uploadDirPath + "video/community/" + videoInfo.video_url
    : "";
  video.video_thumb_image = videoInfo.video_thumb_image
    ? uploadDirPath +
      "video_thumb_image/community/" +
      videoInfo.video_thumb_image
    : "";
  video.video_duration = videoInfo.duration;
  video.comments = videoComments;
  video.is_favourite = isFavouriteFlag;
  let dataResponse = { video };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/video-details', request, dataResponse, userId, "Video information");
  res.send(resultResponse);
  //res.send({ success: true, message: "Video information", data: { video } });
});

//@desc get content of cms pages
//route GET /api/page/:slug
//@access Private
exports.getCMPageSDetails = asyncHandler(async (req, res, next) => {
  let slug = req.params.slug;
  if (!slug) {
    return res.send({ success: false, message: "Please provide slug" });
  }
  let cmsCond = { slug: slug, is_deleted: 0, is_active: 1 };
  let cmsObj = await CMS.findOne(cmsCond);
  if (!cmsObj) {
    return res.send({ success: false, message: "Page does not exist" });
  }
  let page = {
    page_title: cmsObj.page_title,
    page_content: cmsObj.page_content,
  };
  let dataResponse = { page };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/page/'+slug, request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: { page }, message: "" });
});

//@desc get content of cms pages
//route GET /api/page/about-us
exports.getAboutUsPage = asyncHandler(async (req, res, next) => {
  let slug = "about-us";
  let cmsCond = { slug: slug, is_deleted: 0, is_active: 1 };
  let cmsObj = await CMS.findOne(cmsCond);
  if (!cmsObj) {
    return res.send({ success: false, message: "Page does not exist" });
  }
  let page = {
    page_title: cmsObj.page_title,
    page_content: cmsObj.page_content,
  };
  let dataResponse = { page };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/page/about-us', request, dataResponse, userId, "");
  res.send(resultResponse);

  //res.send({ success: true, data: { page }, message: "" });
});

//@desc get content of cms pages
//route GET /api/page/welcome
exports.getWelcomePage = asyncHandler(async (req, res, next) => {
  let slug = "welcome";
  let cmsCond = { slug: slug, is_deleted: 0, is_active: 1 };
  let cmsObj = await CMS.findOne(cmsCond);
  if (!cmsObj) {
    return res.send({ success: false, message: "Page does not exist" });
  }
  let page = {
    page_title: cmsObj.page_title,
    page_content: cmsObj.page_content,
  };
  let dataResponse = { page };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/page/welcome', request, dataResponse, userId, "");
  res.send(resultResponse);
  res.send({ success: true, data: { page }, message: "" });
});

//@desc get content of cms pages
//route GET /api/page/privacy-policy
exports.getPrivacyPolicyPage = asyncHandler(async (req, res, next) => {
  let slug = "privacy-policy";
  let cmsCond = { slug: slug, is_deleted: 0, is_active: 1 };
  let cmsObj = await CMS.findOne(cmsCond);
  if (!cmsObj) {
    return res.send({ success: false, message: "Page does not exist" });
  }
  let page = {
    page_title: cmsObj.page_title,
    page_content: cmsObj.page_content,
  };
  let dataResponse = { page };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/page/privacy-policy', request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: { page }, message: "" });
});

//@desc get content of cms pages
//route GET /api/page/terms
exports.getTerms = asyncHandler(async (req, res, next) => {
  let slug = "terms";
  let cmsCond = { slug: slug, is_deleted: 0, is_active: 1 };
  let cmsObj = await CMS.findOne(cmsCond);
  if (!cmsObj) {
    return res.send({ success: false, message: "Page does not exist" });
  }
  let page = {
    page_title: cmsObj.page_title,
    page_content: cmsObj.page_content,
  };
  let dataResponse = { page };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/page/terms', request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: { page }, message: "" });
});

//@desc contact with tcd support team
//route POST /api/contact
//@access Private
exports.contactSupport = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  if (!req.body.topic) {
    return res.send({ success: false, message: "Please provide topic" });
  }
  if (!req.body.email) {
    return res.send({ success: false, message: "Please provide email" });
  }
  if (!req.body.issue) {
    return res.send({ success: false, message: "Please provide issue" });
  }
  let contact = new Contact({
    user: userId,
    topic: req.body.topic,
    issue: req.body.issue,
    //email:req.user.email
  });
  await contact.save();
  /**CONTACT EMAIL */
  let emailData = {
    name: req.user.full_name,
    email: req.body.email,
    topic: req.body.topic,
    issue: req.body.issue,
  };
  sendContactEmail(emailData);
  contactSupportEmail(emailData);
  let dataResponse = { emailData };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/contact', request, dataResponse, userId, "Contacted successfully");
  //res.send(resultResponse);
  /**CONTACT EMAIL */
  res.send({ success: true, message: "Contacted successfully" });
});

//@desc send feedback to administrator
//route POST /api/send-feedback
//@access Private
exports.sendFeedback = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  if (!req.body.area_of_improvement) {
    return res.send({
      success: false,
      message: "Page provide area of improvement",
    });
  }
  if (!req.body.feedback) {
    return res.send({ success: false, message: "Page provide feedback" });
  }
  let feedback = new Feedback({
    user: userId,
    area_of_improvement: req.body.area_of_improvement,
    feedback: req.body.feedback,
  });
  await feedback.save();
  /**FEEDBACK EMAIL */
  let emailData = {
    email: req.user.email,
  };
  sendFeedbackEmail(emailData);
  /**FEEDBACK EMAIL */
  let dataResponse = { emailData };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/send-feedback', request, dataResponse, userId, "Feedback sent successfully");
  //res.send(resultResponse);
  res.send({ success: true, message: "Feedback sent successfully" });
});

//@desc send feedback to administrator
//route GET /api/faqs
//@access Private
exports.getFAQ = asyncHandler(async (req, res, next) => {
  let faqCond = { is_deleted: 0, is_active: 1, parent_id: null };
  let faqCategoryData = await FaqCategory.find(faqCond);
  let tempArray1 = [];
  for (fCat of faqCategoryData) {
    let faqCatData = await Faq.find({
      is_deleted: 0,
      is_active: 1,
      category_id: fCat._id,
    }).select({ question: 1, answer: 1 });
    let subCategories = await FaqCategory.find({
      is_deleted: 0,
      is_active: 1,
      parent_id: fCat._id,
    });
    let tempArray2 = [];
    for (fSub of subCategories) {
      let faqData = await Faq.find({
        is_deleted: 0,
        is_active: 1,
        category_id: fSub._id,
      }).select({ question: 1, answer: 1 });
      tempArray2.push({
        sub_category_name: fSub.name,
        question_answer: faqData,
      });
    }
    let fCatObj = {
      category_name: fCat.name,
      subcategories: tempArray2,
      question_answer: faqCatData,
    };
    tempArray1.push(fCatObj);
  }
  let dataResponse = { faqs: tempArray1 };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/faqs', request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: { faqs: tempArray1 } });
});

//@desc mark a video as favourite
//route POST /api/mark-favourite-video
//@access Private
exports.markFavouriteVideo = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  if (!req.body.video_id) {
    return res.send({ success: false, message: "Please provide video id" });
  }
  if (!req.body.is_favourite) {
    return res.send({
      success: false,
      message: "Please provide favourite falg",
    });
  }
  var success = false;
  var message = "";
  let favVideoInfo = await FavouriteVideo.findOne({
    video_id: req.body.video_id,
    user: userId,
  });
  if (favVideoInfo) {
    if (favVideoInfo.is_favourite == req.body.is_favourite) {
      if (req.body.is_favourite == 1) {
        message = "You already have liked this video";
      } else {
        message = "You already have disliked this video";
      }
    } else {
      favVideoInfo.is_favourite = req.body.is_favourite;
      await favVideoInfo.save();
      success = true;
      if (req.body.is_favourite == 1) {
        message = "You liked this video";
      }
      if (req.body.is_favourite == 2) {
        message = "You disliked this video";
      }
    }
  } else {
    let favVideo = new FavouriteVideo({
      user: userId,
      video_id: req.body.video_id,
      is_favourite: req.body.is_favourite,
    });
    await favVideo.save();
    success = true;
    if (req.body.is_favourite == 1) {
      message = "You liked this video";
    }
    if (req.body.is_favourite == 2) {
      message = "You disliked this video";
    }
  }
  let dataResponse = {  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/mark-favourite-video', request, dataResponse, userId, message);
  //res.send(resultResponse);
  res.send({ success, message });
});

//@desc add comment to a video
//route POST /api/add-video-comment
//@access Private
exports.addVideoComment = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  if (!req.body.video_id) {
    return res.send({ success: false, message: "Please provide video id" });
  }
  if (!req.body.comment) {
    return res.send({ success: false, message: "Please provide comment" });
  }
  var videoId = req.body.video_id;
  let videoInfo = await Video.findById(videoId);
  if (!videoInfo) {
    return res.send({ success: false, message: "Video does not exist" });
  }
  videoInfo.comments.push({
    commented_by: userId,
    comment: req.body.comment,
  });
  await videoInfo.save();
  let dataResponse = {  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/add-video-comment', request, dataResponse, userId, "Comment added successfully");
  //res.send(resultResponse);
  res.send({ success: true, message: "Comment added successfully" });
});

//@desc get all brands
//route GET /api/get-all-brands
//@access Private
exports.getBrands = asyncHandler(async (req, res, next) => { 
  let findCond = { is_deleted: 0, is_active: 1};
  if (req.query.search) {
    findCond.name = { $regex: req.query.search, $options: "i" };
  }

  if (req.query.product) {
    let findProd = { is_deleted: 0, is_active: 1};

    findProd.name = { $regex: req.query.product, $options: "i" };
    let productFind = await Product.find(findProd);
    let brandIds = [];
    productFind.forEach((u) => {
      var o_id = new ObjectId(u.strain);
      brandIds.push(new ObjectId(o_id));
    });
    findCond._id = { $in: brandIds };
  }

  if (req.query.type) {
    let findType = { is_deleted: 0, is_active: 1};
    findType.name = { $regex: req.query.type, $options: "i" };
    let productTypeFind = await ProductType.find(findType);
    let productTypeIds = [];
    productTypeFind.forEach((u) => {
      var o_id = new ObjectId(u._id);
      productTypeIds.push(new ObjectId(o_id));
    });
    let findProdIds = {}
    findProdIds.product_type = { $in: productTypeIds };

    let productFind = await Product.find(findProdIds);
    let brandIds = [];
    productFind.forEach((u) => {
      var o_id = new ObjectId(u.strain);
      brandIds.push(new ObjectId(o_id));
    });

    findCond._id = { $in: brandIds };
  }
  let brands = await Strain.find(findCond).populate({ path: "state", select: { namefull_name: 1, _id: 1 } });

  brandResult = [];
  let defaultLogo = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png';
  let findCondProd = { is_deleted: 0, is_active: 1 };
  let brandReviews = [{
    _id : '616273656e6365576f728b71',
    comment : 'This is a great brand',
    user: 'Fammmy Lyn',
    user_rating: 4,
    user_profile: defaultLogo,
    create_at: '2022-09-14'
  },{
    _id : '616273656e6365576f728b71',
    comment : 'This is a great brand',
    user: 'Rodeo Sin',
    user_rating: 5,
    user_profile: defaultLogo,
    create_at: '2022-09-14'
  }]
  let productData = []
  let productDataType = []
  let productStates = []
  if (brands.length > 0) {
    for (var v = 0; v < brands.length; v++) {
      findCondProd.strain = brands[v]._id;
      let productResult = await Product.find(findCondProd).populate({path: "product_type", select: { name: 1, _id: 1 }}).populate({path: "strain", select: { name: 1, _id: 1 }}).populate({path: "updated_by", select: { fullname: 1, _id: 1 }});
      for (var i = 0; i < productResult.length; i++) { 
        productData.push({name: productResult[i].name, id: productResult[i]._id, image: defaultLogo})
        if (productResult[i].product_type) { 
          productDataType.push({name: productResult[i].product_type.name , id: productResult[i].product_type._id, image: defaultLogo})
        }
        productStates.push({name: 'Delaware', id: '616273656e6365576f728b71' , image: defaultLogo})
      }
      let brandIconsArray = [{
        "imageID" : "616273656e6365576f728b71",
        "imageURL" : defaultLogo
      }]
      let brandBackgroundImage = [{
        "imageID" : "616273656e6365576f728b71",
        "imageURL" : defaultLogo
      }]
      brandResult.push({
        brandId : brands[v]._id,
        brandName : brands[v].name,
        brandDescription : brands[v].description,
        brandLogo : (brands[v].brand_logo) ? brands[v].brand_logo : defaultLogo,
        brandState : (brands[v].state) ? brands[v].state.name : 'Delaware',
        brandBackgroundImage : brandBackgroundImage,
        brandIcons : brandIconsArray,
        brandProductCount : productResult.length,
        brandCreated : brands[v].created_at,
        brandReviews: brandReviews,
      }
      );
    }
  }
  var productDataUnique = productData.reduce((uniqueProd, o) => {
      if(!uniqueProd.some(obj => obj.name === o.name && obj.id === o.id && obj.image === o.image)) {
        uniqueProd.push(o);
      }
      return uniqueProd;
  },[]);
  var productDataTypeUnique = productDataType.reduce((uniqueProdType, o) => {
    if(!uniqueProdType.some(obj => obj.name === o.name && obj.id === o.id && obj.image === o.image)) {
      uniqueProdType.push(o);
    }
    return uniqueProdType;
  },[]);
  var productStatesUnique = productStates.reduce((uniqueStates, o) => {
    if(!uniqueStates.some(obj => obj.name === o.name && obj.id === o.id && obj.image === o.image)) {
      uniqueStates.push(o);
    }
    return uniqueStates;
  },[]);
  let brandFilter = [{
    product: productDataUnique,
    type: productDataTypeUnique,
    state: productStatesUnique,
  }]
  let dataResponse = { brandResult, brandFilter };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/community-info', request, dataResponse, userId, "");
  res.send(resultResponse);
});

//@desc get community entries
//route GET /api/community-entries
//@access Private
exports.getCommunityEntries = asyncHandler(async (req, res, next) => {
  let data = {
		"entries": [
			{
				"entryID" : "616273656e6365576f726b73",
				"entryText" : "FreeStone",
				"entryType" : "Flower",
				"entryIsFav" : "1",
				"entryLikes" : "3",
				"entryDate" : "2022-12-09",
				"entryUserID" : "616273656e6365576f726b72",
				"entryFullName" : "Test Name",
				"entryUserImage" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png",
				"imagesArray" : [{
					"imageID" : "616273656e6365576f728b71",
					"imageURL" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png"
				}],
				"videoArray" : [{ 
					"videoID" : "616273656e6365571f726b29",
					"videoURL" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/video/introductory/video_url-1661333610736.mp4",
					"videoThumb" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png"
				}],
				"commentsArray" : [{
					"commentID" : "716273656e6365571f726b17",
					"commentUser" : "616273656e6365576f726b72",
					"commentDate" :  "2022-03-08",
					"commentLikes" : "3",
					"commentText" : "Great Help",
					"commentUserID" : "616273656e6365576f726b72",
					"commentUserName" : "Test Name",
					"commentUserImage" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png"
				}]
			},
			{
			"entryID" : "616273656e6365578f726b73",
			"entryText" : "FreeStone",
			"entryType" : "Vape",
			"entryIsFav" : "1",
			"entryLikes" : "3",
			"entryDate" : "2022-12-09",
			"entryUserID" : "616273656e6365576f726b72",
			"entryFullName" : "Test Name",
			"entryUserImage" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png",
			"imagesArray" : [{
				"imageID" : "616273656e6365576f728b71",
				"imageURL" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png"
			}],
			"videoArray" : [{ 
				"videoID" : "616273656e6365571f726b29",
				"videoURL" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/video/introductory/video_url-1661333610736.mp4",
				"videoThumb" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png"
			}],
			"commentsArray" : [{
				"commentID" : "716273656e6365571f726b17",
				"commentUser" : "616273656e6365576f726b72",
				"commentDate" :  "2022-12-09",
				"commentLikes" : "3",
				"commentText" : "Great Help",
				"commentUserID" : "616273656e6365576f726b72",
				"commentUserName" : "Test Name",
				"commentUserImage" : "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png"
			}]
		}
		]
	}
  res.send({ success: true, data: data });
});

//@desc get community page information
//route GET /api/community-info
//@access Private
exports.communityInfo = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  var uploadDirPath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/";
  let videos = [];
  let videoList = await Video.find({
    type: 4,
    is_active: 1,
    is_deleted: 0,
  }).populate({ path: "author", select: { full_name: 1, profile_image: 1 } });
  /*.populate({
        path:"comments.commented_by",
        select:{"full_name":1,"profile_image":1}
    })*/
  //console.log(videoList)
  if (videoList.length > 0) {
    //get favourite videos
    let favVideos = await FavouriteVideo.find({
      user: req.user._id,
      is_favourite: 1,
    });
    //console.log(favVideos)
    favVideoIds = [];
    if (favVideos.length > 0) {
      for (var v = 0; v < favVideos.length; v++) {
        var favVideoId = favVideos[v].video_id;
        favVideoIds.push(favVideoId);
      }
    }
    //get disliked videos
    let dislikedVideos = await FavouriteVideo.find({
      user: req.user._id,
      is_favourite: 2,
    });
    //console.log(favVideos)
    dislikedVideoIds = [];
    if (dislikedVideos.length > 0) {
      for (var v = 0; v < dislikedVideos.length; v++) {
        var dislikedVideoId = dislikedVideos[v].video_id;
        dislikedVideoIds.push(dislikedVideoId);
      }
    }
    for (var i = 0; i < videoList.length; i++) {
      var isFavouriteFlag = 0;
      if (favVideoIds.length > 0) {
        var isFavourite = favVideoIds.some(function (favVideo) {
          return favVideo.equals(videoList[i]._id);
        });
        if (isFavourite === true) {
          isFavouriteFlag = 1;
        }
      }
      if (dislikedVideoIds.length > 0) {
        var isFavourite = dislikedVideoIds.some(function (dislikedVideoId) {
          return dislikedVideoId.equals(videoList[i]._id);
        });
        if (isFavourite === true) {
          isFavouriteFlag = 2;
        }
      }
      let videoComments = [];
      /*if(videoList[i].comments.length > 0){
                var profileImgPath = req.protocol+'://'+req.get('host')+'/uploads/profile_image/'
                for(var c = 0; c<videoList[i].comments.length; c++){
                    videoComments.push({
                        comment_id:videoList[i].comments[c]._id,
                        commented_by:videoList[i].comments[c].commented_by.full_name,
                        commented_by_image:(videoList[i].comments[c].commented_by) ? profileImgPath+videoList[i].comments[c].commented_by.profile_image : '',
                        comment:videoList[i].comments[c].comment,
                        created_at:CommonHelper.formatedDate(videoList[i].comments[c].created_at,7)
                    })
                }
            }*/
      videos.push({
        id: videoList[i]._id,
        video_title: videoList[i].title,
        video_description: videoList[i].description,
        video_author_name: videoList[i].author
          ? videoList[i].author.full_name
          : "TCD",
        video_author_image: videoList[i].author
          ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
            videoList[i].author.profile_image
          : "",
        video_url: uploadDirPath + "video/community/" + videoList[i].video_url,
        video_thumb_image:
          uploadDirPath +
          "video_thumb_image/community/" +
          videoList[i].video_thumb_image,
        video_duration: videoList[i].duration,
        //comments:videoComments,
        is_favourite: isFavouriteFlag,
      });
    }
  }
  let latestPublicEntry = await Diary.findOne({
    is_public: 1,
    is_active: 1,
    is_deleted: 0,
    is_complete: 1,
  })
    .populate({
      path: "user",
      select: { full_name: 1, profile_image: 1 },
    })
    .populate({
      path: "product",
      select: { name: 1 },
    })
    .select({
      created_at: 1,
      comments: 1,
    })
    .sort({ created_at: -1 });
  if (latestPublicEntry) {
    var entry = latestPublicEntry.toObject();
    entry.name = latestPublicEntry.product
      ? latestPublicEntry.product.name
      : "";
    entry.created_at = CommonHelper.formatedDate(
      latestPublicEntry.created_at,
      7
    );
    entry.user = latestPublicEntry.user ? latestPublicEntry.user.full_name : "";
    entry.user_profile_image = latestPublicEntry.user
      ? latestPublicEntry.user.profile_image
      : "";
  }
  //console.log(latestPublicEntry)
  //CommunityQuestionCategory
  let communityQuestionCond = { display_flag: 1, is_active: 1, is_deleted: 0 };
  if (req.query.community_search_text) {
    var searchText = req.query.community_search_text;
    communityQuestionCond.question = { $regex: searchText, $options: "i" };
  }
  let questions = await CommunityQuestion.find(communityQuestionCond)
    .populate({
      path: "category",
      select: { name: 1 },
    })
    .select({ question: 1, answer: 1 })
    .sort({ created_at: -1 });
  //console.log(questions)
  // if(questions.length == 0){
  //     return res.send({success:true,data:{videos,questions:null,entry}})
  // }
  let groupQuestions = [];
  if (questions.length > 0) {
    //get favourite questions
    let favQuesions = await FavouriteCommunityQuestion.find({
      user: userId,
      is_favourite: 1,
    });
    //console.log(favQuesions)
    favQuestionIds = [];
    if (favQuesions.length > 0) {
      for (var v = 0; v < favQuesions.length; v++) {
        var favQuestionId = favQuesions[v].question_id;
        favQuestionIds.push(favQuestionId);
      }
    }
    //get disliked questions
    let dislikedQuesions = await FavouriteCommunityQuestion.find({
      user: userId,
      is_favourite: 2,
    });
    // console.log(dislikedQuesions)
    dislikedQuestionIds = [];
    if (dislikedQuesions.length > 0) {
      for (var v = 0; v < dislikedQuesions.length; v++) {
        var dislikedQuesion = dislikedQuesions[v].question_id;
        dislikedQuestionIds.push(dislikedQuesion);
      }
    }
    let communityQuestions = [];
    //console.log(questions)
    for (var q = 0; q < questions.length; q++) {
      var isFavouriteFlag = 0;
      if (favQuestionIds.length > 0) {
        var isFavourite = favQuestionIds.some(function (favQuestion) {
          return favQuestion.equals(questions[q]._id);
        });
        if (isFavourite === true) {
          isFavouriteFlag = 1;
        }
      }
      if (dislikedQuestionIds.length > 0) {
        var isFavourite = dislikedQuestionIds.some(function (
          dislikedQuestionId
        ) {
          return dislikedQuestionId.equals(questions[q]._id);
        });
        if (isFavourite === true) {
          isFavouriteFlag = 2;
        }
      }
      communityQuestions.push({
        _id: questions[q]._id,
        question: questions[q].question,
        answer: questions[q].answer,
        category: questions[q].category,
        is_favourite: isFavouriteFlag,
      });
    }
    //console.log(communityQuestions)
    groupQuestions = communityQuestions.reduce((r, a) => {
      let questionObj = {
        _id: a._id,
        category: a.category.name,
        question: a.question,
        answer: a.answer,
        is_favourite: a.is_favourite,
      };
      r[a.category.name] = [...(r[a.category.name] || []), questionObj];
      return r;
    }, {});
  }
  let dataResponse = { videos, questions: groupQuestions, entry };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/community-info', request, dataResponse, userId, "");
  res.send(resultResponse);
  /*res.send({
    success: true,
    data: { videos, questions: groupQuestions, entry },
  });*/
});

//@desc add a question to community
//route GET /api/post-community-question
//@access Private
exports.postCommunityQuestion = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  if (!req.body.question) {
    return res.send({ success: false, message: "Please post a question" });
  }
  if (!req.body.category_id) {
    return res.send({ success: false, message: "Please choose a category" });
  }
  const findCategory = await CommunityQuestionCategory.findById(
    req.body.category_id
  );
  let question = new CommunityQuestion({
    user: userId,
    question: req.body.question,
    category: req.body.category_id,
  });
  await question.save();
  const emailObj = {
    userName: req.user.full_name,
    question: req.body.question,
    category: findCategory.name,
  };
  sendCommunityQuestionMail(emailObj);
  let dataResponse = {  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/post-community-question', request, dataResponse, userId, "Your question has posted successfully");
  res.send({ success: true, message: "Your question has posted successfully" });
});

//@desc mark a question as favourite
//route POST /api/mark-favourite-community-question
//@access Private
exports.markFavouriteQuestion = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  if (!req.body.question_id) {
    return res.send({ success: false, message: "Please provide question id" });
  }
  if (!req.body.is_favourite) {
    return res.send({
      success: false,
      message: "Please provide favourite falg",
    });
  }
  var success = false;
  var message = "";
  let qInfo = await CommunityQuestion.findOne({
    _id: req.body.question_id,
    is_active: 1,
  });
  if (!qInfo) {
    return res.send({ success: false, message: "Question does not exist" });
  }
  let favQuestionCheck = await FavouriteCommunityQuestion.findOne({
    question_id: req.body.question_id,
    user: userId,
  });
  if (favQuestionCheck) {
    if (favQuestionCheck.is_favourite == req.body.is_favourite) {
      if (req.body.is_favourite == 1) {
        message = "You already have like this question";
      } else {
        message = "You already have disliked this question";
      }
    } else {
      favQuestionCheck.is_favourite = req.body.is_favourite;
      await favQuestionCheck.save();
      success = true;
      if (req.body.is_favourite == 1) {
        message = "You like this question";
      } else {
        message = "You dislike this question";
      }
    }
  } else {
    let favQuestion = new FavouriteCommunityQuestion({
      question_id: req.body.question_id,
      user: userId,
      is_favourite: req.body.is_favourite,
    });
    await favQuestion.save();
    success = true;
    if (req.body.is_favourite == 1) {
      message = "You like this entry";
    } else {
      message = "You dislike this entry";
    }
  }
  let dataResponse = {  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/mark-favourite-community-question', request, dataResponse, userId, "");
  //res.send(resultResponse);
  res.send({ success, message });
});

//@desc add comment for a community question
//route POST /api/add-community-question-comment
//@access Private
exports.addCommunityQuestionComment = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  if (!req.body.question_id) {
    return res.send({ success: false, message: "Please provide question id" });
  }
  if (!req.body.comment) {
    return res.send({ success: false, message: "Please provide comment" });
  }
  var success = false;
  var message = "";
  let qInfo = await CommunityQuestion.findOne({
    _id: req.body.question_id,
    is_active: 1,
  });
  if (!qInfo) {
    return res.send({ success: false, message: "Question does not exist" });
  }
  qInfo.comments.push({
    commented_by: userId,
    comment: req.body.comment,
  });
  await qInfo.save();
  let dataResponse = {  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/add-community-question-comment', request, dataResponse, userId, "");
  res.send({ success: true, message: "Comment added successfully" });
});

//@desc search by COA sample id or batch id or UDID
//route GET /api/get-coa-info
//@access Private
exports.getCOAinformation = asyncHandler(async (req, res, next) => {
  try {
  if (!req.query.coa_number) {
    return res.send({ success: false, message: "Please provide COA number" });
  }
  var userId = req.user._id;
  var coaNo = req.query.coa_number;
  //console.log(ObjectId.isValid(coaNo))
  let findCond = { is_deleted: 0, is_active: 1 };
  findCond.$or = [
    { coa_no: coaNo },
    { coa_source: coaNo },
    { coa_source2: coaNo },
    { sample_id: coaNo },
    { batch_id: coaNo },
    (ObjectId.isValid(coaNo)) ? { _id: ObjectId(coaNo) } : { _id: ObjectId('616273656e6365576f726b73') }
  ];
  let coaInfo = await COA.findOne(findCond)
    .populate({
      path: "product",
      select: { name: 1, description: 1, product_image: 1, weight: 1 },
      populate: {
        path: "product_type",
        select: { parent_id: 1, type: 1, name: 1 },
        populate: {
          path: "parent_id",
          select: { name: 1 },
        },
      },
    })
    .populate({
      path: "strain",
      select: { name: 1 },
    })
    .populate({
      path: "cannabinoid_profile.composition_id",
      select: { name: 1 },
    })
    .populate({
      path: "terpenes.composition_id",
      select: { name: 1 },
    })
    .populate({
      path: "state",
      select: { name: 1 },
    });
  if (!coaInfo) {
    var logEntry = {
      search_terms: coaNo,
      type: "getCOAinformation",
      search_by: userId,
      status: "COA does not exists",
    };
    await SearchLogs.create(logEntry);
    return res.send({
      success: false,
      message: "Sorry ! we could not found a match with your COA number",
    });
  }
  var logEntry = {
    search_terms: coaNo,
    type: "getCOAinformation",
    search_by: userId,
    status: "completed",
  };
  await SearchLogs.create(logEntry);
  var prdImagePath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/product/";

  let cannabinoid_profile = [];
  if (coaInfo.cannabinoid_profile.length > 0) {
    for (c = 0; c < coaInfo.cannabinoid_profile.length; c++) {
      if (
        coaInfo.cannabinoid_profile[c].weight &&
        coaInfo.cannabinoid_profile[c].weight > 0
      ) {
        cannabinoid_profile.push({
          composition_id: coaInfo.cannabinoid_profile[c].composition_id._id,
          composition_name: coaInfo.cannabinoid_profile[c].composition_id.name,
          weight: coaInfo.cannabinoid_profile[c].weight,
        });
      }
    }
  }
  cannabinoid_profile.sort(function (a, b) {
    return b.weight - a.weight;
  });
  let terpenes = [];
  if (coaInfo.terpenes.length > 0) {
    for (c = 0; c < coaInfo.terpenes.length; c++) {
      if (coaInfo.terpenes[c].weight && coaInfo.terpenes[c].weight > 0) {
        terpenes.push({
          composition_id: coaInfo.terpenes[c].composition_id._id,
          composition_name: coaInfo.terpenes[c].composition_id.name,
          weight: coaInfo.terpenes[c].weight,
        });
      }
    }
  }
  terpenes.sort(function (a, b) {
    return b.weight - a.weight;
  });
  let info = {
    id: coaInfo._id,
    coa_no: coaInfo.coa_no,
    uid: coaInfo.coa_no,
    product_id: coaInfo.product ? coaInfo.product._id : "",
    product_type: coaInfo.product ? coaInfo.product.product_type.name : "",
    name: coaInfo.product ? coaInfo.product.name : "",
    product_name: coaInfo.product ? coaInfo.product.name : "",
    description: coaInfo.product ? coaInfo.product.description : "",
    product_image: coaInfo.product
      ? prdImagePath + coaInfo.product.product_image
      : "",
    weight: coaInfo.product ? coaInfo.product.weight : "",
    state: coaInfo.state ? coaInfo.state.name : "",
    strain_id: coaInfo.strain._id,
    strain: coaInfo.strain.name,
    brand: coaInfo.strain.name,
    cannabinoid_profile,
    terpenes,
    total_cannabinoid: coaInfo.total_cannabinoid,
    total_terpenes: coaInfo.total_terpenes,
    total_thc: coaInfo.total_THC ? coaInfo.total_THC : "",
    total_cbd: coaInfo.total_CBD ? coaInfo.total_CBD : "",
    laboratory_name: coaInfo.laboratory_name,
    tested_at: CommonHelper.formatedDate(coaInfo.tested_at, 7),
    positive_test_report_text: coaInfo.positive_test_report_text,
    negative_test_report_text: coaInfo.negative_test_report_text,
  };
  //console.log(coaInfo)
  let dataResponse = { coainfo: info };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-coa-info', request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: { coainfo: info } });
  } catch (e) {
    console.log(e)
    res.send({ success: false, data: e });
  }
});

//@desc get coa composition list(terpenes or cannabinoids)
//route GET /api/compositions
//@access Private
exports.getCompositions = asyncHandler(async (req, res, next) => {
  if (!req.query.type) {
    return res.send({ success: false, message: "Please specify type" });
  }
  var type = req.query.type;
  let compositions = [];
  let compositionList = await Composition.find({
    is_active: 1,
    is_deleted: 0,
    type,
  });
  var deFaultimagePath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png";
  if (compositionList.length > 0) {
    var imagePath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/composition/";
    for (c = 0; c < compositionList.length; c++) {
      var imageCheck = compositionList[c].image
        ? imagePath + compositionList[c].image
        : deFaultimagePath;
      var checkImageResponse = await CommonHelper.checkImageUrlPath(imageCheck);
      compositions.push({
        id: compositionList[c]._id,
        name: compositionList[c].name,
        description: compositionList[c].description,
        image: checkImageResponse === 200 ? imageCheck : deFaultimagePath,
      });
    }
  }
  let dataResponse = { compositions };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/compositions', request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: { compositions } });
});

//@desc get static content
//route GET /api/get-content/:slug
//@access Private
exports.getStaticContent = asyncHandler(async (req, res, next) => {
  let slug = req.params.slug;
  if (!slug) {
    return res.send({ success: false, message: "Please provide slug" });
  }
  let cmsCond = { slug: slug, is_deleted: 0, is_active: 1, content_type: 2 };
  let cmsObj = await CMS.findOne(cmsCond).sort({ sort_order: 1 });
  var deFaultimagePath =
    "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png";
  if (!cmsObj) {
    return res.send({ success: false, message: "Content does not exist" });
  }
  let cmsCondSubField = {
    page_title: 1,
    page_content: 1,
    banner_image: 1,
    slug: 1,
  };
  let cmsCondSub = {
    is_deleted: 0,
    is_active: 1,
    content_type: 2,
    parent_content: cmsObj._id,
  };
  let cmsObjSub = [];
  let cmsSubContent = await CMS.find(cmsCondSub, cmsCondSubField).sort({
    sort_order: 1,
  }); 

  var imagePath = "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/cms/";

  if (cmsSubContent.length > 0) {
    for (c = 0; c < cmsSubContent.length; c++) {
      var imageCheck = cmsSubContent[c].banner_image
        ? imagePath + cmsSubContent[c].banner_image
        : deFaultimagePath;
      var checkImageResponse = await CommonHelper.checkImageUrlPath(imageCheck);
      cmsObjSub.push({
        banner_image: checkImageResponse === 200 ? imageCheck : deFaultimagePath,
        _id: cmsSubContent[c]._id,
        page_title: cmsSubContent[c].page_title,
        page_content: cmsSubContent[c].page_content,
        slug: cmsSubContent[c].slug,
      });
    }
  }
  let content = {
    page_title: cmsObj.page_title,
    page_content: cmsObj.page_content,
    page_banner_image: cmsObj.banner_image
      ? imagePath + cmsObj.banner_image
      : "",
    page_sub_content: { cmsObjSub },
  };
  let dataResponse = { content };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-content/'+slug, request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: { content }, message: "" });
});

function remove_duplicates(arr) {
  var obj = {};
  var ret_arr = [];
  for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
  }
  for (var key in obj) {
      ret_arr.push(ObjectId(key));
  }
  return ret_arr;
}

//@desc get all active Products
//route GET /api/get-all-products/
//@access Private
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  let findCond = { is_deleted: 0, is_active: 1 };
  if (req.query.search_product) {
    findCond.name = { $regex: req.query.search_product, $options: "i" };
  }
  if (req.query.brand) {
    findCond.strain = req.query.brand;
  }
  let productIds = [];
  if (req.query.consumptionmethods) {  
    let findCondConsumption = { is_deleted: 0, is_active: 1 };
    findCondConsumption.consumption_method = req.query.consumptionmethods
    let findCondConsumptionProd = await Diary.find(findCondConsumption);
    if (findCondConsumptionProd.length > 0) {
      findCondConsumptionProd.forEach((u) => {
        var o_id = new ObjectId(u.product);
        productIds.push(new ObjectId(o_id));
      });
    }
    findCond._id = { $in: productIds };
  }
  if (req.query.findproducts) { 
    let findCondProds = { is_deleted: 0, is_active: 1 };
    // find activities
    if (req.query.findproducts == 'activities') {
      findCondProds.$or = [
        {pre_activities : { $exists: true, $ne: null }},
        {desired_activities : { $exists: true, $ne: null }},
        {actual_activities : { $exists: true, $ne: null }}
      ]
    // find conditions
    } else if (req.query.findproducts == 'conditions') { 
      findCondProds.$or = [
        {pre_condition : { $exists: true, $ne: null }},
        {desired_condition : { $exists: true, $ne: null }},
        {actual_condition : { $exists: true, $ne: null }}
      ]
    // find effects
    } else if (req.query.findproducts == 'effects') { 
      findCondProds.$or = [
        {pre_effects : { $exists: true, $ne: null }},
        {desired_effects : { $exists: true, $ne: null }},
        {actual_effects : { $exists: true, $ne: null }}
      ]
    // find symptoms
    } else if (req.query.findproducts == 'symptoms') { 
      findCondProds.$or = [
        {pre_symptoms : { $exists: true, $ne: null }},
        {desired_symptoms : { $exists: true, $ne: null }},
        {actual_symptoms : { $exists: true, $ne: null }}
      ]
    }
    let findDiaryProd = await Diary.find(findCondProds);
    if (findDiaryProd.length > 0) {
      findDiaryProd.forEach((u) => {
        var o_id = new ObjectId(u.product);
        productIds.push(new ObjectId(o_id));
      });
    }
    findCond._id = { $in: productIds };
  }
  if (req.query.aces) {
    //findCond._id = req.query.aces;
    // check for activities
    let findCondAces = { is_deleted: 0, is_active: 1 };
    let findActivityCond = findCondAces;
    findActivityCond.$or = [
        {'pre_activities.activity_id' : ObjectId(req.query.aces)},
        {'desired_activities.activity_id' : ObjectId(req.query.aces)},
        {'actual_activities.activity_id' : ObjectId(req.query.aces)}
      ]
    let findActivityData = await Diary.find(findActivityCond);
    if (findActivityData.length > 0) {
      findActivityData.forEach((u) => {
        var o_id = new ObjectId(u.product);
        productIds.push(new ObjectId(o_id));
      });
    }
    // check for conditions
    let findConditionsCond = findCondAces;
    findConditionsCond.$or = [
        {'pre_condition.condition_id' : ObjectId(req.query.aces)},
        {'desired_condition.condition_id' : ObjectId(req.query.aces)},
        {'actual_condition.condition_id' : ObjectId(req.query.aces)}
      ]
    let findConditionsData = await Diary.find(findConditionsCond);
    if (findConditionsData.length > 0) {
      findConditionsData.forEach((u) => {
        var o_id = new ObjectId(u.product);
        productIds.push(new ObjectId(o_id));
      });
    }
    // check for effects
    let findEffectsCond = findCondAces;
    findEffectsCond.$or = [
        {'pre_effects.effect_id' : ObjectId(req.query.aces)},
        {'desired_effects.effect_id' : ObjectId(req.query.aces)},
        {'actual_effects.effect_id' : ObjectId(req.query.aces)}
      ]
    let findEffectsData = await Diary.find(findEffectsCond);
    if (findEffectsData.length > 0) {
      findEffectsData.forEach((u) => {
        var o_id = new ObjectId(u.product);
        productIds.push(new ObjectId(o_id));
      });
    }

    // check for symptoms
    let findSymptomsCond = findCondAces;
    findSymptomsCond.$or = [
        {'pre_symptoms.symptom_id' : ObjectId(req.query.aces)},
        {'desired_symptoms.symptom_id' : ObjectId(req.query.aces)},
        {'actual_symptoms.symptom_id' : ObjectId(req.query.aces)}
      ]
    let findSymptomsData = await Diary.find(findSymptomsCond);
    if (findSymptomsData.length > 0) {
      findSymptomsData.forEach((u) => {
        var o_id = new ObjectId(u.product);
        productIds.push(new ObjectId(o_id));
      });
    }
    var uniqProductIds = remove_duplicates(productIds);
    findCond._id = { $in: uniqProductIds };
  }
  let productData = await Product.find(findCond).populate({path: "product_type", select: { name: 1, _id: 1 }}).populate({path: "strain", select: { name: 1, _id: 1 }}).populate({path: "updated_by", select: { fullname: 1, _id: 1 }});
  let defaultImage = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png';
  let productReviews = [{
    _id : '616273656e6365576f728b71',
    comment : 'This is a great brand',
    user: 'Fammmy Lyn',
    user_rating: 4,
    user_profile: defaultImage,
    create_at: '2022-09-14'
  },{
    _id : '616273656e6365576f728b71',
    comment : 'This is a great brand',
    user: 'Rodeo Sin',
    user_rating: 5,
    user_profile: defaultImage,
    create_at: '2022-09-14'
  }]
  let productDataResult = []
  if (productData.length > 0) {
    for (var v = 0; v < productData.length; v++) {
      //findCondProd.strain = brands[v]._id;
      //let productCount = await Product.countDocuments(findCondProd);
      productDataResult.push({
        _id : productData[v]._id,
        description : productData[v].description,
        weight : productData[v].weight,
        product_image : (productData[v].product_image) ? productData[v].product_image : defaultImage,
        COA_identifier : (productData[v].COA_identifier) ? productData[v].COA_identifier : "",
        has_identifier : (productData[v].has_identifier) ? productData[v].has_identifier : "",
        is_active : productData[v].is_active,
        is_deleted : productData[v].is_deleted,
        name : productData[v].name,
        strain : productData[v].strain,
        product_type : productData[v].product_type,
        updated_by : productData[v].updated_by,
        created_at : productData[v].created_at,
        ratings : 0,
        checmical_compounds : productData[v].checmical_compounds,
        productReview : productReviews
      }
      );
    }
  }
  let dataResponse = productDataResult;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-all-products/', request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: productData, message: "" });
});

//@desc get recommedations
//route GET /api/get-recommedantions/
//@access Private
exports.getRecommendations = asyncHandler(async (req, res, next) => {
  let consumptionMethods = [];
  let acesMerge = [];
  var uploadDirPath = "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin";

  let activityList = await Activity.find({
    is_active: 1,
    is_deleted: 0,
    type: 2,
  })
    .select({ name: 1, image: 1, icon: 1 })
    .sort({ sort_order: 1 });
  let methods = await ConsumptionMethod.find({
    type: 2,
    is_active: 1,
    is_deleted: 0,
  }).sort({ sort_order: 1 });
  let conditionList = await Condition.find({
    is_active: 1,
    is_deleted: 0,
  }).sort({ sort_order: 1 });
  if (activityList.length > 0) {
    for (var i = 0; i < activityList.length; i++) {
      acesMerge.push({
        _id: activityList[i]._id,
        name: activityList[i].name,
        image: activityList[i].image
          ? uploadDirPath + "/activity/" + activityList[i].image
          : "",
        icon: activityList[i].icon
          ? uploadDirPath + "/activity/" + activityList[i].icon
          : "",
      });
    }
  }
  let symptomList = await Symptom.find({ is_active: 1, is_deleted: 0, type: 2 })
    .select({ name: 1, image: 1, icon: 1 })
    .sort({ name: 1 });
  if (symptomList.length > 0) {
    for (var i = 0; i < symptomList.length; i++) {
      acesMerge.push({
        _id: symptomList[i]._id,
        name: symptomList[i].name,
        image: symptomList[i].image
          ? uploadDirPath + "/symptom/" + symptomList[i].image
          : "",
        icon: symptomList[i].icon
          ? uploadDirPath + "/symptom/" + symptomList[i].icon
          : "",
      });
    }
  }
  let effectList = await Effect.find({ is_active: 1, is_deleted: 0, type: 2 })
    .select({ name: 1, image: 1, icon: 1 })
    .sort({ name: 1 });
  if (effectList.length > 0) {
    for (var i = 0; i < effectList.length; i++) {
      acesMerge.push({
        _id: effectList[i]._id,
        name: effectList[i].name,
        image: effectList[i].image
          ? uploadDirPath + "/effect/" + effectList[i].image
          : "",
        icon: effectList[i].icon
          ? uploadDirPath + "/effect/" + effectList[i].icon
          : "",
      });
    }
  }
  if (conditionList.length > 0) {
    for (var i = 0; i < conditionList.length; i++) {
      acesMerge.push({
        _id: conditionList[i]._id,
        name: conditionList[i].name,
        image: conditionList[i].image
          ? uploadDirPath + "/condition/" + conditionList[i].image
          : "",
        icon: conditionList[i].icon
          ? uploadDirPath + "/condition/" + conditionList[i].icon
          : "",
      });
    }
  }
  if (methods.length > 0) {
    var imagePath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/methods/";
    for (var i = 0; i < methods.length; i++) {
      let measurementScale = [];
      if (methods[i].measurement_scales.length > 0) {
        for (var s = 0; s < methods[i].measurement_scales.length; s++) {
          measurementScale.push(methods[i].measurement_scales[s].scale);
        }
      }
      consumptionMethods.push({
        _id: methods[i]._id,
        name: methods[i].name,
        icon: methods[i].icon ? imagePath + methods[i].icon : "",
        measurement_unit: methods[i].measurement_unit,
        measurement_scales: measurementScale,
      });
    }
  }

  let defaultImage = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/default/default.png';

  let findProduct = [{
    activities: [{
      name: 'activities',
      image: defaultImage,
      description : 'Activities'
    }],
    conditions: [{
      name: 'conditions',
      image: defaultImage,
      description : 'ConDitions'
    }],
    effects: [{
      name: 'effects',
      image: defaultImage,
      description : 'Effects'
    }],
    symptoms: [{
      name: 'symptoms',
      image: defaultImage,
      description : 'Symptoms'
    }]
  }];

  let recommdationsFilter = [{
    Products : acesMerge,
    FindProducts : findProduct,
    ConsumptionMethods : consumptionMethods,
  }]


  let dataResponse = recommdationsFilter;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-recommendations/', request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: productData, message: "" });
});

//@desc get all active Products
//route GET /api/get-product-details/:id
//@access Private
exports.getProductDetails = asyncHandler(async (req, res, next) => {
  let ProdId = req.params.id;
  if (!ProdId) {
    return res.send({ success: false, message: "Please provide product id" });
  }

  let findCond = { _id: ObjectId(ProdId), is_deleted: 0, is_active: 1 };
  let productData = await Product.find(findCond);
  let dataResponse = productData;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-product-details/'+ProdId, request, dataResponse, userId, "");
  res.send(resultResponse);
  //res.send({ success: true, data: productData, message: "" });
});

//@desc login with finger print
//route POST /api/biometric-login
//@access Private
exports.fingerPrintLogin = asyncHandler(async (req, res, next) => {
  if (!req.body.device_id) {
    return res.send({ success: false, message: "Please provide device id" });
  }
  if (!req.body.device_type) {
    return res.send({ success: false, message: "Please provide device type" });
  }
  const user = await User.findOne({
    device_ids: { $elemMatch: { device_id: req.body.device_id } },
  });
  if (!user) {
    return res.send({
      success: false,
      message: "This device is not registered with any user",
    });
  }
  var isDeactivated = false;
  if (user.is_active == 4) {
    isDeactivated = true;
    var deactivatedOn = CommonHelper.formatedDate(user.deactivated_at, 7);
    return res.send({
      success: false,
      data: { is_deactivated: isDeactivated, deactivated_on: deactivatedOn },
      message: `You have deactivated your account on ${deactivatedOn} . To use the TCD app, you will need to activate your account again.`,
    });
  }
  if (user.is_active == 0) {
    return res.send({
      success: false,
      message: "Your account has blocked by administrator",
    });
  }
  if (user.is_active == 3) {
    return res.send({
      success: true,
      is_active: user.is_active,
      message: "Please verify your email",
    });
  }
  const token = await user.generateAuthToken();

  user.device_type = req.body.device_type;
  if (req.body.device_push_key != undefined) {
    user.device_push_key = req.body.device_push_key;
  }
  await user.save();

  let userInfo = await User.findById(user._id)
    .populate({
      path: "state",
      select: { name: 1 },
      populate: {
        path: "country",
        select: { name: 1 },
      },
    })
    .populate({
      path: "cannabis_consumption",
      select: { name: 1 },
    })
    .populate({
      path: "physique",
      select: { name: 1 },
    })
    .populate({
      path: "favourite_strains",
      select: { name: 1 },
    })
    .populate({
      path: "effects.effect_id",
      select: { name: 1 },
    })
    .populate({
      path: "symptoms.symptom_id",
      select: { name: 1 },
    })
    .populate({
      path: "activities.activity_id",
      select: { name: 1 },
    })
    .populate({
      path: "cannabinoids.cannabinoid_id",
      select: { name: 1 },
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
      favourite_strains: 1,
      height: 1,
      height_scale: 1,
      weight: 1,
      weight_scale: 1,
      activity_level: 1,
      is_active: 1,
      show_tutorial_flag: 1,
      twoFA_is_on: 1,
    });
  //console.log(userInfo.activities)
  var userDetails = userInfo.toObject();
  userDetails.profile_image = userInfo.profile_image
    ? "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/" +
      userInfo.profile_image
    : "";
  if (userInfo.dob) {
    userDetails.dob = CommonHelper.formatedDate(userInfo.dob, 7);
  }
  if (userDetails.state) {
    userDetails.state = userInfo.state._id;
    userDetails.state_name = userInfo.state.name;
    userDetails.country = userInfo.state.country._id;
    userDetails.country_name = userInfo.state.country.name;
  }
  if (userInfo.cannabis_consumption) {
    userDetails.cannabis_consumption_id = userInfo.cannabis_consumption._id;
    userDetails.cannabis_consumption = userInfo.cannabis_consumption.name;
  }
  userDetails.favourite_strains_id = "";
  userDetails.favourite_strains = "";
  if (userInfo.favourite_strains) {
    userDetails.favourite_strains_id = userInfo.favourite_strains._id;
    userDetails.favourite_strains = userInfo.favourite_strains.name;
  }
  if (userInfo.physique) {
    userDetails.physique_id = userInfo.physique._id;
    userDetails.physique = userInfo.physique.name;
  }
  if (userDetails.symptoms) {
    let symptoms = [];
    for (var i = 0; i < userDetails.symptoms.length; i++) {
      symptoms.push({
        symptom_id: userDetails.symptoms[i].symptom_id._id,
        symptom_name: userDetails.symptoms[i].symptom_id.name,
      });
    }
    userDetails.symptoms = symptoms;
  }
  if (userDetails.effects) {
    let effects = [];
    for (var i = 0; i < userDetails.effects.length; i++) {
      effects.push({
        effect_id: userDetails.effects[i].effect_id._id,
        effect_name: userDetails.effects[i].effect_id.name,
      });
    }
    userDetails.effects = effects;
  }
  if (userDetails.cannabinoids) {
    let cannabinoids = [];
    for (var i = 0; i < userDetails.cannabinoids.length; i++) {
      cannabinoids.push({
        cannabinoid_id: userDetails.cannabinoids[i].cannabinoid_id._id,
        cannabinoid_name: userDetails.cannabinoids[i].cannabinoid_id.name,
      });
    }
    userDetails.cannabinoids = cannabinoids;
  }
  if (userDetails.activities) {
    let activities = [];
    for (var i = 0; i < userDetails.activities.length; i++) {
      activities.push({
        activity_id: userDetails.activities[i].activity_id._id,
        activity_name: userDetails.activities[i].activity_id.name,
      });
    }
    userDetails.activities = activities;
  }
  //check incomplete entries
  var has_incomplete_entry = false;
  var entry_id = "";
  let incompleteEntry = await Diary.findOne({
    has_incompleteness_notified: 2,
    is_complete: 2,
    user: userDetails._id,
  });
  if (incompleteEntry) {
    has_incomplete_entry = true;
    entry_id = incompleteEntry._id;
  }
  let dataResponse = { user: userDetails, token, has_incomplete_entry, entry_id };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/biometric-login', request, dataResponse, userId, "You have logged in successfully");
  res.send(resultResponse);

  /*res.send({
    success: true,
    message: "You have logged in successfully",
    data: { user: userDetails, token, has_incomplete_entry, entry_id },
  });*/
});

//@desc update a flag to keep a check that whether a user has watched app tutorial video or not
//route POST /api/update-tutorial-flag
//@access Private
exports.updateTutorialFlag = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  let userInfo = await User.findById(userId);
  userInfo.show_tutorial_flag = 1;
  await userInfo.save();
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/update-tutorial-flag', request, dataResponse, userId, "Information updated successfully");
  //res.send(resultResponse);
  res.send({
    success: true,
    message: "Information updated successfully",
  });
});


//@desc update a flag to keep a check that whether a user has notified about their incomplete entry or not
//route POST /api/update-entry-notify-flag
//@access Private
exports.updateEntryFlag = asyncHandler(async (req, res, next) => {
  if (!req.body.entry_id) {
    return res.send({ success: false, message: "Please provide entry id" });
  }
  const userId = req.user._id;
  var entryId = req.body.entry_id;
  let entryInfo = await Diary.findOne({ _id: entryId, user: userId });
  if (!entryInfo) {
    return res.send({ success: false, message: "Entry does not exist" });
  }
  entryInfo.has_incompleteness_notified = 1;
  await entryInfo.save();
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/update-entry-notify-flag', request, dataResponse, userId, "Updated successfully");
  //res.send(resultResponse);
  res.send({ success: true, message: "Updated successfully" });
});

//@desc deactivate an user's tcd account
//route POST /api/deactivate-account
//@access Private
exports.deactivateAccount = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  let userDetails = await User.findOne({ _id: userId, is_deleted: 0 });
  if (!userDetails) {
    return res.send({ success: false, message: "User does not exist" });
  }
  if (userDetails.is_active == 4) {
    return res.send({
      success: false,
      message: "This user account is already deactivated",
    });
  }
  userDetails.is_active = 4;
  userDetails.deactivated_at = new Date();
  await userDetails.save();
  await Diary.updateMany(
    { user: userId, is_deleted: 0, is_active: 1 },
    { is_deactivated: 1, is_deleted: 1 }
  );
  await CommunityQuestion.updateMany(
    { user: userId },
    { is_deactivated: 1, is_deleted: 1 }
  );
  if (userDetails.device_push_key) {
    NotifyHelper.sendPush(
      userDetails.device_push_key,
      "Your TCD account has been deactivated",
      "7"
    );
  }
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/deactivate-account', request, dataResponse, userId, "You have logged in successfully");
  //res.send(resultResponse);
  res.send({
    success: true,
    message: "This user account has been deactivated succesfully",
  });
});

//@desc activate an user's tcd account
//route POST /api/activate-account
//@access Public
exports.activateAccount = asyncHandler(async (req, res, next) => {
  var email = req.body.email;
  let userDetails = await User.findOne({ email: email, is_deleted: 0 });
  if (!userDetails) {
    return res.send({ success: false, message: "User does not exist" });
  }
  if (userDetails.is_active == 1) {
    return res.send({
      success: false,
      message: "This user account is an active account",
    });
  }
  var userId = userDetails._id;
  userDetails.is_active = 1;
  //userDetails.is_deactivated = 0
  await userDetails.save();
  await Diary.updateMany(
    { user: userId, is_deactivated: 1 },
    { is_deactivated: 0, is_deleted: 0 }
  );
  await CommunityQuestion.updateMany(
    { user: userId, is_deactivated: 1 },
    { is_deactivated: 0, is_deleted: 0 }
  );
  const token = await userDetails.generateAuthToken();
  //console.log(token)
  if (userDetails.device_push_key) {
    NotifyHelper.sendPush(
      userDetails.device_push_key,
      "Your TCD account has been activated succesfully",
      "8"
    );
  }
  let dataResponse = { token };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/activate-account', request, dataResponse, userId, "This user account has been activated succesfully");
  res.send(resultResponse);
  /*res.send({
    success: true,
    data: { token },
    message: "This user account has been activated succesfully",
  });*/
});

//@desc update app settings
//route POST /api/update-settings
//@access Private
exports.updateNotificationSettings = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  // if(!req.body.is_on || !req.body.reminder_interval){
  //     return res.send({success:false,message:"Please provide required information"})
  // }
  let userDetails = await User.findOne({ _id: userId, is_deleted: 0 });
  if (!userDetails) {
    return res.send({ success: false, message: "User does not exist" });
  }
  if (req.body.is_on) {
    userDetails.post_consumption_reminder_is_on = req.body.is_on;
  }
  if (req.body.reminder_interval) {
    userDetails.post_consumption_reminder_interval = req.body.reminder_interval;
  }
  if (req.body.twoFA_is_on) {
    userDetails.twoFA_is_on = req.body.twoFA_is_on;
  }
  if (req.body.get_tcd_update) {
    userDetails.get_tcd_update = req.body.get_tcd_update;
  }
  // userDetails.post_consumption_reminder_info.push({
  //     is_on : req.body.is_on,
  //     post_consumption_reminder_interval:req.body.reminder_interval
  // })
  await userDetails.save();
  let dataResponse = { };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/update-settings', request, dataResponse, userId, "");
  //res.send(resultResponse);
  res.send({ success: true, message: "Information updated succesfully" });
});

//@desc get app settings information
//route POST /api/get-settings
//@access Private
exports.getSettingsInfo = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  let userDetails = await User.findOne({ _id: userId, is_deleted: 0 }).select({
    post_consumption_reminder_is_on: 1,
    post_consumption_reminder_interval: 1,
    twoFA_is_on: 1,
    get_tcd_update: 1,
  });
  if (!userDetails) {
    return res.send({ success: false, message: "User does not exist" });
  }
  //console.log(userDetails)
  let info = {};
  info.get_tcd_update = userDetails.get_tcd_update;
  info.twoFA_is_on = userDetails.twoFA_is_on;
  info.is_on = userDetails.post_consumption_reminder_is_on;
  info.reminder_interval = CommonHelper.convertMinsToHrsMins(
    userDetails.post_consumption_reminder_interval
  );
  //console.log(info)
  let dataResponse = { info };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-settings', request, dataResponse, userId, "Information updated succesfully");
  res.send(resultResponse);
  /*res.send({
    success: true,
    data: { info },
    message: "Information updated succesfully",
  }); */
});

//@desc delete an user's account
//route POST /api/delete-account
//@access Private
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  var userId = req.user._id;
  let userDetails = await User.findById(userId);
  if (!userDetails) {
    return res.send({ success: false, message: "User does not exist" });
  }
  if (userDetails.is_deleted == 1) {
    return res.send({
      success: false,
      message: "This user account does not exist",
    });
  }
  userDetails.is_deleted = 1;
  userDetails.deleted_at = new Date();
  userDetails.token = "";
  await userDetails.save();
  updRes = await Diary.updateMany({ user: userId }, { is_deleted: 1 });
  //console.log(updRes.nModified)
  await CommunityQuestion.updateMany({ user: userId }, { is_deleted: 1 });
  if (userDetails.device_push_key) {
    NotifyHelper.sendPush(
      userDetails.device_push_key,
      "Your TCD account has been deleted succesfully",
      "9"
    );
  }
  let dataResponse = { };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/delete-account', request, dataResponse, userId, "This");
  //res.send(resultResponse);
  res.send({
    success: true,
    message: "This user account has been deleted succesfully",
  });
});

//@desc get banner advertisement
//route GET /api/get-banner-advertisements
//@access Private
exports.getBannerAdvertisements = asyncHandler(async (req, res, next) => {
  let advertisements = await BannerAdvertisement.find({
    is_deleted: 0,
    is_active: 1,
  });
  let list = [];
  if (advertisements.length > 0) {
    var imagePath =
      "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/banner_advertisement/";
    for (var a = 0; a < advertisements.length; a++) {
      list.push({
        _id: advertisements[a]._id,
        title: advertisements[a].banner_advertisement_title,
        image: advertisements[a].banner_advertisement_image
          ? imagePath + advertisements[a].banner_advertisement_image
          : "",
      });
    }
  }
  let dataResponse = { advertisements: list };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-banner-advertisements', request, dataResponse, userId, "Banner advertisement list");
  res.send(resultResponse);
  /*res.send({
    success: true,
    message: "Banner advertisement list",
    data: { advertisements: list },
  });*/
});

//@desc get activity analytics
//route GET /api/get-activity-graph-data
//@access Private
exports.getActivityGraphData = asyncHandler(async (req, res, next) => {
  if (!req.query.activity_id) {
    return res.send({ success: false, message: "Please provide activity id" });
  }
  if (!req.query.month) {
    return res.send({ success: false, message: "Please provide month" });
  }
  const mongoose = require("mongoose");
  var activityId = mongoose.Types.ObjectId(req.query.activity_id);
  const userId = req.user._id;
  const year = new Date().getFullYear();
  const month = parseInt(req.query.month);

  /**Consumption Methods Graph Data */
  const aggregatedResult = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        pre_activities: {
          $elemMatch: { activity_id: activityId },
        },
        is_complete: 1,
      },
    },
    {
      $group: {
        _id: "$consumption_method",
        count: { $sum: 1 },
        //totalScale: { $sum: { $multiply: [ "$consumption_scale" ] } },
      },
    },
    {
      $lookup: {
        from: "consumptionmethods",
        localField: "_id",
        foreignField: "_id",
        as: "type",
      },
    },
    {
      $sort: { type: 1 },
    },
    {
      $unwind: "$type",
    },
    {
      $project: {
        count: 1,
        "type._id": 1,
        "type.name": 1,
      },
    },
  ]).exec();
  //console.log(aggregatedResult)
  let methods = [];
  let methodlist = await ConsumptionMethod.find({
    type: 2,
    is_deleted: 0,
    is_active: 1,
  }).select({ name: 1 });
  //console.log(methodlist)
  if (methodlist.length > 0) {
    for (var m = 0; m < methodlist.length; m++) {
      methods.push(methodlist[m].name);
    }
  }
  //console.log(methods)
  let consumptionMethodsOverview = [];
  let existingMethods = [];
  if (aggregatedResult.length > 0) {
    for (var i = 0; i < aggregatedResult.length; i++) {
      existingMethods.push(aggregatedResult[i].type.name);
      consumptionMethodsOverview.push({
        consumption_method_id: aggregatedResult[i].type._id,
        consumption_method: aggregatedResult[i].type.name,
        scale: aggregatedResult[i].count,
      });
    }
    //console.log(existingMethods)
    for (var i = 0; i < methods.length; i++) {
      if (existingMethods.includes(methods[i]) === false) {
        consumptionMethodsOverview.push({
          consumption_method_id: parseInt(i + 1),
          consumption_method: methods[i],
          scale: 0,
        });
      }
    }
  } else {
    for (m = 0; m < methods.length; m++) {
      consumptionMethodsOverview.push({
        consumption_method_id: parseInt(m + 1),
        consumption_method: methods[m],
        scale: 0,
      });
    }
  }
  //console.log(consumptionMethodsOverview)
  consumptionMethodsOverview.sort(
    (a, b) => parseFloat(a.id) - parseFloat(b.id)
  );
  /**Consumption Methods Graph Data END */
  /**Cannabinoids  */
  let cannabinoidAggData = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        pre_activities: {
          $elemMatch: { activity_id: activityId },
        },
        is_complete: 1,
      },
    },
    {
      $group: {
        _id: "$cannabinoid_profile.composition_id",
        count: { $sum: 1 },
        totalweight: { $sum: "$cannabinoid_profile.weight" },
        //"totalweight": { "$sum": { $multiply: [ "$cannabinoid_profile.weight" ] } },
        avgweight: { $avg: "$cannabinoid_profile.weight" },
      },
    },
    {
      $lookup: {
        from: "compositions",
        localField: "_id",
        foreignField: "_id",
        as: "composition",
      },
    },
    {
      $sort: { composition: 1 },
    },
    {
      $unwind: "$composition",
    },
    {
      $project: {
        count: 1,
        totalweight: 1,
        avgweight: 1,
        "composition._id": 1,
        "composition.name": 1,
      },
    },
  ]).exec();
  console.log(cannabinoidAggData);
  let cannabinoids = [];
  if (cannabinoidAggData.length > 0) {
    for (var c = 0; c < cannabinoidAggData.length; c++) {
      cannabinoids.push({
        cannabinoid: cannabinoidAggData[c].composition.name,
        //scale:cannabinoidAggData[c].avgweight
        scale: "0.19",
      });
    }
  }
  /**END */
  /**Terpenes  */
  let terpenesAggData = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        pre_activities: {
          $elemMatch: { activity_id: activityId },
        },
        is_complete: 1,
      },
    },
    {
      $group: {
        _id: "$terpenes.composition_id",
        count: { $sum: 1 },
        totalweight: { $sum: "$terpenes.weight" },
        //"totalweight": { "$sum": { $multiply: [ "$cannabinoid_profile.weight" ] } },
        avgweight: { $avg: "$terpenes.weight" },
      },
    },
    {
      $lookup: {
        from: "compositions",
        localField: "_id",
        foreignField: "_id",
        as: "composition",
      },
    },
    {
      $sort: { composition: 1 },
    },
    {
      $unwind: "$composition",
    },
    {
      $project: {
        count: 1,
        totalweight: 1,
        avgweight: 1,
        "composition._id": 1,
        "composition.name": 1,
      },
    },
  ]).exec();
  //console.log(terpenesAggData)
  let terpenes = [];
  if (terpenesAggData.length > 0) {
    for (var c = 0; c < terpenesAggData.length; c++) {
      terpenes.push({
        terpene: terpenesAggData[c].composition.name,
        //scale:cannabinoidAggData[c].avgweight
        scale: "0.17",
      });
    }
  }
  /**END */
  let findCond = {
    user: userId,
    year: year,
    month: month,
    pre_activities: {
      $elemMatch: { activity_id: activityId },
    },
    is_complete: 1,
  };
  let resultSet = await Diary.find(findCond)
    .populate({
      path: "coa_id",
      select: {
        total_cannabinoid_mg: 1,
        total_terpenes_mg: 1,
        total_THC_mg: 1,
        total_CBD_mg: 1,
      },
    })
    .select({ is_active: 1 });
  //console.log(resultSet)
  let pieData = {};
  if (resultSet.length > 0) {
    var coa = 0;
    var calculatedTHC = 0;
    var calculatedCBD = 0;
    var calculatedOthers = 0;
    for (var r = 0; r < resultSet.length; r++) {
      if (resultSet[r].coa_id) {
        coa++;
        var others =
          resultSet[r].coa_id.total_cannabinoid_mg -
          (resultSet[r].coa_id.total_THC_mg + resultSet[r].coa_id.total_CBD_mg);
        var total =
          resultSet[r].coa_id.total_cannabinoid_mg +
          resultSet[r].coa_id.total_terpenes_mg;
        if (total > 0) {
          calculatedTHC += (resultSet[r].coa_id.total_THC_mg / total) * 100;
          calculatedCBD += (resultSet[r].coa_id.total_CBD_mg / total) * 100;
          calculatedOthers += (others / total) * 100;
        }
      }
    }
    pieData = {
      THC: CommonHelper.roundUp(calculatedTHC / coa, 2),
      CBD: CommonHelper.roundUp(calculatedCBD / coa, 2),
      "Other Cannabinoids": CommonHelper.roundUp(calculatedOthers / coa, 2),
      Limonene: 0.01,
      "Beta-Pinene": 0.21,
      Linalool: 0.1,
      "Other Terpenes": 0.17,
    };
  }
  console.log(pieData);
  let dataResponse = {
    piechart_data: pieData,
    cannabinoids,
    terpenes,
    consumption_methods: consumptionMethodsOverview,
  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-activity-graph-data', request, dataResponse, userId, "");
  res.send(resultResponse);

  /*res.send({
    success: true,
    data: {
      piechart_data: pieData,
      cannabinoids,
      terpenes,
      consumption_methods: consumptionMethodsOverview,
    },
  });*/
});

//@desc get effect analytics
//route GET /api/get-effect-graph-data
//@access Private
exports.getEffectGraphData = asyncHandler(async (req, res, next) => {
  if (!req.query.effect_id) {
    return res.send({ success: false, message: "Please provide activity id" });
  }
  if (!req.query.month) {
    return res.send({ success: false, message: "Please provide month" });
  }
  const mongoose = require("mongoose");
  var effectId = mongoose.Types.ObjectId(req.query.effect_id);
  const userId = req.user._id;
  const year = new Date().getFullYear();
  const month = parseInt(req.query.month);

  /**Consumption Methods Graph Data */
  const aggregatedResult = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        actual_effects: {
          $elemMatch: { effect_id: effectId },
        },
        is_complete: 1,
      },
    },
    {
      $group: {
        _id: "$consumption_method",
        count: { $sum: 1 },
        //totalScale: { $sum: { $multiply: [ "$consumption_scale" ] } },
      },
    },
    {
      $lookup: {
        from: "consumptionmethods",
        localField: "_id",
        foreignField: "_id",
        as: "type",
      },
    },
    {
      $sort: { type: 1 },
    },
    {
      $unwind: "$type",
    },
    {
      $project: {
        count: 1,
        "type._id": 1,
        "type.name": 1,
      },
    },
  ]).exec();
  //console.log(aggregatedResult)
  let methods = [];
  let methodlist = await ConsumptionMethod.find({
    type: 2,
    is_deleted: 0,
    is_active: 1,
  }).select({ name: 1 });
  //console.log(methodlist)
  if (methodlist.length > 0) {
    for (var m = 0; m < methodlist.length; m++) {
      methods.push(methodlist[m].name);
    }
  }
  //console.log(methods)
  let consumptionMethodsOverview = [];
  let existingMethods = [];
  if (aggregatedResult.length > 0) {
    for (var i = 0; i < aggregatedResult.length; i++) {
      existingMethods.push(aggregatedResult[i].type.name);
      consumptionMethodsOverview.push({
        consumption_method_id: aggregatedResult[i].type._id,
        consumption_method: aggregatedResult[i].type.name,
        scale: aggregatedResult[i].count,
      });
    }
    //console.log(existingMethods)
    for (var i = 0; i < methods.length; i++) {
      if (existingMethods.includes(methods[i]) === false) {
        consumptionMethodsOverview.push({
          consumption_method_id: parseInt(i + 1),
          consumption_method: methods[i],
          scale: 0,
        });
      }
    }
  } else {
    for (m = 0; m < methods.length; m++) {
      consumptionMethodsOverview.push({
        consumption_method_id: parseInt(m + 1),
        consumption_method: methods[m],
        scale: 0,
      });
    }
  }
  //console.log(consumptionMethodsOverview)
  consumptionMethodsOverview.sort(
    (a, b) => parseFloat(a.id) - parseFloat(b.id)
  );
  /**Consumption Methods Graph Data END */
  /**Cannabinoids  */
  let cannabinoidAggData = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        actual_effects: {
          $elemMatch: { effect_id: effectId },
        },
        is_complete: 1,
      },
    },
    {
      $group: {
        _id: "$cannabinoid_profile.composition_id",
        count: { $sum: 1 },
        totalweight: { $sum: "$cannabinoid_profile.weight" },
        //"totalweight": { "$sum": { $multiply: [ "$cannabinoid_profile.weight" ] } },
        avgweight: { $avg: "$cannabinoid_profile.weight" },
      },
    },
    {
      $lookup: {
        from: "compositions",
        localField: "_id",
        foreignField: "_id",
        as: "composition",
      },
    },
    {
      $sort: { composition: 1 },
    },
    {
      $unwind: "$composition",
    },
    {
      $project: {
        count: 1,
        totalweight: 1,
        avgweight: 1,
        "composition._id": 1,
        "composition.name": 1,
      },
    },
  ]).exec();
  console.log(cannabinoidAggData);
  let cannabinoids = [];
  if (cannabinoidAggData.length > 0) {
    for (var c = 0; c < cannabinoidAggData.length; c++) {
      cannabinoids.push({
        cannabinoid: cannabinoidAggData[c].composition.name,
        //scale:cannabinoidAggData[c].avgweight
        scale: "0.19",
      });
    }
  }
  /**END */
  /**Terpenes  */
  let terpenesAggData = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        actual_effects: {
          $elemMatch: { effect_id: effectId },
        },
        is_complete: 1,
      },
    },
    {
      $group: {
        _id: "$terpenes.composition_id",
        count: { $sum: 1 },
        totalweight: { $sum: "$terpenes.weight" },
        //"totalweight": { "$sum": { $multiply: [ "$cannabinoid_profile.weight" ] } },
        avgweight: { $avg: "$terpenes.weight" },
      },
    },
    {
      $lookup: {
        from: "compositions",
        localField: "_id",
        foreignField: "_id",
        as: "composition",
      },
    },
    {
      $sort: { composition: 1 },
    },
    {
      $unwind: "$composition",
    },
    {
      $project: {
        count: 1,
        totalweight: 1,
        avgweight: 1,
        "composition._id": 1,
        "composition.name": 1,
      },
    },
  ]).exec();
  //console.log(terpenesAggData)
  let terpenes = [];
  if (terpenesAggData.length > 0) {
    for (var c = 0; c < terpenesAggData.length; c++) {
      terpenes.push({
        terpene: terpenesAggData[c].composition.name,
        //scale:cannabinoidAggData[c].avgweight
        scale: "0.17",
      });
    }
  }
  /**END */
  let findCond = {
    user: userId,
    year: year,
    month: month,
    actual_effects: {
      $elemMatch: { effect_id: effectId },
    },
    is_complete: 1,
  };
  let resultSet = await Diary.find(findCond)
    .populate({
      path: "coa_id",
      select: {
        total_cannabinoid_mg: 1,
        total_terpenes_mg: 1,
        total_THC_mg: 1,
        total_CBD_mg: 1,
      },
    })
    .select({ is_active: 1 });
  //console.log(resultSet)
  let pieData = {};
  if (resultSet.length > 0) {
    var coa = 0;
    var calculatedTHC = 0;
    var calculatedCBD = 0;
    var calculatedOthers = 0;
    for (var r = 0; r < resultSet.length; r++) {
      if (resultSet[r].coa_id) {
        coa++;
        var others =
          resultSet[r].coa_id.total_cannabinoid_mg -
          (resultSet[r].coa_id.total_THC_mg + resultSet[r].coa_id.total_CBD_mg);
        var total =
          resultSet[r].coa_id.total_cannabinoid_mg +
          resultSet[r].coa_id.total_terpenes_mg;
        if (total > 0) {
          calculatedTHC += (resultSet[r].coa_id.total_THC_mg / total) * 100;
          calculatedCBD += (resultSet[r].coa_id.total_CBD_mg / total) * 100;
          calculatedOthers += (others / total) * 100;
        }
      }
    }
    pieData = {
      THC: CommonHelper.roundUp(calculatedTHC / coa, 2),
      CBD: CommonHelper.roundUp(calculatedCBD / coa, 2),
      "Other Cannabinoids": CommonHelper.roundUp(calculatedOthers / coa, 2),
      Limonene: 0.01,
      "Beta-Pinene": 0.21,
      Linalool: 0.1,
      "Other Terpenes": 0.17,
    };
  }
  console.log(pieData);
  let dataResponse = {
    piechart_data: pieData,
    cannabinoids,
    terpenes,
    consumption_methods: consumptionMethodsOverview,
  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-effect-graph-data', request, dataResponse, userId, "");
  res.send(resultResponse);

  /*res.send({
    success: true,
    data: {
      piechart_data: pieData,
      cannabinoids,
      terpenes,
      consumption_methods: consumptionMethodsOverview,
    },
  });*/
});

//@desc get symptom analytics
//route GET /api/get-symptom-graph-data
//@access Private
exports.getSymptomsGraphData = asyncHandler(async (req, res, next) => {
  if (!req.query.symptom_id) {
    return res.send({ success: false, message: "Please provide activity id" });
  }
  if (!req.query.month) {
    return res.send({ success: false, message: "Please provide month" });
  }
  const mongoose = require("mongoose");
  var symptomId = mongoose.Types.ObjectId(req.query.symptom_id);
  const userId = req.user._id;
  const year = new Date().getFullYear();
  const month = parseInt(req.query.month);

  /**Consumption Methods Graph Data */
  const aggregatedResult = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        pre_symptoms: {
          $elemMatch: { symptom_id: symptomId },
        },
        is_complete: 1,
      },
    },
    {
      $group: {
        _id: "$consumption_method",
        count: { $sum: 1 },
        //totalScale: { $sum: { $multiply: [ "$consumption_scale" ] } },
      },
    },
    {
      $lookup: {
        from: "consumptionmethods",
        localField: "_id",
        foreignField: "_id",
        as: "type",
      },
    },
    {
      $sort: { type: 1 },
    },
    {
      $unwind: "$type",
    },
    {
      $project: {
        count: 1,
        "type._id": 1,
        "type.name": 1,
      },
    },
  ]).exec();
  //console.log(aggregatedResult)
  let methods = [];
  let methodlist = await ConsumptionMethod.find({
    type: 2,
    is_deleted: 0,
    is_active: 1,
  }).select({ name: 1 });
  //console.log(methodlist)
  if (methodlist.length > 0) {
    for (var m = 0; m < methodlist.length; m++) {
      methods.push(methodlist[m].name);
    }
  }
  //console.log(methods)
  let consumptionMethodsOverview = [];
  let existingMethods = [];
  if (aggregatedResult.length > 0) {
    for (var i = 0; i < aggregatedResult.length; i++) {
      existingMethods.push(aggregatedResult[i].type.name);
      consumptionMethodsOverview.push({
        consumption_method_id: aggregatedResult[i].type._id,
        consumption_method: aggregatedResult[i].type.name,
        scale: aggregatedResult[i].count,
      });
    }
    //console.log(existingMethods)
    for (var i = 0; i < methods.length; i++) {
      if (existingMethods.includes(methods[i]) === false) {
        consumptionMethodsOverview.push({
          consumption_method_id: parseInt(i + 1),
          consumption_method: methods[i],
          scale: 0,
        });
      }
    }
  } else {
    for (m = 0; m < methods.length; m++) {
      consumptionMethodsOverview.push({
        consumption_method_id: parseInt(m + 1),
        consumption_method: methods[m],
        scale: 0,
      });
    }
  }
  //console.log(consumptionMethodsOverview)
  consumptionMethodsOverview.sort(
    (a, b) => parseFloat(a.id) - parseFloat(b.id)
  );
  /**Consumption Methods Graph Data END */
  /**Cannabinoids  */
  let cannabinoidAggData = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        pre_symptoms: {
          $elemMatch: { symptom_id: symptomId },
        },
        is_complete: 1,
      },
    },
    {
      $group: {
        _id: "$cannabinoid_profile.composition_id",
        count: { $sum: 1 },
        totalweight: { $sum: "$cannabinoid_profile.weight" },
        //"totalweight": { "$sum": { $multiply: [ "$cannabinoid_profile.weight" ] } },
        avgweight: { $avg: "$cannabinoid_profile.weight" },
      },
    },
    {
      $lookup: {
        from: "compositions",
        localField: "_id",
        foreignField: "_id",
        as: "composition",
      },
    },
    {
      $sort: { composition: 1 },
    },
    {
      $unwind: "$composition",
    },
    {
      $project: {
        count: 1,
        totalweight: 1,
        avgweight: 1,
        "composition._id": 1,
        "composition.name": 1,
      },
    },
  ]).exec();
  console.log(cannabinoidAggData);
  let cannabinoids = [];
  if (cannabinoidAggData.length > 0) {
    for (var c = 0; c < cannabinoidAggData.length; c++) {
      cannabinoids.push({
        cannabinoid: cannabinoidAggData[c].composition.name,
        //scale:cannabinoidAggData[c].avgweight
        scale: "0.19",
      });
    }
  }
  /**END */
  /**Terpenes  */
  let terpenesAggData = await Diary.aggregate([
    {
      $match: {
        user: userId,
        year: year,
        month: month,
        pre_symptoms: {
          $elemMatch: { symptom_id: symptomId },
        },
        is_complete: 1,
      },
    },
    {
      $group: {
        _id: "$terpenes.composition_id",
        count: { $sum: 1 },
        totalweight: { $sum: "$terpenes.weight" },
        //"totalweight": { "$sum": { $multiply: [ "$cannabinoid_profile.weight" ] } },
        avgweight: { $avg: "$terpenes.weight" },
      },
    },
    {
      $lookup: {
        from: "compositions",
        localField: "_id",
        foreignField: "_id",
        as: "composition",
      },
    },
    {
      $sort: { composition: 1 },
    },
    {
      $unwind: "$composition",
    },
    {
      $project: {
        count: 1,
        totalweight: 1,
        avgweight: 1,
        "composition._id": 1,
        "composition.name": 1,
      },
    },
  ]).exec();
  //console.log(terpenesAggData)
  let terpenes = [];
  if (terpenesAggData.length > 0) {
    for (var c = 0; c < terpenesAggData.length; c++) {
      terpenes.push({
        terpene: terpenesAggData[c].composition.name,
        //scale:cannabinoidAggData[c].avgweight
        scale: "0.17",
      });
    }
  }
  /**END */
  let findCond = {
    user: userId,
    year: year,
    month: month,
    pre_symptoms: {
      $elemMatch: { symptom_id: symptomId },
    },
    is_complete: 1,
  };
  let resultSet = await Diary.find(findCond)
    .populate({
      path: "coa_id",
      select: {
        total_cannabinoid_mg: 1,
        total_terpenes_mg: 1,
        total_THC_mg: 1,
        total_CBD_mg: 1,
      },
    })
    .select({ is_active: 1 });
  //console.log(resultSet)
  let pieData = {};
  if (resultSet.length > 0) {
    var coa = 0;
    var calculatedTHC = 0;
    var calculatedCBD = 0;
    var calculatedOthers = 0;
    for (var r = 0; r < resultSet.length; r++) {
      if (resultSet[r].coa_id) {
        coa++;
        var others =
          resultSet[r].coa_id.total_cannabinoid_mg -
          (resultSet[r].coa_id.total_THC_mg + resultSet[r].coa_id.total_CBD_mg);
        var total =
          resultSet[r].coa_id.total_cannabinoid_mg +
          resultSet[r].coa_id.total_terpenes_mg;
        if (total > 0) {
          calculatedTHC += (resultSet[r].coa_id.total_THC_mg / total) * 100;
          calculatedCBD += (resultSet[r].coa_id.total_CBD_mg / total) * 100;
          calculatedOthers += (others / total) * 100;
        }
      }
    }
    pieData = {
      THC: CommonHelper.roundUp(calculatedTHC / coa, 2),
      CBD: CommonHelper.roundUp(calculatedCBD / coa, 2),
      "Other Cannabinoids": CommonHelper.roundUp(calculatedOthers / coa, 2),
      Limonene: 0.01,
      "Beta-Pinene": 0.21,
      Linalool: 0.1,
      "Other Terpenes": 0.17,
    };
  }
  console.log(pieData);
  let dataResponse = {
    piechart_data: pieData,
    cannabinoids,
    terpenes,
    consumption_methods: consumptionMethodsOverview,
  };
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  let resultResponse = await ResponseHandler.responseHandler('/api/get-symptom-graph-data', request, dataResponse, userId, "");
  res.send(resultResponse);

  res.send({
    success: true,
    data: {
      piechart_data: pieData,
      cannabinoids,
      terpenes,
      consumption_methods: consumptionMethodsOverview,
    },
  });
});

//@desc report about spam content
//route POST /api/report-spam
//@access Private
exports.reportSpam = asyncHandler(async (req, res, next) => {
  if (!req.body.video_id) {
    return res.send({ success: false, message: "Please provide video id" });
  }
  if (!req.body.comment_id) {
    return res.send({ success: false, message: "Please provide comment id" });
  }
  const commentId = req.body.comment_id;
  const videoId = req.body.video_id;
  const reportReasonId = req.body.reason_id;
  const userId = req.user._id;

  let report = new ReportSpam({
    video_id: videoId,
    comment_id: commentId,
    report_reason: reportReasonId,
    reported_by: userId,
  });
  await report.save();
  await Video.updateOne(
    { _id: videoId, "comments._id": commentId },
    {
      $inc: {
        "comments.$.reported_count": 1,
      },
    }
  );
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/report-spam', request, dataResponse, userId, "");
  //res.send(resultResponse);
  res.send({ success: true, message: "Reported successfully" });
});

//@desc report about video
//route POST /api/report-video
//@access Private
exports.reportVideo = asyncHandler(async (req, res, next) => {
  if (!req.body.video_id) {
    return res.send({ success: false, message: "Please provide video id" });
  }
  if (!req.body.comment) {
    req.body.comment = "";
  }
  const comment = req.body.comment;
  const videoId = req.body.video_id;
  const reportReasonId = req.body.reason_id;
  const userId = req.user._id;

  let report = new ReportVideo({
    video_id: videoId,
    comment: comment,
    report_reason: reportReasonId,
    reported_by: userId,
  });
  await report.save();
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/report-video', request, dataResponse, userId, "");
  res.send({ success: true, message: "Reported successfully" });
});

//@desc report public entries
//route POST /api/report-public-entries
//@access Private
exports.reportPublicEntries = asyncHandler(async (req, res, next) => {
  if (!req.body.entry_id) {
    return res.send({ success: false, message: "Please provide entry id" });
  }
  if (!req.body.comment) {
    req.body.comment = "";
  }
  const comment = req.body.comment;
  const entryId = req.body.entry_id;
  const reportReasonId = req.body.reason_id;
  const userId = req.user._id;

  let report = new ReportPublicEntries({
    entry_id: entryId,
    comment: comment,
    report_reason: reportReasonId,
    reported_by: userId,
  });
  await report.save();
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/report-public-entries', request, dataResponse, userId, "");
  res.send({ success: true, message: "Reported successfully" });
});

//@desc report questions
//route POST /api/report-questions
//@access Private
exports.reportQuestion = asyncHandler(async (req, res, next) => {
  if (!req.body.question_id) {
    return res.send({ success: false, message: "Please provide question id" });
  }
  if (!req.body.comment) {
    req.body.comment = "";
  }
  const comment = req.body.comment;
  const questionId = req.body.question_id;
  const reportReasonId = req.body.reason_id;
  const userId = req.user._id;

  let report = new ReportQuestion({
    question_id: questionId,
    comment: comment,
    report_reason: reportReasonId,
    reported_by: userId,
  });
  await report.save();
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/report-question', request, dataResponse, userId, "");
  res.send({ success: true, message: "Reported successfully" });
});

//@desc report reason for video and comment
//route POST /api/report-reason
//@access Private
exports.reportReason = asyncHandler(async (req, res, next) => {
  let reportreason = [];
  const getreportReason = await ReportReason.find({ is_deleted: 0 });
  if (getreportReason.length > 0) {
    for (var c = 0; c < getreportReason.length; c++) {
      reportreason.push({
        id: getreportReason[c]._id,
        name: getreportReason[c].name,
        description: getreportReason[c].description,
      });
    }
  }
  let dataResponse = reportreason;
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/report-reason', request, dataResponse, userId, "");
  res.send({ success: true, data: reportreason });
});

//@desc two factor authentication
//route POST /api/verify-2FA-code
//@access Private
exports.verify2FACode = asyncHandler(async (req, res, next) => {
  if (!req.body.twoFA_code) {
    return res.send({ success: false, message: "" });
  }
  const userId = req.user._id;
  var code = req.body.twoFA_code;
  let userInfo = await User.findOne({
    _id: userId,
    twoFA_verification_code: code,
  });
  if (!userInfo) {
    req.user.token = "";
    await req.user.save();
    return res.send({
      success: false,
      message: "Sorry! we could not found a match.",
    });
  }
  userInfo.twoFA_verification_code = "";
  await userInfo.save();
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  //let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/verify-2FA-code', request, dataResponse, userId, "");
  res.send({ success: true, message: "Verified successfully" });
});

//@desc logout
//route POST /api/logout
//@access Private
exports.logout = asyncHandler(async (req, res, next) => {
  req.user.token = "";
  req.user.device_type = 0;
  req.user.device_push_key = "";
  await req.user.save();
  let dataResponse = {};
  let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
  let userId = (req.user) ? req.user._id: null;
  await ResponseHandler.responseHandler('/api/logout', request, dataResponse, userId, "");
  res.send({ success: true, status: 1, message: "Logout successfully" });
});

//@desc getAds
//route GET get-ads
//@access Private
exports.getAds = asyncHandler(async (req, res, next) => {
  const { pageName } = req.params;
  try {
    const getAdvertisementData = await Advertisement.find({
      placement_page: pageName,
    }).select({ headline: 1, body: 1, link: 1, advertisement_image: 1 });
    let dataResponse = getAdvertisementData;
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    let userId = (req.user) ? req.user._id: null;
    await ResponseHandler.responseHandler('/api/get-ads', request, dataResponse, userId, "");
    res.send({
      success: true,
      message: "Success",
      data: getAdvertisementData,
    });
  } catch (err) {    
    let dataResponse = {err};
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    let userId = (req.user) ? req.user._id: null;
    await ResponseHandler.responseHandler('/api/get-ads', request, dataResponse, userId, "");
    res.send({
      success: false,
      message: err._message,
    });
  }
});

//@desc get
//route GET get-popular-categories
//@access Private
exports.getPopularCategories = asyncHandler(async (req, res, next) => {
  try {
    const categoriesData = [];
    const productData = [];
    const activities = await Activity.find({
      is_active: 1,
      is_deleted: 0,
    }).select("name");
    for (let activity of activities) {
      let findCond = {
        $and: [
          {
            pre_activities: { $exists: true, $ne: null },
          },
          {
            "pre_activities.activity_id": activity._id,
          },
        ],
      };
      const diariesData = await Diary.find(findCond).populate({
        path: "product",
        select: { name: 1 },
      });

      for (let product of diariesData) {
        const checkIfExists = productData.find(
          (p) => p._id.toString() == product.product._id.toString()
        );
        if (!checkIfExists) {
          productData.push(product.product);
        }
      }

      // const ids = arr.map(o => o.id)
      // const uniqueProductData = productData.filter(({id}, index) => !ids.includes(id, index + 1))
      // console.log({ uniqueProductData });

      if (diariesData && diariesData.length) {
        const objCategory = {
          activityId: activity._id,
          activityName: activity.name,
          productCount: productData.length,
          product: productData,
        };
        categoriesData.push(objCategory);
      }
    }

    categoriesData.sort((a, b) => (a.productCount > b.productCount ? -1 : 1));
    let dataResponse = categoriesData;
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    let userId = (req.user) ? req.user._id: null;
    await ResponseHandler.responseHandler('/api/get-popular-categories', request, dataResponse, userId, "");
    res.send({
      success: true,
      message: "Success",
      count: categoriesData.length,
      data: categoriesData,
    });
  } catch (err) {
    let dataResponse = err;
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    let userId = (req.user) ? req.user._id: null;
    await ResponseHandler.responseHandler('/api/get-popular-categories', request, dataResponse, userId, "");
    res.send({
      success: false,
      message: err._message,
    });
  }
});

//@desc get
//route GET get-activities-products
//@access Private
exports.getActivitiesProducts = asyncHandler(async (req, res, next) => {
  try {
    let productList = [];
    let findCond = {
      $or: [
        {
          pre_activities: { $exists: true, $ne: null },
          desired_activities: { $exists: true, $ne: null },
          actual_condition: { $exists: true, $ne: null },
          midpoint_effects: { $exists: true, $ne: null },
        },
      ],
    };
    const entries = await Diary.find(findCond).populate({
      path: "product",
      select: { name: 1 },
    });
    for (let product of entries) {
      productList.push(product.product);
    }
    let uniqueProductList = [...new Set(productList)];
    let dataResponse = uniqueProductList;
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    let userId = (req.user) ? req.user._id: null;
    await ResponseHandler.responseHandler('/api/get-diaries', request, dataResponse, userId, "");
    res.send({
      status: true,
      message: "Products list",
      count: uniqueProductList.length,
      prodcucts: uniqueProductList,
    });
  } catch (err) {
    let dataResponse = err;
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    let userId = (req.user) ? req.user._id: null;
    await ResponseHandler.responseHandler('/api/get-diaries', request, dataResponse, userId, "");
    res.send({
      success: false,
      message: err._message,
    });
  }
});

//@desc get
//route GET /api/api-call-logs
//@access Private
exports.getApiCallLogs = asyncHandler(async (req, res, next) => {
  try {
    let userId = (req.user) ? req.user._id: null;
    let findCond = {
      $or: [
        {
          api_path: req.query.api_path,
          user_call: userId
        },
      ],
    };
    const apiLogs = await ApiCallsLogs.find(findCond);
    
    let dataResponse = apiLogs;
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    await ResponseHandler.responseHandler('api-call-logs', request, dataResponse, userId, "");
    res.send({
      status: true,
      message: "API Logs for "+ req.query.api_path,
      count: dataResponse.length,
      data: dataResponse,
    });
  } catch (err) {
    let dataResponse = err;
    let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
    let userId = (req.user) ? req.user._id: null;
    await ResponseHandler.responseHandler('api-call-logs', request, dataResponse, userId, "");
    res.send({
      success: false,
      message: err._message,
    });
  }
});

//@desc get
//route GET get-product-by-selected-categories
//@access Private
exports.getProductBySelectedCategories = asyncHandler(
  async (req, res, next) => {
    try {
      const { entryIdsArray } = req.body;
      let productList = [];
      const diariesData = await Diary.find({
        _id: { $in: entryIdsArray },
      }).populate({
        path: "product",
        select: { name: 1 },
      });

      for (let product of diariesData) {
        productList.push(product.product);
      }
      let dataResponse = productList;
      let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
      let userId = (req.user) ? req.user._id: null;
      await ResponseHandler.responseHandler('/api/get-product-by-selected-categories', request, dataResponse, userId, "");
      res.send({
        success: true,
        response: "Success",
        message: "Products list",
        count: productList.length,
        data: productList,
      });
    } catch (err) {
      let dataResponse = err;
      let request = (Object.keys(req.body).length > 0 ) ? req.body : req.query ;
      let userId = (req.user) ? req.user._id: null;
      await ResponseHandler.responseHandler('/api/get-product-by-selected-categories', request, dataResponse, userId, "");
      res.send({
        success: false,
        message: err._message,
      });
    }
  }
);
