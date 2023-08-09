const moodModel = require("../models/moodModel");
const effectModel = require("../models/effectModel");
const activityModel = require("../models/activityModel");
const symptomModel = require("../models/symptomModel");
const physiqueModel = require("../models/physiqueModel");
const cannabinoidModel = require("../models/cannabinoidModel");
const strainModel = require("../models/strainsModel");
const videoModel = require("../models/videoModel");
const articleCategoryModel = require("../models/articleCategoryModel");
const medicineCompositionModel = require("../models/medicineCompositionParametersModel");
const consumptionNegativesModel = require("../models/consumptionNegativesModel");
const userDiaryModel = require("../models/userDiaryModel");
const userModel = require("../models/usersModel");
const ConsumptionMethods = require("../models/cannabisConsumptionMethodsModel")
const faqCategoryModel = require("../models/faqCategoryModel")
const coaModel = require("../models/coaModel")
const Country = require("../models/countryModel")
const State = require("../models/stateModel")
const layout = require('../../config/layout');
const commonController = require('./commonController');
const { getVideoDurationInSeconds } = require('get-video-duration');
var fs = require('fs');
var path = require('path');
const CommonHelper = require('../utils/commonHelper');
const asyncHandler = require("../middleware/async");
const FaqCategory = require("../models/faqCategoryModel");
const communityQuestionCategoryModel = require("../models/communityQuestionsCategoryModel");
const communityQuestionsModel = require("../models/communityQuestionsModel");
const Faq = require("../models/faqModel");
const Condition = require("../models/conditionModel");
const User = require("../models/usersModel");
const ConsumptionFrequency = require("../models/consumptionFrequencyModel");
const ConsumptionReason = require("../models/consumptionReasonModel");
const ReportedComment = require("../models/reportedCommentsModel");
const SettingsMyEntourage = require("../models/settingsMyEntourageModel");
const { s3Upload, s3Remove, s3CopyObject } = require("../utils/AWS")
var uploadPath = path.resolve(__dirname, '../../public/uploads');

let imageResize = async (width, height, imagePath, outputImagePath) => {
  const sharp = require('sharp')
  await sharp(imagePath)
    //.extract({ left: 0, top: 0, width: width, height: height })
    .resize(width, height)
    .toFile(outputImagePath)
}

//Mood Model
exports.getMood = async (req, res, next) => {
  let data = commonController.getCommonParams('Mood List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      var searchName = new RegExp(["^", filterDatas.name, "$"].join(""), "i");
      findCond.name = searchName;
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  try {
    const mood = await moodModel.find(findCond).sort({ created_at: -1 });
    data.mood = mood;
    res.render('admin/moodlist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    req.flash('error_msg', e.message);
    res.redirect('/admin/mood');
  }
};

exports.addMood = async (req, res, next) => {
  try {
    var { name, is_active } = req.body;
    const mood = await moodModel.find({ is_deleted: 0, name: name });
    if (mood.length > 0) {
      req.flash('error_msg', 'Sorry! this Mood name already exists, Please try with some other name.');
    }
    else {
      let newMood = new moodModel({ name });
      newMood.is_active = (is_active === '1') ? is_active : 0
      await newMood.save();
      req.flash('success_msg', 'Mood has been added successfully');
    }
  }
  catch (e) {
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/mood');
};

exports.getUpdateMood = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Mood', req);
  try {
    const mood = await moodModel.find({ is_deleted: 0 }).sort('display_order');
    var id = req.query.id;
    const updatingMood = await moodModel.findById(id);
    data.mood = mood;
    data.updatingMood = updatingMood;
    res.render('admin/moodedit', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    req.flash('error_msg', e.message);
    res.redirect('/admin/mood');
  }
};

exports.updateMood = async (req, res, next) => {
  try {
    var id = req.query.id;
    var { name, is_active } = req.body;
    var updated_at = new Date();
    var moodInfo = await moodModel.findById(id);
    const mood = await moodModel.find({ is_deleted: 0, name: name });
    if (mood.length > 0 && moodInfo.name !== name) {
      req.flash('error_msg', 'Sorry! this Mood name already exists, Please try with some other name.');
    }
    else {
      is_active = is_active ? 1 : 0;
      await moodModel.findByIdAndUpdate(
        { _id: id },
        {
          name,
          is_active,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Mood has been updated successfully');
          }
        }
      );
    }
  }
  catch (e) {
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/mood');
};

exports.deleteMood = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    const userMood = await userDiaryModel.find({ mood_before_consumption: id });
    if (userMood.length > 0) {
      req.flash('error_msg', 'Sorry! this mood is in use');
    }
    else {
      await moodModel.findByIdAndUpdate(
        { _id: id },
        {
          is_deleted: 1,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Mood has been deleted successfully');
          }
        }
      );
    }
  }
  catch (e) {
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/mood');
};

exports.moodOrdering = async (req, res, next) => {
  try {
    const ids = req.body.id;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const mood = await moodModel.findById(id);
      mood.display_order = i;
      await mood.save();
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
  }
  res.send('list sorted');
};

//Effect Model
exports.getEffect = async (req, res, next) => {
  let data = commonController.getCommonParams('Effect List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      var searchName = new RegExp(["^", filterDatas.name, "$"].join(""), "i");
      findCond.name = searchName;
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  try {
    const effect = await effectModel.find(findCond).populate({
      path: 'parent_id',
      select: { "name": 1 }
    }).sort({ sort_order: 1 });
    let list = []
    if (effect.length > 0) {
      var imagePath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/effect/';
      for (var e = 0; e < effect.length; e++) {
        list.push({
          _id: effect[e]._id,
          effect_name: effect[e].name,
          parent_name: (effect[e].parent_id) ? effect[e].parent_id.name : '',
          image: (effect[e].image) ? imagePath + effect[e].image : '',
          icon: (effect[e].icon) ? imagePath + effect[e].icon : '',
          status: (effect[e].is_active == 1) ? 'Active' : 'Inactive',
          sort_order: effect[e].sort_order,
          is_active: effect[e].is_active
        })
      }

    }
    data.records = list;
    res.render('admin/effectlist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    req.flash('error_msg', e.message);
    res.redirect('/admin/effect');
  }
};

exports.addEffect = async (req, res, next) => {
  let data = commonController.getCommonParams('Add New Effect', req);
  data.details = {
    _id: '',
    name: '',
    parent_id,
    effect_image: '',
    effect_icon: '',
    sort_order: ''
  }
  let parentEffects = await effectModel.find({ is_deleted: 0, is_active: 1, type: 1 })
  data.parent_effects = parentEffects
  res.render('admin/effect_form', { layout: layout.admin.session_with, data });
};

exports.getUpdateEffect = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Effect', req);
  let parentEffects = await effectModel.find({ is_deleted: 0, is_active: 1, type: 1 })
  data.parent_effects = parentEffects
  var recordId = req.params.id
  let recordDetails = await effectModel.findOne({ _id: recordId, is_deleted: 0 })
  if (!recordDetails) {
    req.flash('error_msg', 'Effect does not exist');
    res.redirect('/admin/effect')
  }
  let details = recordDetails.toObject()
  var imagePath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/effect/';
  details.image = (recordDetails.image) ? imagePath + recordDetails.image : ''
  details.icon = (recordDetails.icon) ? imagePath + recordDetails.icon : ''
  data.details = details
  res.render('admin/effect_form', { layout: layout.admin.session_with, data });
};


exports.manageEffect = async (req, res, next) => {
  //console.log(req.body)
  try {
    var id = req.body.id
    let checkCond = { is_deleted: 0, name: req.body.name }
    if (id) {
      checkCond._id = { $ne: id }
    }
    const check = await effectModel.findOne(checkCond);
    if (check) {
      req.flash('error_msg', 'Sorry! this effect name already exists, Please try with some other name.');
      if (typeof (req.files.effect_image) !== 'undefined') {
        var image = req.files.effect_image[0].filename
        CommonHelper.unlinkFile(uploadPath + '/effect/' + image);
      }
      if (typeof (req.files.effect_icon) !== 'undefined') {
        var icon = req.files.effect_icon[0].filename
        CommonHelper.unlinkFile(uploadPath + '/effect/' + icon);
      }
      return res.redirect('/admin/effect')
    }
    if (id) {
      let info = await effectModel.findById(id);

      if (typeof (req.files.effect_image) !== 'undefined') {
        var oldImage = info.image
        if (oldImage) {
          const removeImage = {
            imgName: oldImage,
            type: 'effect_image'
          }
          await s3Remove(removeImage);
        }
        //Crop Image
        const imagePath = uploadPath + '/effect/' + req.files.effect_image[0].filename;
        const effectImage = {
          file: req.files.effect_image[0],
          type: 'effect_image',
          imagePath: imagePath,
          width: 750,
          height: 500
        }
        const response = await s3Upload(effectImage);
        if (response) {
          info.image = req.files.effect_image[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      if (typeof (req.files.effect_icon) !== 'undefined') {
        var oldIcon = info.icon
        if (oldIcon) {
          const removeIcon = {
            imgName: oldIcon,
            type: 'effect_icon'
          }
          await s3Remove(removeIcon);
        }
      const imagePath = uploadPath + '/effect/' + req.files.effect_icon[0].filename;
      const effectIcon = {
        file: req.files.effect_icon[0],
        type: 'effect_icon',
        imagePath: imagePath,
        width: 60,
        height: 40
      }
      const response = await s3Upload(effectIcon);
      if (response) {
        info.icon = req.files.effect_icon[0].filename;
      }
      CommonHelper.unlinkFile(imagePath)

      }
      info.name = req.body.name
      if (req.body.parent_id) {
        info.parent_id = req.body.parent_id
      }
      info.is_active = (req.body.is_active) ? 1 : 0;
      info.updated_by = req.user._id
      info.sort_order = (req.body.sort_order) ? req.body.sort_order : 1
      await info.save();
      req.flash('success_msg', 'Effect has been updated successfully');

    } else {
      let effect = new effectModel({
        name: req.body.name,
        is_active: (req.body.is_active) ? 1 : 0,
        type: (req.body.parent_id) ? 2 : 1,
        updated_by: req.user._id,
        sort_order: (req.body.sort_order) ? req.body.sort_order : 1
      })
      if (req.body.parent_id) {
        effect.parent_id = req.body.parent_id
      }
      if (typeof (req.files.effect_image) !== 'undefined') {
        const imagePath = uploadPath + '/effect/' + req.files.effect_image[0].filename;
        const effectImage = {
          file: req.files.effect_image[0],
          type: 'effect_image',
          imagePath: imagePath,
          width: 750,
          height: 500
        }
        const response = await s3Upload(effectImage);
        if (response) {
          effect.image = req.files.effect_image[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      if (typeof (req.files.effect_icon) !== 'undefined') {

        const imagePath = uploadPath + '/effect/' + req.files.effect_icon[0].filename;
        const effectIcon = {
          file: req.files.effect_icon[0],
          type: 'effect_icon',
          imagePath: imagePath,
          width: 60,
          height: 40
        }
        const response = await s3Upload(effectIcon);
        if (response) {
          effect.icon = req.files.effect_icon[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      await effect.save()
      req.flash('success_msg', 'Effect has been created successfully');
    }
  } catch (e) {
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/effect');
}

exports.deleteEffect = async (req, res, next) => {
  try {
    var id = req.query.id;
    let updatingEffect = await effectModel.findById(id);
    var userEffect = await userModel.find({ effects: { $elemMatch: { effect_id: id } } });
    var userDiaryEffect = await userDiaryModel.find({ pre_effects: { $elemMatch: { effect_id: id } } })
    // console.log(userEffect.length);
    if ((userEffect.length > 0) || (userDiaryEffect.length > 0)) {
      req.flash('error_msg', 'Sorry! this effect is in use');
    }
    else {
      var oldImage = updatingEffect.image;
      var oldIcon = updatingEffect.icon;
      if (oldImage.length > 0) {
        CommonHelper.unlinkFile(uploadPath + '/effect/' + oldImage);
      }
      if (oldIcon.length > 0) {
        CommonHelper.unlinkFile(uploadPath + '/effect/' + oldIcon);
      }
      updatingEffect.image = ''
      updatingEffect.icon = ''
      updatingEffect.is_deleted = 1
      updatingEffect.updated_at = new Date();
      await updatingEffect.save()
      req.flash('success_msg', 'Effect has been deleted successfully');
    }
    res.redirect('/admin/effect');
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/effect');
  }
};

exports.manageEffectOrdering = async (req, res, next) => {
  try {
    const ids = req.body.id;
    //console.log(ids)
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let effectInfo = await effectModel.findById(id);
      //console.log(i)
      effectInfo.sort_order = i + 1;
      effectInfo.updated_by = req.user._id
      await effectInfo.save();
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
  }
  res.send('list sorted');
}

//Activity Model
exports.getActivity = async (req, res, next) => {
  let data = commonController.getCommonParams('Activity List', req);
  let findCond = { is_deleted: 0, type: 2 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      findCond.name = { '$regex': filterDatas.name, '$options': 'i' }
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  try {
    let activity = await activityModel.find(findCond).populate({
      path: 'parent_id',
      select: { "name": 1 }
    }).sort({ sort_order: 1 });
    //console.log(activity)
    let list = []
    if (activity.length > 0) {
      var imagePath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/activity/';
      // var imagePath = req.protocol+'://'+req.get('host')+'/uploads/activity/';
      for (var a = 0; a < activity.length; a++) {
        list.push({
          _id: activity[a]._id,
          activity_name: activity[a].name,
          sort_order: activity[a].sort_order,
          image: (activity[a].image) ? imagePath + activity[a].image : '',
          icon: (activity[a].icon) ? imagePath + activity[a].icon : '',
          parent_name: (activity[a].parent_id) ? activity[a].parent_id.name : '',
          is_active: activity[a].is_active
        })
      }
    }
    //console.log(list)
    data.records = list;
    res.render('admin/activitylist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/activity');
  }
};

exports.addActivity = async (req, res, next) => {
  try {
    var name = req.body.name;
    const activity = await activityModel.find({ is_deleted: 0, name: name });
    if (activity.length > 0) {
      req.flash('error_msg', 'Sorry! this Activity name already exists, Please try with some other name.');
      if (typeof (req.files.activity_image) !== 'undefined') {
        var image = req.files.activity_image[0].filename
        CommonHelper.unlinkFile(uploadPath + '/activity/' + image);
      }
      if (typeof (req.files.activity_icon) !== 'undefined') {
        var icon = req.files.activity_icon[0].filename
        CommonHelper.unlinkFile(uploadPath + '/activity/' + icon);
      }
      return res.redirect('/admin/activity');
    }

    let newActivity = new activityModel({
      name: req.body.name,
      updated_by: req.user._id
    });
    if (req.body.parent_id) {
      newActivity.parent_id = req.body.parent_id
      newActivity.type = 2
    }
    newActivity.is_active = (req.body.is_active === '1') ? req.body.is_active : 0

    if (typeof (req.files.activity_image) !== 'undefined') {
      const imagePath = uploadPath + '/activity/' + req.files.activity_image[0].filename;
      const activityImage = {
        file: req.files.activity_image[0],
        type: 'activity_image',
        imagePath: imagePath,
        width: 750,
        height: 500
      }
      const response = await s3Upload(activityImage);
      if (response) {
        newActivity.image = req.files.activity_image[0].filename;
      }
      CommonHelper.unlinkFile(imagePath)
    }
    if (typeof (req.files.activity_icon) !== 'undefined') {
      const imagePath = uploadPath + '/activity/' + req.files.activity_icon[0].filename;
      const activityIcon = {
        file: req.files.activity_icon[0],
        type: 'activity_icon',
        imagePath: imagePath,
        width: 60,
        height: 40
      }
      const response = await s3Upload(activityIcon);
      if (response) {
        newActivity.icon = req.files.activity_icon[0].filename;
      }
      CommonHelper.unlinkFile(imagePath)
    }
    await newActivity.save();
    req.flash('success_msg', 'Activity has been added successfully');

  } catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/activity');
};

exports.getUpdateActivity = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Activity', req);
  try {
    const activity = await activityModel.find({ is_deleted: 0 });
    var id = req.query.id;
    const updatingActivity = await activityModel.findById(id);
    data.activity = activity;
    data.updatingActivity = updatingActivity;
    res.render('admin/activityedit', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/activity');
  }
};

exports.updateActivity = async (req, res, next) => {
  try {
    var id = req.query.id;
    var { name, is_active } = req.body;
    let activityInfo = await activityModel.findById(id);
    const activity = await activityModel.find({ is_deleted: 0, name: name });
    if (activity.length > 0 && activityInfo.name != name) {
      req.flash('error_msg', 'Sorry! this Activity name already exists, Please try with some other name.');
      if (typeof (req.files.activity_image) !== 'undefined') {
        var image = req.files.activity_image[0].filename
        CommonHelper.unlinkFile(uploadPath + '/activity/' + image);
      }
      if (typeof (req.files.activity_icon) !== 'undefined') {
        var icon = req.files.activity_icon[0].filename
        CommonHelper.unlinkFile(uploadPath + '/activity/' + icon);
      }
      return res.redirect('/admin/activity');
    }

    activityInfo.updated_at = new Date();
    activityInfo.name = name
    activityInfo.updated_by = req.user._id
    activityInfo.is_active = is_active ? 1 : 0;
    if (req.body.parent_id) {
      activityInfo.parent_id = req.body.parent_id
    }
    var oldImage = activityInfo.image;
    var oldIcon = activityInfo.icon;
    if (typeof (req.files.activity_image) !== 'undefined') {
      if (oldImage) {
        const removeImage = {
          imgName: oldImage,
          type: 'activity_image'
        }
        await s3Remove(removeImage);
      }

      const imagePath = uploadPath + '/activity/' + req.files.activity_image[0].filename;
      const activityImage = {
        file: req.files.activity_image[0],
        type: 'activity_image',
        imagePath: imagePath,
        width: 750,
        height: 500
      }
      const response = await s3Upload(activityImage);
      if (response) {
        activityInfo.image = req.files.activity_image[0].filename;
      }
      CommonHelper.unlinkFile(imagePath)
    }
    if (typeof (req.files.activity_icon) !== 'undefined') {
      if (oldIcon) {
        const removeIcon = {
          imgName: oldIcon,
          type: 'activity_icon'
        }
        await s3Remove(removeIcon);
      }
      const imagePath = uploadPath + '/activity/' + req.files.activity_icon[0].filename;
      const activityIcon = {
        file: req.files.activity_icon[0],
        type: 'activity_icon',
        imagePath: imagePath,
        width: 60,
        height: 40
      }
      const response = await s3Upload(activityIcon);
      if (response) {
        activityInfo.icon = req.files.activity_icon[0].filename;
      }
      CommonHelper.unlinkFile(imagePath)
    }
    await activityInfo.save();
    req.flash('success_msg', 'Activity has been updated successfully');

  }
  catch (e) {
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/activity');
};

exports.manageActivity = async (req, res, next) => {

}

exports.deleteActivity = async (req, res, next) => {
  try {
    var id = req.query.id;
    let updatingActivity = await activityModel.findById(id);
    var userActivity = await userModel.find({ activities: { $elemMatch: { activity_id: id } } });
    var userDiaryActivity = await userDiaryModel.find({ pre_activities: { $elemMatch: { activity_id: id } } });
    if ((userActivity.length > 0) || (userDiaryActivity.length > 0)) {
      req.flash('error_msg', 'Sorry! this activity is in use');
    }
    else {
      var oldImage = updatingActivity.image;
      var oldIcon = updatingActivity.icon;
      if (oldImage.length > 0) {
        const removeImage = {
          imgName: oldImage,
          type: 'activity_image'
        }
        await s3Remove(removeImage);
        // CommonHelper.unlinkFile(uploadPath + '/activity/' + oldImage);
      }
      if (oldIcon.length > 0) {
        const removeIcon = {
          imgName: oldIcon,
          type: 'activity_icon'
        }
        await s3Remove(removeIcon);
        // CommonHelper.unlinkFile(uploadPath + '/activity/' + oldIcon);
      }
      updatingActivity.image = ''
      updatingActivity.icon = ''
      updatingActivity.updated_at = new Date();
      updatingActivity.is_deleted = 1
      await updatingActivity.save()
      req.flash('success_msg', 'Activity has been deleted successfully');
    }
    res.redirect('/admin/activity');
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/activity');
  }
};

exports.manageActivityOrdering = async (req, res, next) => {
  try {
    const ids = req.body.id;
    //console.log(ids)
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let activityInfo = await activityModel.findById(id);
      //console.log(i)
      activityInfo.sort_order = i + 1;
      activityInfo.updated_by = req.user._id
      await activityInfo.save();
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
  }
  res.send({ status: 1, message: 'list sorted' });
};

//Symptom Model
exports.getSymptom = async (req, res, next) => {
  let data = commonController.getCommonParams('Symptom List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      var searchName = new RegExp(["^", filterDatas.name, "$"].join(""), "i");
      findCond.name = searchName;
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  try {
    let symptomList = await symptomModel.find(findCond).populate({
      path: 'parent_id',
      select: { "name": 1 }
    }).sort({ sort_order: 1 });
    let list = []
    if (symptomList.length > 0) {
      // var imagePath = req.protocol + '://' + req.get('host') + '/uploads/symptom/';
      var imagePath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/symptom/';
      for (var s = 0; s < symptomList.length; s++) {
        list.push({
          _id: symptomList[s]._id,
          symptom_name: symptomList[s].name,
          sort_order: symptomList[s].sort_order,
          image: (symptomList[s].image) ? imagePath + symptomList[s].image : '',
          icon: (symptomList[s].icon) ? imagePath + symptomList[s].icon : '',
          parent_name: (symptomList[s].parent_id) ? symptomList[s].parent_id.name : '',
          is_active: symptomList[s].is_active
        })
      }
    }
    data.records = list;
    res.render('admin/symptomlist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/symptom');
  }
};

exports.addSymptom = async (req, res, next) => {
  let data = commonController.getCommonParams('Add New Symptom', req);
  data.details = {
    _id: '',
    name: '',
    parent_id: '',
    symptom_image: '',
    symptom_icon: '',
    sort_order: ''
  }
  let parentSymptom = await symptomModel.find({ is_deleted: 0, is_active: 1, type: 1 })
  data.parent_symptoms = parentSymptom
  res.render('admin/symptom_form', { layout: layout.admin.session_with, data });
};

exports.getUpdateSymptom = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Symptom', req);
  let parentSymptom = await symptomModel.find({ is_deleted: 0, is_active: 1, type: 1 })
  data.parent_symptoms = parentSymptom
  var recordId = req.params.id
  let recordDetails = await symptomModel.findOne({ _id: recordId, is_deleted: 0 })
  if (!recordDetails) {
    req.flash('error_msg', 'Symptom does not exist');
    res.redirect('/admin/symptom')
  }
  let details = recordDetails.toObject()
  // var imagePath = req.protocol + '://' + req.get('host') + '/uploads/symptom/';
  var imagePath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/symptom/';
  details.image = (recordDetails.image) ? imagePath + recordDetails.image : ''
  details.icon = (recordDetails.icon) ? imagePath + recordDetails.icon : ''
  data.details = details
  res.render('admin/symptom_form', { layout: layout.admin.session_with, data });
};

exports.manageSymptom = async (req, res, next) => {
  //console.log(req.body)
  try {
    var id = req.body.id
    let checkCond = { is_deleted: 0, name: req.body.name }
    if (id) {
      checkCond._id = { $ne: id }
    }
    const check = await symptomModel.findOne(checkCond);
    if (check) {
      req.flash('error_msg', 'Sorry! this Symptom name already exists, Please try with some other name.');
      if (typeof (req.files.symptom_image) !== 'undefined') {
        var image = req.files.symptom_image[0].filename
        CommonHelper.unlinkFile(uploadPath + '/symptom/' + image);
      }
      if (typeof (req.files.symptom_icon) !== 'undefined') {
        var icon = req.files.symptom_icon[0].filename
        CommonHelper.unlinkFile(uploadPath + '/symptom/' + icon);
      }
      return res.redirect('/admin/symptom')
    }
    if (id) {
      let symptomInfo = await symptomModel.findById(id);
      if (typeof (req.files.symptom_image) !== 'undefined') {
        var oldImage = symptomInfo.image
        if (oldImage) {
          const removeImage = {
            imgName: oldImage,
            type: 'symptom_image'
          }
          await s3Remove(removeImage);
        }
        const imagePath = uploadPath + '/symptom/' + req.files.symptom_image[0].filename;
        const symptomImage = {
          file: req.files.symptom_image[0],
          type: 'symptom_image',
          imagePath: imagePath,
          width: 750,
          height: 500
        }
        const response = await s3Upload(symptomImage);
        if (response) {
          symptomInfo.image = req.files.symptom_image[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      if (typeof (req.files.symptom_icon) !== 'undefined') {
        var oldIcon = symptomInfo.icon
        if (oldIcon) {
          const removeIcon = {
            imgName: oldIcon,
            type: 'symptom_icon'
          }
          await s3Remove(removeIcon);
        }
        const imagePath = uploadPath + '/symptom/' + req.files.symptom_icon[0].filename;
        const symptomIcon = {
          file: req.files.symptom_icon[0],
          type: 'symptom_icon',
          imagePath: imagePath,
          width: 60,
          height: 40
        }
        const response = await s3Upload(symptomIcon);
        if (response) {
          symptomInfo.icon = req.files.symptom_icon[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      symptomInfo.name = req.body.name
      if (req.body.parent_id) {
        symptomInfo.parent_id = req.body.parent_id
      }
      symptomInfo.is_active = (req.body.is_active) ? 1 : 0;
      symptomInfo.updated_by = req.user._id
      symptomInfo.sort_order = (req.body.sort_order) ? req.body.sort_order : 1
      await symptomInfo.save();
      req.flash('success_msg', 'Symptom has been updated successfully');

    } else {
      let symptom = new symptomModel({
        name: req.body.name,
        is_active: (req.body.is_active) ? 1 : 0,
        type: (req.body.parent_id) ? 2 : 1,
        updated_by: req.user._id,
        sort_order: (req.body.sort_order) ? req.body.sort_order : 1
      })
      if (req.body.parent_id) {
        symptom.parent_id = req.body.parent_id
      }
      if (typeof (req.files.symptom_image) !== 'undefined') {
        const imagePath = uploadPath + '/symptom/' + req.files.symptom_image[0].filename;
        const symptomImage = {
          file: req.files.symptom_image[0],
          type: 'symptom_image',
          imagePath: imagePath,
          width: 750,
          height: 500
        }
        const response = await s3Upload(symptomImage);
        if (response) {
          symptom.image = req.files.symptom_image[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      if (typeof (req.files.symptom_icon) !== 'undefined') {
        const imagePath = uploadPath + '/symptom/' + req.files.symptom_icon[0].filename;
        const symptomIcon = {
          file: req.files.symptom_icon[0],
          type: 'symptom_icon',
          imagePath: imagePath,
          width: 60,
          height: 40
        }
        const response = await s3Upload(symptomIcon);
        if (response) {
          symptom.icon = req.files.symptom_icon[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      await symptom.save()
      req.flash('success_msg', 'Symptom has been created successfully');
    }
  } catch (e) {
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/symptom');
}

exports.deleteSymptom = async (req, res, next) => {
  try {
    var id = req.params.id;
    let updatingSymptom = await symptomModel.findById(id);
    var userSymptom = await userModel.find({ symptoms: { $elemMatch: { symptom_id: id } } });
    var userDiarySymptom = await userDiaryModel.find({ pre_symptoms: { $elemMatch: { symptom_id: id } } })
    if ((userSymptom.length > 0) || (userDiarySymptom.length > 0)) {
      req.flash('error_msg', 'Sorry! this symptom is in use');
    }
    else {
      if (updatingSymptom.image.length > 0) {
        const removeImage = {
          imgName: updatingSymptom.image,
          type: 'symptom_image'
        }
        await s3Remove(removeImage);
        // CommonHelper.unlinkFile(uploadPath + '/symptom/' + updatingSymptom.image);
      }
      if (updatingSymptom.icon.length > 0) {
        const removeIcon = {
          imgName: updatingSymptom.icon,
          type: 'symptom_icon'
        }
        await s3Remove(removeIcon);
        // CommonHelper.unlinkFile(uploadPath + '/symptom/' + updatingSymptom.icon);
      }
      updatingSymptom.updated_at = new Date();
      updatingSymptom.image = ''
      updatingSymptom.icon = ''
      updatingSymptom.is_deleted = 1
      await updatingSymptom.save()
      req.flash('success_msg', 'Symptom has been deleted successfully');
    }
    res.redirect('/admin/symptom');
  }
  catch (e) {
    req.flash('error_msg', e.message);
    res.redirect('/admin/symptom');
  }
};

exports.manageSymptomOrdering = async (req, res, next) => {
  try {
    const ids = req.body.id;
    //console.log(ids)
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let symptomInfo = await symptomModel.findById(id);
      //console.log(i)
      symptomInfo.sort_order = i + 1;
      symptomInfo.updated_by = req.user._id
      await symptomInfo.save();
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
  }
  res.send('list sorted');
}

//Physique Model
exports.getPhysique = async (req, res, next) => {
  let data = commonController.getCommonParams('Physique List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      var searchName = new RegExp(["^", filterDatas.name, "$"].join(""), "i");
      findCond.name = searchName;
    }
  }
  try {
    const physique = await physiqueModel.find(findCond).sort({ created_at: -1 });
    data.physique = physique;
    res.render('admin/physiquelist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/physique');
  }
};

exports.addPhysique = async (req, res, next) => {
  try {
    var { name, is_active } = req.body;
    const physique = await physiqueModel.find({ is_deleted: 0, name: name });
    if (physique.length > 0) {
      req.flash('error_msg', 'Sorry! this Physique name already exists, Please try with some other name.');
    }
    else {
      const newPhysique = new physiqueModel({ name });
      newPhysique.is_active = (is_active === '1') ? is_active : 0
      await newPhysique.save();
      req.flash('success_msg', 'Physique has been added successfully');
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/physique');
};

exports.getUpdatePhysique = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Physique', req);
  try {
    const physique = await physiqueModel.find({ is_deleted: 0 });
    var id = req.query.id;
    const updatingPhysique = await physiqueModel.findById(id);
    data.physique = physique;
    data.updatingPhysique = updatingPhysique;
    res.render('admin/physiqueedit', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/physique');
  }
};

exports.updatePhysique = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    var { name, is_active } = req.body;
    var physiqueInfo = await physiqueModel.findById(id);
    const physique = await physiqueModel.find({ is_deleted: 0, name: name });
    if (physique.length > 0 && physiqueInfo.name !== name) {
      req.flash('error_msg', 'Sorry! this Physique name already exists, Please try with some other name.');
    }
    else {
      is_active = is_active ? 1 : 0;
      await physiqueModel.findByIdAndUpdate(
        { _id: id },
        {
          name,
          is_active,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Physique has been updated successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/physique');
};

exports.deletePhysique = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    const userPhysique = await userModel.find({ physique: id })
    if (userPhysique.length > 0) {
      req.flash('error_msg', 'Sorry! this physique is in use');
    }
    else {
      await physiqueModel.findByIdAndUpdate(
        { _id: id },
        {
          is_deleted: 1,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Physique has been deleted successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/physique');
};

//Cannabinoid Model
exports.getCannabinoid = async (req, res, next) => {
  let data = commonController.getCommonParams('Cannabinoid List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      var searchName = new RegExp(["^", filterDatas.name, "$"].join(""), "i");
      findCond.name = searchName;
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  try {
    const cannabinoid = await cannabinoidModel.find(findCond).sort({ created_at: -1 });
    data.cannabinoid = cannabinoid;
    res.render('admin/cannabinoidlist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/cannabinoid');
  }
};

exports.addCannabinoid = async (req, res, next) => {
  try {
    var { name, is_active } = req.body;
    const cannabinoid = await cannabinoidModel.find({ is_deleted: 0, name: name });
    if (cannabinoid.length > 0) {
      req.flash('error_msg', 'Sorry! this Cannabinoid name already exists, Please try with some other name.');
    }
    else {
      const newCannabinoid = new cannabinoidModel({ name });
      newCannabinoid.is_active = (is_active === '1') ? is_active : 0
      await newCannabinoid.save();
      req.flash('success_msg', 'Cannabinoid has been added successfully');
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/cannabinoid');
};

exports.getUpdateCannabinoid = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Cannabinoid', req);
  try {
    const cannabinoid = await cannabinoidModel.find({ is_deleted: 0 });
    var id = req.query.id;
    const updatingCannabinoid = await cannabinoidModel.findById(id);
    data.cannabinoid = cannabinoid;
    data.updatingCannabinoid = updatingCannabinoid;
    res.render('admin/cannabinoidedit', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/cannabinoid');
  }
};

exports.updateCannabinoid = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    var { name, is_active } = req.body;
    var cannabinoidInfo = await cannabinoidModel.findById(id);
    const cannabinoid = await cannabinoidModel.find({ is_deleted: 0, name: name });
    if (cannabinoid.length > 0 && cannabinoidInfo.name !== name) {
      req.flash('error_msg', 'Sorry! this Cannabinoid name already exists, Please try with some other name.');
    }
    else {
      is_active = is_active ? 1 : 0;
      await cannabinoidModel.findByIdAndUpdate(
        { _id: id },
        {
          name,
          is_active,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Cannabinoid has been updated successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/cannabinoid');
};

exports.deleteCannabinoid = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    var userCannabinoid = await userModel.find({ cannabinoids: { $elemMatch: { cannabinoid_id: id } } });
    if (userCannabinoid.length > 0) {
      req.flash('error_msg', 'Sorry! this cannabinoid is in use')
    }
    else {
      await cannabinoidModel.findByIdAndUpdate(
        { _id: id },
        {
          is_deleted: 1,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Cannabinoid has been deleted successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/cannabinoid');
};


//Strain Model
exports.getStrain = async (req, res, next) => {
  let data = commonController.getCommonParams('Strain List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      var searchName = new RegExp(["^", filterDatas.name, "$"].join(""), "i");
      findCond.name = searchName;
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  try {
    const strain = await strainModel.find(findCond).sort({ created_at: -1 });
    data.strain = strain;
    res.render('admin/strainlist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/strain');
  }
};

exports.addStrain = async (req, res, next) => {
  try {
    var { name, is_active } = req.body;
    const strain = await strainModel.find({ is_deleted: 0, name: name });
    if (strain.length > 0) {
      req.flash('error_msg', 'Sorry! this Strain name already exists, Please try with some other name.');
    }
    else {
      const newStrain = new strainModel({ name });
      newStrain.is_active = (is_active === '1') ? is_active : 0
      await newStrain.save();
      req.flash('success_msg', 'Strain has been added successfully');
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/strain');
};

exports.getUpdateStrain = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Strain', req);
  try {
    const strain = await strainModel.find({ is_deleted: 0 });
    var id = req.query.id;
    const updatingStrain = await strainModel.findById(id);
    data.strain = strain;
    data.updatingStrain = updatingStrain;
    res.render('admin/strainedit', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/strain');
  }
};

exports.updateStrain = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    var { name, is_active } = req.body;
    var strainInfo = await strainModel.findById(id);
    const strain = await strainModel.find({ is_deleted: 0, name: name });
    if (strain.length > 0 && strainInfo.name !== name) {
      req.flash('error_msg', 'Sorry! this Strain name already exists, Please try with some other name.');
    } else {
      is_active = is_active ? 1 : 0;
      await strainModel.findByIdAndUpdate(
        { _id: id },
        {
          name,
          is_active,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Strain has been updated successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/strain');
};

exports.deleteStrain = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    const updatingStrain = await strainModel.findById(id);
    var userStrain = await userModel.find({ favourite_strains: id });
    var userDiaryStrain = await userDiaryModel.find({ strain: id });
    if ((userStrain.length > 0) || (userDiaryStrain.length > 0)) {
      req.flash('error_msg', 'Sorry! this strain is in use');
    }
    else {
      await strainModel.findByIdAndUpdate(
        { _id: id },
        {
          is_deleted: 1,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Strain has been deleted successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/strain');
};

//video
exports.getVideo = async (req, res, next) => {
  let data = commonController.getCommonParams('Video List', req);
  var totalRecords = 0

  try {
    let findCond = { is_deleted: 0 }
    var pageNo = (data.filterDatas.page_no && data.filterDatas.page_no > 1) ? data.filterDatas.page_no : 1
    let filterDatas = data.filterDatas;
    if (req.body.filter == 1) {
      if (filterDatas.title) {
        findCond.title = { '$regex': filterDatas.title, '$options': 'i' }
      }
    }
    video = []
    const totalRecords = await videoModel.countDocuments(findCond);
    if (totalRecords > 0) {
      var skip = 0
      var pageRecordLimit = 20
      if (pageNo > 0) {
        skip = (parseInt(pageNo) - 1) * pageRecordLimit
      }
      let videolist = await videoModel.find(findCond).limit(pageRecordLimit).skip(skip).sort({ created_at: -1 });

      if (videolist.length > 0) {
        for (var i = 0; i < videolist.length; i++) {
          video.push({
            _id: videolist[i]._id,
            title: videolist[i].title,
            type: videolist[i].type,
            video_url: videolist[i].video_url,
            video_thumb_image: videolist[i].video_thumb_image,
            is_active: videolist[i].is_active
          })
        }
      }
    }

    data.records = video
    data.current = pageNo;
    data.totalRecords = totalRecords;
    data.pages = Math.ceil(totalRecords / pageRecordLimit)
    data.video_type = ['', 'Introduction', 'Educational', 'News', 'Community', 'Tutorial']
    // console.log(video);
    res.render('admin/videolist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/video');
  }
};

exports.showAddVideoForm = async (req, res, next) => {
  let data = commonController.getCommonParams('Add Video', req);
  try {
    res.render('admin/videoAdd', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/video');
  }
};

exports.addVideo = async (req, res, next) => {
  try {
    if (req.body.type == 5) {
      let check = await videoModel.findOne({ is_deleted: 0, type: req.body.type });
      if (check) {
        req.flash('error_msg', 'Sorry! tutorial video already exists, you can not add more than one.');
        return res.redirect('/admin/video');
      }
    }
    const video = await videoModel.find({ is_deleted: 0, title: req.body.title });
    if (req.body.type === '1' || req.body.type === '5') {
      var type = "introductory"
    }
    else if (req.body.type === '2') {
      var type = "educational"
    }
    else if (req.body.type === '3') {
      var type = "news"
    }
    else if (req.body.type === '4') {
      var type = "community"
    }
    if (video.length > 0) {
      req.flash('error_msg', 'Sorry! this Video title already exists, Please try with some other name.');
      if (typeof (req.files.video_url) !== 'undefined') {
        CommonHelper.unlinkFile(uploadPath + `/video/${type}/${req.files.video_url[0].filename}`);
      }
      if (typeof (req.files.video_thumb_image) !== 'undefined') {
        CommonHelper.unlinkFile(uploadPath + `/video_thumb_image/${type}/${req.files.video_thumb_image[0].filename}`);
      }
    } else {
      const newVideo = new videoModel({
        title: req.body.title,
        type: req.body.type
      });
      newVideo.is_active = (req.body.is_active === '1') ? req.body.is_active : 0

      if (typeof (req.files.video_url) !== 'undefined') {
        const videoPath = uploadPath + '/video/' + type + '/' + req.files.video_url[0].filename;
        const video = {
          file: req.files.video_url[0],
          type: 'video_url',
          videoType: type
        }
        const response = await s3Upload(video);
        if (response) {
          newVideo.video_url = req.files.video_url[0].filename;
          var videoTime = await getVideoDurationInSeconds(`${uploadPath}/video/${type}/${newVideo.video_url}`);
          newVideo.duration = Math.round((videoTime + Number.EPSILON) * 100) / 100;
        }
        CommonHelper.unlinkFile(videoPath)
      }
      if (typeof (req.files.video_thumb_image) !== 'undefined') {
        const imagePath = uploadPath + '/video_thumb_image/' + type + '/' + req.files.video_thumb_image[0].filename;
        const uploadImage = {
          file: req.files.video_thumb_image[0],
          type: 'video_thumb_image',
          videoType: type
        }
        const response = await s3Upload(uploadImage);
        if (response) {
          newVideo.video_thumb_image = req.files.video_thumb_image[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
        // newVideo.video_thumb_image = req.files.video_thumb_image[0].filename
      }
      await newVideo.save();
      req.flash('success_msg', 'Video has been added successfully');
    }
  }
  catch (e) {
    console.trace(e.message)
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/video');
};

exports.getUpdateVideo = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Video', req);
  try {
    const video = await videoModel.find({ is_deleted: 0 });
    var id = req.query.id;
    const updatingVideo = await videoModel.findById(id).populate({
      path: 'author',
      select: { "full_name": 1, '_id':1 }
    });
    const users = await User.find({ is_active: 1, is_deleted: 0  });
    data.video = video;
    data.updatingVideo = updatingVideo;
    data.users = users;
    // console.log(updatingVideo);
    res.render('admin/videoedit', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/video');
  }
};

var moveFile = async (file, newDir) => {
  if (fs.existsSync(file)) {
    var f = path.basename(file);
    var dest = path.resolve(newDir, f);
    fs.renameSync(file, dest);
  }
  return
};

exports.updateVideo = async (req, res, next) => {
  try {
    var id = req.query.id;
    if (req.body.type == 5) {
      let check = await videoModel.findOne({ _id: { $ne: id }, is_deleted: 0, type: req.body.type });
      if (check) {
        req.flash('error_msg', 'Sorry! tutorial video already exists, you can not add more than one.');
        return res.redirect('/admin/video');
      }
    }
    let videoInfo = await videoModel.findById(id);
    var { title, is_active } = req.body;
    const video = await videoModel.find({ is_deleted: 0, title });
    //req.body.type - newType
    if (parseInt(req.body.type) === 1 || parseInt(req.body.type) === 5) {
      var type = "introductory"
    }
    else if (parseInt(req.body.type) === 2) {
      var type = "educational"
    }
    else if (parseInt(req.body.type) === 3) {
      var type = "news"
    }
    else if (parseInt(req.body.type) === 4) {
      var type = "community"
    }
    //videoInfo.type - oldType
    if (videoInfo.type === 1 || videoInfo.type === 5) {
      var oldType = "introductory"
    }
    else if (videoInfo.type === 2) {
      var oldType = "educational"
    }
    else if (videoInfo.type === 3) {
      var oldType = "news"
    }
    else if (videoInfo.type === 4) {
      var oldType = "community"
    }
    if (video.length > 0 && videoInfo.title !== title) {
      req.flash('error_msg', 'Sorry! this Video title already exists, Please try with some other name.');
      if (typeof (req.files.video_url) !== 'undefined') {
        CommonHelper.unlinkFile(uploadPath + `/video/${type}/${req.files.video_url[0].filename}`);
      }
      if (typeof (req.files.video_thumb_image) !== 'undefined') {
        CommonHelper.unlinkFile(uploadPath + `/video_thumb_image/${type}/${req.files.video_thumb_image[0].filename}`);
      }
    }
    else {
      videoInfo.updated_at = new Date();
      videoInfo.title = title,
        videoInfo.is_active = (is_active) ? 1 : 0;
      var oldVideo = videoInfo.video_url;
      var oldThumbnail = videoInfo.video_thumb_image;

      if (typeof (req.files.video_url) !== 'undefined') {
        if (oldVideo) {
          const removeVideo = {
            imgName: oldVideo,
            type: 'video_url',
            videoType: oldType
          }
          await s3Remove(removeVideo);
        }
        const videoPath = uploadPath + '/video/' + type + '/' + req.files.video_url[0].filename;
        const video = {
          file: req.files.video_url[0],
          type: 'video_url',
          videoType: type
        }
        const response = await s3Upload(video);
        if (response) {
          videoInfo.video_url = req.files.video_url[0].filename;
          var videoTime = await getVideoDurationInSeconds(`${uploadPath}/video/${type}/${videoInfo.video_url}`);
          videoInfo.duration = Math.round((videoTime + Number.EPSILON) * 100) / 100;
        }
        CommonHelper.unlinkFile(videoPath)
      }
      else if (typeof (req.files.video_url) === 'undefined' && parseInt(req.body.type) !== videoInfo.type) {
        const copyObj = {
          imgName: oldVideo,
          type: 'video_url',
          videoType: oldType,
          newType: type
        }
        await s3CopyObject(copyObj);
      }
      if (typeof (req.files.video_thumb_image) !== 'undefined') {
        if (oldThumbnail) {
          const removeThumbnail = {
            imgName: oldThumbnail,
            type: 'video_thumb_image',
            videoType: oldType
          }
          await s3Remove(removeThumbnail);
        }
        const imagePath = uploadPath + '/video_thumb_image/' + type + '/' + req.files.video_thumb_image[0].filename;
        const videoThumb = {
          file: req.files.video_thumb_image[0],
          type: 'video_thumb_image',
          imagePath: imagePath,
          width: 200,
          height: 180,
          videoType: type
        }
        const response = await s3Upload(videoThumb);
        if (response) {
          videoInfo.video_thumb_image = req.files.video_thumb_image[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      else if (typeof (req.files.video_thumb_image) === 'undefined' && parseInt(req.body.type) !== videoInfo.type) {
        const copyObj = {
          imgName: oldThumbnail,
          type: 'video_thumb_image',
          videoType: oldType,
          newType: type
        }
        await s3CopyObject(copyObj);
      }
      videoInfo.author = req.body.author;
      videoInfo.type = req.body.type;
      await videoInfo.save();
      req.flash('success_msg', 'Video has been updated successfully');
    }
  }
  catch (e) {
    req.flash('error_msg', e.message);
    console.log("Error message :: ", e.message);
  }
  res.redirect('/admin/video');
};


exports.deleteVideo = async (req, res, next) => {
  try {
    var id = req.query.id;
    const updatingVideo = await videoModel.findById(id);
    var oldVideo_url = updatingVideo.video_url;
    var oldVideo_thumb_image = updatingVideo.video_thumb_image;
    if (updatingVideo.type === 1 || updatingVideo.type === 5) {
      var type = "introductory"
    }
    else if (updatingVideo.type === 2) {
      var type = "educational"
    }
    else if (updatingVideo.type === 3) {
      var type = "news"
    }
    else if (updatingVideo.type === 4) {
      var type = "community"
    }
    if (oldVideo_url.length > 0) {
      const removeVideo = {
        imgName: oldVideo_url,
        type: 'video_url',
        videoType: type
      }
      await s3Remove(removeVideo);
      // CommonHelper.unlinkFile(uploadPath + `/video/${type}/${oldVideo_url}`);
    }
    if (oldVideo_thumb_image.length > 0) {
      const removeThumnail = {
        imgName: oldVideo_thumb_image,
        type: 'video_thumb_image',
        videoType: type
      }
      await s3Remove(removeThumnail);
      // CommonHelper.unlinkFile(uploadPath + `/video_thumb_image/${type}/${oldVideo_thumb_image}`);
    }
    updatingVideo.video_url = '';
    updatingVideo.video_thumb_image = '';
    updatingVideo.is_deleted = 1;
    updatingVideo.updated_at = new Date();
    updatingVideo.duration = 0;
    await updatingVideo.save();
    req.flash('success_msg', 'Video has been deleted successfully');
    res.redirect('/admin/video');
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/video');
  }
};


exports.getVideoComments = async (req, res, next) => {
  let data = commonController.getCommonParams('video Comments', req);
  const videoId = req.params.id
  //console.log(videoId)
  let info = await videoModel.findById(videoId).populate({
    path: "comments.commented_by",
    select: { "full_name": 1, "profile_image": 1 }
  })
  if (!info) {
    req.flash('error_msg', 'Record does not exist')
    return res.redirect('/admin/video')
  }
  let details = info.toObject()
  //console.log(details)
  let comments = []
  if (info.comments.length > 0) {
    var profileImgPath = req.protocol + '://' + req.get('host') + '/uploads/profile_image/'
    for (var i = 0; i < info.comments.length; i++) {
      comments.push({
        video_id: info._id,
        comment_id: info.comments[i]._id,
        comment: info.comments[i].comment,
        commented_by_user_id: info.comments[i].commented_by._id,
        commented_by_user: info.comments[i].commented_by.full_name,
        commented_by_image: (info.comments[i].commented_by.profile_image) ? profileImgPath + info.comments[i].commented_by.profile_image : '',
        created_at: CommonHelper.formatedDate(info.comments[i].created_at, 7),
        reported_count: info.comments[i].reported_count
      })
    }
    comments = comments.sort(CommonHelper.dynamicSort("created_at"))
  }
  //console.log(comments)
  details.comments = comments
  data.details = details
  res.render('admin/video_comments', { layout: layout.admin.session_with, data })
}
exports.removeComment = async (req, res, next) => {
  var commentId = req.query.id
  var videoId = req.query.video_id

  // await videoModel.updateOne({ 'comments._id': commentId }, { 
  //   "$pull": { "comments": { "_id": commentId } }
  // }, { safe: true, multi:false });

  const result = await videoModel.updateOne(videoId, {
    $pull: {
      comments: { _id: commentId }
    }
  }, { new: true });

  req.flash('success_msg', 'Comment has been removed successfully');
  res.redirect('/admin/video');
}

exports.blockCommenter = async (req, res, next) => {
  const userId = req.params.id
  let userInfo = await userModel.findById(userId)
  userInfo.is_active = 0
  await userInfo.save()
  req.flash('success_msg', 'User account has been blocked successfully');
  res.redirect('/admin/userlist');
}

exports.getVideoCommentReports = async (req, res, next) => {
  let data = commonController.getCommonParams('video Comment Reports', req);
  const commentId = req.params.id
  //let match = { comments: { $elemMatch: { _id: commentId } } }
  let match = { 'comments._id': commentId }
  let resultSet = await ReportedComment.find({ comment_id: commentId }).populate({
    path: 'reported_by',
    select: { "full_name": 1, "profile_image": 1, "email": 1 }
  }).populate({
    path: 'commented_by',
    select: { "full_name": 1, "profile_image": 1 }
  })

  let reportList = []
  if (resultSet.length > 0) {
    var profileImgPath = req.protocol + '://' + req.get('host') + '/uploads/profile_image/'
    for (var i = 0; i < resultSet.length; i++) {
      console.log(resultSet[i].video_id)
      reportList.push({
        commented_by_user_id: (resultSet[i].commented_by) ? resultSet[i].commented_by._id : '',
        commented_by_user: (resultSet[i].commented_by) ? resultSet[i].commented_by.full_name : '',
        commented_by_user_image: (resultSet[i].commented_by) ? profileImgPath + resultSet[i].commented_by.profile_image : '',
        reported_by_user_id: resultSet[i].reported_by._id,
        reported_by_user: resultSet[i].reported_by.full_name,
        reported_by_image: (resultSet[i].reported_by.profile_image) ? profileImgPath + resultSet[i].reported_by.profile_image : '',
        reported_at: CommonHelper.formatedDate(resultSet[i].created_at, 7)
      })
    }
  }
  data.list = reportList
  res.render('admin/video_comment_reports', { layout: layout.admin.session_with, data })
}

//articleCategory Model
exports.getArticleCategory = async (req, res, next) => {
  let data = commonController.getCommonParams('Article Category List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      var searchName = new RegExp(["^", filterDatas.name, "$"].join(""), "i");
      findCond.name = searchName;
    }
  }
  try {
    const articleCategory = await articleCategoryModel.find(findCond).sort({ created_at: -1 });
    data.articleCategory = articleCategory;
    res.render('admin/articleCategorylist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/article-category');
  }
};

exports.addArticleCategory = async (req, res, next) => {
  try {
    var { name, is_active } = req.body;
    const articleCategory = await articleCategoryModel.find({ is_deleted: 0, name: name });
    if (articleCategory.length > 0) {
      req.flash('error_msg', 'Sorry! this Article Category already exists, Please try with some other name.');
    }
    else {
      let newArticleCategory = new articleCategoryModel({ name });
      newArticleCategory.is_active = (is_active === '1') ? is_active : 0
      await newArticleCategory.save();
      req.flash('success_msg', 'Article category has been added successfully');
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/article-category');
};

exports.getUpdateArticleCategory = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Article Category', req);
  try {
    const articleCategory = await articleCategoryModel.find({ is_deleted: 0 });
    var id = req.query.id;
    const updatingArticleCategory = await articleCategoryModel.findById(id);
    data.articleCategory = articleCategory;
    data.updatingArticleCategory = updatingArticleCategory;
    res.render('admin/articleCategoryedit', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/article-category');
  }
};

exports.updateArticleCategory = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    var { name, is_active } = req.body;
    let articleCategoryInfo = await articleCategoryModel.findById(id);
    const articleCategory = await articleCategoryModel.find({ is_deleted: 0, name: name });
    if (articleCategory.length > 0 && articleCategoryInfo.name !== name) {
      req.flash('error_msg', 'Sorry! this Article Category already exists, Please try with some other name.');
    }
    else {
      is_active = is_active ? 1 : 0;
      await articleCategoryModel.findByIdAndUpdate(
        { _id: id },
        {
          name,
          is_active,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Article category has been updated successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/article-category');
};

exports.deleteArticleCategory = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    await articleCategoryModel.findByIdAndUpdate(
      { _id: id },
      {
        is_deleted: 1,
        updated_at
      },
      function (err, result) {
        if (err) {
          req.flash('error_msg', 'Sorry! something went wrong, please try again');
        } else {
          req.flash('success_msg', 'Article category has been deleted successfully');
        }
      }
    );
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/article-category');
};

//medicineComposition Model
exports.getMedicineComposition = async (req, res, next) => {
  let data = commonController.getCommonParams('COA Composition List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      findCond.name = { '$regex': filterDatas.name, '$options': 'i' }
    }
    if (filterDatas.type) {
      findCond.type = filterDatas.type;
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  try {
    let composition_types = ['', 'Cannabinoid', 'Terpenes', 'Pesticides', 'Microbials', 'Mycotoxins', 'Heavy Metals']
    const medicineComposition = await medicineCompositionModel.find(findCond).sort({ created_at: -1 });
    const imagePath = "https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/composition/";
    let list = []
    if (medicineComposition.length > 0) {
      for (var i = 0; i < medicineComposition.length; i++) {
        list.push({
          _id: medicineComposition[i]._id,
          name: medicineComposition[i].name,
          type_name: composition_types[medicineComposition[i].type],
          image: (medicineComposition[i].image) ? imagePath+medicineComposition[i].image : '' ,
          is_active: medicineComposition[i].is_active
        })
      }
    }
    data.medicineComposition = list;
    res.render('admin/medicineCompositionlist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/medicine-composition');
  }
};

exports.addMedicineCompositionForm = async (req, res, next) => {
  let data = commonController.getCommonParams('Add COA Composition', req);
  let info = {
    _id: '',
    name: '',
    description: '',
    type: '',
    image: '',
    is_active: ''
  }
  data.details = info
  res.render('admin/medicineCompositionedit', { layout: layout.admin.session_with, data });
};

exports.UpdateMedicineCompositionForm = async (req, res, next) => {
  let data = commonController.getCommonParams('Update COA Composition', req);
  const id = req.params.id
  let info = await medicineCompositionModel.findById(id)
  data.details = info
  res.render('admin/medicineCompositionedit', { layout: layout.admin.session_with, data });
};

exports.manageCOAComposition = async (req, res, next) => {
  try {
    const id = req.body.id
    if (id) {
      let compositionInfo = await medicineCompositionModel.findById(id)
      if (!compositionInfo) {
        req.flash('error_msg', 'Sorry!, this COA composition does not exists');
        return res.redirect('/admin/coa-composition/update/' + id);
      }
      let checkName = await medicineCompositionModel.find({ _id: { $ne: id }, is_deleted: 0, name: req.body.name })
      if (checkName.length > 0) {
        req.flash('error_msg', 'COA composition name already exists!');
        return res.redirect('/admin/coa-composition/update/' + id);
      }
      compositionInfo.updated_at = new Date();
      compositionInfo.name = req.body.name
      compositionInfo.description = req.body.description,
        compositionInfo.type = req.body.type
      compositionInfo.is_active = (req.body.is_active) ? 1 : 0
      if (req.file) {
        if (checkName.image) {
        compositionInfo.image = req.file.filename
        const removeImage = {
          imgName: compositionInfo.image,
          type: 'composition_image'
        }
        await s3Remove(removeImage);
        }
        const imagePath = uploadPath + '/composition/' + req.file.filename;
        const cmsImage = {
          file: req.file,
          type: 'composition_image',
        }
        const response = await s3Upload(cmsImage);
        if (response) {
          compositionInfo.image = req.file.filename
        }
        CommonHelper.unlinkFile(imagePath)
      }
      await compositionInfo.save()
      req.flash('success_msg', 'COA composition updated successfully');
    } else {
      let checkName = await medicineCompositionModel.find({ is_deleted: 0, name: req.body.name })
      if (checkName.length > 0) {
        req.flash('error_msg', 'COA composition name already exists!');
        return res.redirect('/admin/coa-composition/add');
      }
      let compositionInfo = new medicineCompositionModel({
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        is_active: (req.body.is_active) ? 1 : 0
      })
      if (req.file) {
        const imagePath = uploadPath + '/composition/' + req.file.filename;
        const cmsImage = {
          file: req.file,
          type: 'composition_image',
        }
        const response = await s3Upload(cmsImage);
        if (response) {
          compositionInfo.image = req.file.filename
        }
        CommonHelper.unlinkFile(imagePath)
      }
      await compositionInfo.save()
      req.flash('success_msg', 'COA composition added successfully');
    }
  } catch (e) {
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/coa-composition');
}


exports.deleteMedicineComposition = async (req, res, next) => {
  try {
    var id = req.query.id;
    let updatingMedicineComposition = await medicineCompositionModel.findById(id);
    var userDiaryMedicineComposition = await userDiaryModel.find({ $or: [{ cannabinoid_profile: { $elemMatch: { composition_id: id } } }, { terpenes: { $elemMatch: { composition_id: id } } }] });
    if (userDiaryMedicineComposition.length > 0) {
      req.flash('error_msg', 'Sorry! this COA composition is in use');
    }
    else {
      var updated_at = new Date();
      await medicineCompositionModel.findByIdAndUpdate(
        { _id: id },
        {
          is_deleted: 1,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'COA composition deleted successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/coa-composition');
};

//consumptionNegatives Model
exports.getConsumptionNegatives = async (req, res, next) => {
  let data = commonController.getCommonParams('Consumption Negatives List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      var searchName = new RegExp(["^", filterDatas.name, "$"].join(""), "i");
      findCond.name = searchName;
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  try {
    const consumptionNegatives = await consumptionNegativesModel.find(findCond).sort({ created_at: -1 });
    data.consumptionNegatives = consumptionNegatives;
    res.render('admin/consumptionNegativeslist', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/consumption-negatives');
  }
};

exports.addConsumptionNegatives = async (req, res, next) => {
  try {
    var { name, is_active } = req.body;
    const consumptionNegatives = await consumptionNegativesModel.find({ is_deleted: 0, name: name });
    if (consumptionNegatives.length > 0) {
      req.flash('error_msg', 'Consumption Negative already exists!');
    }
    else {
      const newConsumptionNegatives = new consumptionNegativesModel({ name });
      newConsumptionNegatives.is_active = (is_active === '1') ? is_active : 0;
      await newConsumptionNegatives.save();
      req.flash('success_msg', 'Consumption Negative added successfully');
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/consumption-negatives');
};

exports.getUpdateConsumptionNegatives = async (req, res, next) => {
  let data = commonController.getCommonParams('Update ConsumptionNegatives', req);
  try {
    const consumptionNegatives = await consumptionNegativesModel.find({ is_deleted: 0 });
    var id = req.query.id;
    const updatingConsumptionNegatives = await consumptionNegativesModel.findById(id);
    data.consumptionNegatives = consumptionNegatives;
    data.updatingConsumptionNegatives = updatingConsumptionNegatives;
    res.render('admin/consumptionNegativesedit', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/consumption-negatives');
  }
};

exports.updateConsumptionNegatives = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    var { name, is_active } = req.body;
    let consumptionNegativesInfo = await consumptionNegativesModel.findById(id);
    const consumptionNegatives = await consumptionNegativesModel.find({ is_deleted: 0, name: name });
    if (consumptionNegatives.length > 0 && consumptionNegativesInfo.name !== name) {
      req.flash('error_msg', 'Consumption Negative already exists!');
    }
    else {
      await consumptionNegativesModel.findByIdAndUpdate(
        { _id: id },
        {
          name,
          is_active,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Consumption Negative updated successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/consumption-negatives');
};

exports.deleteConsumptionNegatives = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    const userConsumptionNegatives = await userDiaryModel.find({ consumption_negative: id });
    if (userConsumptionNegatives.length > 0) {
      req.flash('error_msg', 'Sorry! this Consumption Negative is in use');
    }
    else {
      await consumptionNegativesModel.findByIdAndUpdate(
        { _id: id },
        {
          is_deleted: 1,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Consumption Negative deleted successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/consumption-negatives');
};

//consumptionMethods
exports.getConsumptionMethods = async (req, res, next) => {
  let data = commonController.getCommonParams('Consumption methods', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      findCond.name = { '$regex': filterDatas.name, '$options': 'i' }
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  let methods = await ConsumptionMethods.find(findCond).populate({
    path: 'parent_method_id',
    select: { "name": 1 }
  }).sort({ created_at: -1 })
  let consumption_methods = []
  if (methods.length > 0) {
    // var imagePath = req.protocol + '://' + req.get('host') + '/uploads/method/';
    var imagePath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/method/';
    for (var m = 0; m < methods.length; m++) {
      let mUnits = []
      if (methods[m].measurement_units.length > 0) {
        for (var u = 0; u < methods[m].measurement_units.length; u++) {
          mUnits.push(methods[m].measurement_units[u].unit)
        }
      }
      consumption_methods.push({
        _id: methods[m]._id,
        name: methods[m].name,
        icon: (methods[m].icon) ? imagePath + methods[m].icon : '',
        parent_method_id: (methods[m].parent_method_id) ? methods[m].parent_method_id._id : '',
        parent_method_name: (methods[m].parent_method_id) ? methods[m].parent_method_id.name : '',
        measurement_units: mUnits,
        is_active: methods[m].is_active
      })
    }
  }
  data.list = consumption_methods
  res.render('admin/consumption_method_list', { layout: layout.admin.session_with, data });
}

exports.addConsumptionMethod = async (req, res, next) => {
  let data = commonController.getCommonParams('Add new consumption method', req);
  let methodInfo = {
    _id: '',
    name: '',
    parent_method_id: '',
    icon: '',
    measurement_unit: '',
    scales: [],
    is_active: 1
  }
  data.details = methodInfo
  let parentMethods = await ConsumptionMethods.find({ is_active: 1, is_deleted: 0, type: 2 }).select({ "name": 1 })
  data.parent_methods = parentMethods
  let units = ['Drops', 'g', 'Miligrams', 'Mililiters', 'Puffs']
  let measurement_units = [];
  for (var index in units) {
    measurement_units.push({ name: units[index] });
  }
  data.weights = commonController.getWeights()
  data.measurement_units = measurement_units
  res.render('admin/consumption_method_form', { layout: layout.admin.session_with, data });
}

exports.updateConsumptionMethod = async (req, res, next) => {
  let data = commonController.getCommonParams('Update consumption method', req);
  const methodId = req.params.id
  let parentMethods = await ConsumptionMethods.find({ _id: { $ne: methodId }, is_active: 1, is_deleted: 0, type: 2 }).select({ "name": 1 })
  data.parent_methods = parentMethods
  let methodInfo = await ConsumptionMethods.findById(methodId)
  data.details = methodInfo
  let scales = []
  if (methodInfo.measurement_scales.length > 0) {
    for (var s = 0; s < methodInfo.measurement_scales.length; s++) {
      scales.push(parseInt(methodInfo.measurement_scales[s].scale))
    }
  }
  data.details.scales = scales
  let units = ['Drops', 'g', 'Miligrams', 'Mililiters', 'Puffs']
  let measurement_units = [];
  for (var index in units) {
    measurement_units.push({ name: units[index] });
  }
  data.measurement_units = measurement_units
  data.weights = commonController.getWeights()
  console.log(data.weights)
  res.render('admin/consumption_method_form', { layout: layout.admin.session_with, data });
}

exports.manageConsumptionMethods = async (req, res, next) => {
  try {
    const methodId = req.body.id
    let staticMethod = await ConsumptionMethods.findOne({ type: 1 })
    if (methodId) {
      let check = await ConsumptionMethods.findOne({ _id: { $ne: methodId }, name: req.body.name, is_deleted: 0 })
      if (check) {
        req.flash('error_msg', 'Consumption method name already exists!')
        return res.redirect('/admin/consumption-methods/update/' + methodId)
      }
      // if((req.body.measurement_scale.length > 0) && !req.body.measurement_unit){
      //   req.flash('error_msg','Please select measurement unit')
      //   return res.redirect('/admin/consumption-methods/update/'+methodId)
      // }
      let methodInfo = await ConsumptionMethods.findById(methodId)
      methodInfo.name = req.body.name;
      methodInfo.type = (req.body.parent_method_id) ? 3 : 2;
      methodInfo.parent_method_id = (req.body.parent_method_id) ? req.body.parent_method_id : staticMethod._id;
      if (req.file) {
        if (methodInfo.icon) {
          const removeIcon = {
            imgName: methodInfo.icon,
            type: 'method_icon'
          }
          await s3Remove(removeIcon);
        }
        const imagePath = uploadPath + '/method/' + req.file.filename;
        const cmsImage = {
          file: req.file,
          type: 'method_icon',
        }
        const response = await s3Upload(cmsImage);
        if (response) {
          methodInfo.icon = req.file.filename
        }
        CommonHelper.unlinkFile(imagePath)
      }
      if (req.body.measurement_scale.length > 0) {
        let unitArr = []
        let scaleArr = []
        for (var index in req.body.measurement_scale) {
          unitArr.push({ unit: req.body.measurement_scale[index] + ' ' + req.body.measurement_unit })
          scaleArr.push({ scale: req.body.measurement_scale[index] });
        }
        methodInfo.measurement_units = unitArr
        methodInfo.measurement_scales = scaleArr
        methodInfo.measurement_unit = req.body.measurement_unit
      }
      await methodInfo.save()
      req.flash('success_msg', 'Consumption method updated successfully')
    } else {
      //console.log(req.body);
      // if((!req.body.measurement_scale || req.body.measurement_scale.length > 0) && !req.body.measurement_unit){
      //   req.flash('error_msg','Please select measurement unit')
      //   return res.redirect('/admin/consumption-methods/add/')
      // }
      let check = await ConsumptionMethods.findOne({ name: req.body.name, is_deleted: 0 })
      if (check) {
        req.flash('error_msg', 'Consumption method name already exists!')
        return res.redirect('/admin/consumption-methods/add/')
      }
      let methodInfo = new ConsumptionMethods({
        name: req.body.name,
        parent_method_id: (req.body.parent_method_id) ? req.body.parent_method_id : staticMethod._id,
        type: (req.body.parent_method_id) ? 3 : 2,
      })
      if (req.file) {
        const imagePath = uploadPath + '/method/' + req.file.filename;
        const cmsImage = {
          file: req.file,
          type: 'method_icon',
        }
        const response = await s3Upload(cmsImage);
        if (response) {
          methodInfo.icon = req.file.filename
        }
        CommonHelper.unlinkFile(imagePath)
      }
      if (req.body.measurement_scale.length > 0) {
        for (var index in req.body.measurement_scale) {
          methodInfo.measurement_units.push({ unit: req.body.measurement_scale[index] + ' ' + req.body.measurement_unit });
          methodInfo.measurement_scales.push({ scale: req.body.measurement_scale[index] });
        }
        methodInfo.measurement_unit = req.body.measurement_unit
      }
      await methodInfo.save()
      req.flash('success_msg', 'Consumption method added successfully')
    }
  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/consumption-methods')
}

exports.deleteConsumptionMethod = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.params.id;
    await ConsumptionMethods.findByIdAndUpdate(
      { _id: id },
      {
        is_deleted: 1,
        updated_at
      },
      function (err, result) {
        if (err) {
          req.flash('error_msg', 'Sorry! something went wrong, please try again');
        } else {
          req.flash('success_msg', 'Consumption method deleted successfully');
        }
      }
    );
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/consumption-methods');
}

//faq-category model
exports.getFaqCategory = async (req, res, next) => {
  let data = commonController.getCommonParams('FAQ Category', req);
  let faqCategory = await faqCategoryModel.find({ is_deleted: 0, parent_id: { $ne: null } })
  //console.log(faqCategory);
  data.faqCategory = faqCategory;
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      findCond.name = { '$regex': filterDatas.name, '$options': 'i' }
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  let faq = await faqCategoryModel.find(findCond).populate({
    path: 'parent_id',
    select: { "name": 1 }
  }).sort({ created_at: -1 })
  let faq_category = []
  if (faq.length > 0) {
    for (var m = 0; m < faq.length; m++) {
      faq_category.push({
        _id: faq[m]._id,
        parent_category: (faq[m].parent_id) ? faq[m].parent_id.name : '',
        name: faq[m].name,
        is_active: faq[m].is_active
      })
    }
  }
  data.list = faq_category
  res.render('admin/faq_category_list', { layout: layout.admin.session_with, data });
}

exports.addFaqCategory = async (req, res, next) => {
  let data = commonController.getCommonParams('Add new FAQ category', req);
  let faqInfo = {
    _id: '',
    name: '',
    is_active: 1,
    parent_id: ''
  }
  data.details = faqInfo
  let categories = await FaqCategory.find({ is_active: 1, is_deleted: 0, type: 2 }).select({ "name": 1 })
  data.parent_categories = categories
  res.render('admin/faq_category_form', { layout: layout.admin.session_with, data });
}

exports.updateFaqCategory = async (req, res, next) => {
  let data = commonController.getCommonParams('Update FAQ category', req);
  const faqId = req.params.id
  let faqInfo = await faqCategoryModel.findById(faqId)
  let details = faqInfo.toObject()
  details.parent_catg_id = details._id
  data.details = details
  let categories = await FaqCategory.find({ is_active: 1, is_deleted: 0, type: 2 }).select({ "name": 1 })
  data.parent_categories = categories
  res.render('admin/faq_category_form', { layout: layout.admin.session_with, data });
}

exports.manageFaqCategory = async (req, res, next) => {
  let parentCatg = await faqCategoryModel.findOne({ type: 1 })
  try {
    const faqId = req.body.id
    if (faqId) {
      let check = await faqCategoryModel.findOne({ _id: { $ne: faqId }, name: req.body.name, is_deleted: 0 })
      if (check) {
        req.flash('error_msg', 'FAQ category name already exists!')
        return res.redirect('/admin/faq-category/update/' + faqId)
      }
      let faqInfo = await faqCategoryModel.findById(faqId)
      if (req.body.parent_id) {
        let pcatgInfo = await faqCategoryModel.findOne({ _id: req.body.parent_id, is_deleted: 0 })
        if (!pcatgInfo) {
          req.flash('error_msg', 'Parent category does not exist')
          return res.redirect('/admin/faq-category/add/')
        }
        faqInfo.parent_id = req.body.parent_id
        faqInfo.type = 3
      }
      faqInfo.name = req.body.name;
      faqInfo.is_active = req.body.is_active ? 1 : 0;
      await faqInfo.save()
      req.flash('success_msg', 'FAQ category updated successfully')
    } else {
      let check = await faqCategoryModel.findOne({ name: req.body.name, is_deleted: 0 })
      if (check) {
        req.flash('error_msg', 'FAQ category name already exists!')
        return res.redirect('/admin/faq-category/add/')
      }


      let faqInfo = new faqCategoryModel({
        name: req.body.name
      })
      if (req.body.parent_id) {
        let pcatgInfo = await faqCategoryModel.findOne({ _id: req.body.parent_id, is_deleted: 0 })
        if (!pcatgInfo) {
          req.flash('error_msg', 'Parent category does not exist')
          return res.redirect('/admin/faq-category/add/')
        }
        faqInfo.parent_id = req.body.parent_id
        faqInfo.type = 3
      }
      faqInfo.is_active = req.body.is_active ? 1 : 0;
      await faqInfo.save()

      req.flash('success_msg', 'FAQ category added successfully')
    }
  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/faq-category')
}

exports.deleteFaqCategory = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.params.id;
    let catgInfo = await faqCategoryModel.findById(id)
    let checkFaqCond = { is_deleted: 0 }
    if (catgInfo.type == 3) {
      checkFaqCond.category_id = id
    }
    if (catgInfo.type == 2) {
      let subcategories = await faqCategoryModel.find({ is_deleted: 0, parent_id: id })
      let subcategoryIds = []
      if (subcategories.length > 0) {
        for (var c = 0; c < subcategories.length; c++) {
          subcategoryIds.push(subcategories[c]._id)
        }
        checkFaqCond.category_id = { $in: subcategoryIds }
      }
    }
    checkFaqExist = await Faq.findOne(checkFaqCond)
    if (checkFaqExist) {
      req.flash('error_msg', 'Sorry! some FAQs are enlisted under this category, so you can not delete this');
      return res.redirect('/admin/faq-category');
    }
    await faqCategoryModel.findByIdAndUpdate(
      { _id: id },
      {
        is_deleted: 1,
        updated_at
      },
      function (err, result) {
        if (err) {
          req.flash('error_msg', 'Sorry! something went wrong, please try again');
        } else {
          req.flash('success_msg', 'FAQ category deleted successfully');
        }
      }
    );
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/faq-category');
}

//Community Question Category Model
exports.getCommunityQuestionCategory = async (req, res, next) => {
  let data = commonController.getCommonParams('Community Question Category List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.name) {
      var searchName = new RegExp(["^", filterDatas.name, "$"].join(""), "i");
      findCond.name = searchName;
    }
    if (filterDatas.is_active) {
      findCond.is_active = filterDatas.is_active
    }
  }
  try {
    const communityQuestionCategory = await communityQuestionCategoryModel.find(findCond).sort({ created_at: -1 });
    data.communityQuestionCategory = communityQuestionCategory;
    res.render('admin/community_question_category_list', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/community-questions-category');
  }
};

exports.addCommunityQuestionCategory = async (req, res, next) => {
  try {
    var { name, is_active } = req.body;
    const communityQuestionCategory = await communityQuestionCategoryModel.find({ is_deleted: 0, name: name });
    if (communityQuestionCategory.length > 0) {
      req.flash('error_msg', 'Community Question Category already exists!');
    }
    else {
      const newCommunityQuestionCategory = new communityQuestionCategoryModel({ name });
      newCommunityQuestionCategory.is_active = (is_active === '1') ? is_active : 0
      await newCommunityQuestionCategory.save();
      req.flash('success_msg', 'Community Question Category added successfully');
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/community-questions-category');
};

exports.getUpdateCommunityQuestionCategory = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Community Question Category', req);
  try {
    const communityQuestionCategory = await communityQuestionCategoryModel.find({ is_deleted: 0 });
    var id = req.query.id;
    const updatingCommunityQuestionCategory = await communityQuestionCategoryModel.findById(id);
    data.communityQuestionCategory = communityQuestionCategory;
    data.updatingCommunityQuestionCategory = updatingCommunityQuestionCategory;
    res.render('admin/community_question_category_edit', { layout: layout.admin.session_with, data });
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
    res.redirect('/admin/community-questions-category');
  }
};

exports.updateCommunityQuestionCategory = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    var { name, is_active } = req.body;
    var communityQuestionCategoryInfo = await communityQuestionCategoryModel.findById(id);
    const communityQuestionCategory = await communityQuestionCategoryModel.find({ is_deleted: 0, name: name });
    if (communityQuestionCategory.length > 0 && communityQuestionCategoryInfo.name !== name) {
      req.flash('error_msg', 'Community Question Category already exists!');
    }
    else {
      is_active = is_active ? 1 : 0;
      await communityQuestionCategoryModel.findByIdAndUpdate(
        { _id: id },
        {
          name,
          is_active,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Community Question Category updated successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/community-questions-category');
};

exports.deleteCommunityQuestionCategory = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    var categoryInUse = await communityQuestionsModel.find({ category: id });
    if (categoryInUse && categoryInUse.length > 0) {
      req.flash('error_msg', 'Sorry! this category is in use');
    }
    else {
      await communityQuestionCategoryModel.findByIdAndUpdate(
        { _id: id },
        {
          is_deleted: 1,
          updated_at
        },
        function (err, result) {
          if (err) {
            req.flash('error_msg', 'Sorry! something went wrong, please try again');
          } else {
            req.flash('success_msg', 'Community Question Category deleted successfully');
          }
        }
      );
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/community-questions-category');
};


exports.getConditionList = async (req, res, next) => {
  let data = commonController.getCommonParams('Condition List', req);
  var totalRecords = 0
  try {
    let findCond = { is_deleted: 0 }
    let filterDatas = data.filterDatas;
    var pageNo = (data.filterDatas.page_no && data.filterDatas.page_no > 1) ? data.filterDatas.page_no : 1
    if (req.body.filter == 1) {
      if (filterDatas.search_text) {
        findCond.name = { '$regex': filterDatas.search_text, '$options': 'i' }
      }
      if (filterDatas.is_active) {
        findCond.is_active = filterDatas.is_active
      }
    }
    totalRecords = await Condition.countDocuments(findCond);
    let list = []
    if (totalRecords > 0) {
      var skip = 0
      var pageRecordLimit = 40
      if (pageNo > 0) {
        skip = (parseInt(pageNo) - 1) * pageRecordLimit
      }
      let conditions = await Condition.find(findCond).limit(pageRecordLimit).skip(skip).sort({ sort_order: 1 })
      if (conditions.length > 0) {
        // var imagePath = req.protocol + '://' + req.get('host') + '/uploads/condition/'
        var imagePath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/condition/'
        for (var i = 0; i < conditions.length; i++) {
          list.push({
            _id: conditions[i]._id,
            name: conditions[i].name,
            image: (conditions[i].image) ? imagePath + conditions[i].image : '',
            icon: (conditions[i].icon) ? imagePath + conditions[i].icon : '',
            sort_order: conditions[i].sort_order,
            is_active: conditions[i].is_active
          })
        }
      }
    }

    data.records = list
    data.current = pageNo;
    data.totalRecords = totalRecords;
    data.pages = Math.ceil(totalRecords / pageRecordLimit)
  } catch (e) {
    req.flash('danger', e.message)
  }

  res.render('admin/condition_list', { layout: layout.admin.session_with, data });
}

exports.getCreateConditionView = async (req, res, next) => {
  let data = commonController.getCommonParams('Add New Condition', req);
  data.details = {
    _id: '',
    name: ''
  }
  res.render('admin/condition_form', { layout: layout.admin.session_with, data });
}

exports.getUpdateConditionView = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Condition', req);
  var conditionId = req.params.id
  let conditionInfo = await Condition.findOne({ _id: conditionId, is_deleted: 0 })
  if (!conditionInfo) {
    req.flash('error_msg', 'Condition does not exist');
    res.redirect('/admin/conditions')
  }
  var imagePath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/condition/';
  // var imagePath = req.protocol + '://' + req.get('host') + '/uploads/condition/'
  let info = conditionInfo.toObject()
  info.image = (info.image) ? imagePath + info.image : ''
  info.icon = (info.icon) ? imagePath + info.icon : ''
  data.details = info
  res.render('admin/condition_form', { layout: layout.admin.session_with, data });
}

exports.manageCondition = async (req, res, next) => {
  //console.log(req.body)
  try {
    const id = req.body.id
    let checkConditionCond = { is_deleted: 0, name: req.body.name }
    if (id) {
      checkConditionCond._id = { $ne: id }
    }
    const checkCondition = await Condition.findOne(checkConditionCond);
    if (checkCondition) {
      req.flash('error_msg', 'Sorry! this Condition name already exists, Please try with some other name.');
      return res.redirect('/admin/conditions')
    }
    if (id) {
      let conditionInfo = await Condition.findOne({ is_deleted: 0, _id: id })
      if (!conditionInfo) {
        req.flash('error_msg', 'Condition does not exist.');
        return res.redirect('/admin/conditions')
      }
      conditionInfo.name = req.body.name
      conditionInfo.updated_by = req.user._id
      conditionInfo.is_active = (req.body.is_active === '1') ? req.body.is_active : 0
      if (typeof (req.files.condition_image) !== 'undefined') {
        //Remove Old Image
        if (conditionInfo.image) {
          const removeImage = {
            imgName: conditionInfo.image,
            type: 'condition_image'
          }
          await s3Remove(removeImage);
        }

        const imagePath = uploadPath + '/condition/' + req.files.condition_image[0].filename;
        const conditionImage = {
          file: req.files.condition_image[0],
          type: 'condition_image',
          imagePath: imagePath,
          width: 750,
          height: 500
        }
        const response = await s3Upload(conditionImage);
        if (response) {
          conditionInfo.image = req.files.condition_image[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)

      }
      if (typeof (req.files.condition_icon) !== 'undefined') {
        //Remove Old Icon
        if (conditionInfo.icon) {
          const removeImage = {
            imgName: conditionInfo.icon,
            type: 'condition_image'
          }
          await s3Remove(removeImage);
        }

        const imagePath = uploadPath + '/condition/' + req.files.condition_icon[0].filename;
        const conditionIcon = {
          file: req.files.condition_icon[0],
          type: 'condition_icon',
          imagePath: imagePath,
          width: 60,
          height: 40
        }
        const response = await s3Upload(conditionIcon);
        if (response) {
          conditionInfo.icon = req.files.condition_icon[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      await conditionInfo.save();
      req.flash('success_msg', 'Condition has been updated successfully');
    } else {
      let newCondition = new Condition({
        name: req.body.name,
        updated_by: req.user._id
      });
      newCondition.is_active = (req.body.is_active === '1') ? req.body.is_active : 0
      if (typeof (req.files.condition_image) !== 'undefined') {
        const imagePath = uploadPath + '/condition/' + req.files.condition_image[0].filename;
        const conditionImage = {
          file: req.files.condition_image[0],
          type: 'condition_image',
          imagePath: imagePath,
          width: 750,
          height: 500
        }
        const response = await s3Upload(conditionImage);
        if (response) {
          newCondition.image = req.files.condition_image[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      if (typeof (req.files.condition_icon) !== 'undefined') {
        const imagePath = uploadPath + '/condition/' + req.files.condition_icon[0].filename;
        const conditionIcon = {
          file: req.files.condition_icon[0],
          type: 'condition_icon',
          imagePath: imagePath,
          width: 60,
          height: 40
        }
        const response = await s3Upload(conditionIcon);
        if (response) {
          newCondition.icon = req.files.condition_icon[0].filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      await newCondition.save();
      req.flash('success_msg', 'Condition has been added successfully');
    }

  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/conditions')
}

exports.deleteCondition = async (req, res, next) => {
  try {
    const id = req.params.id
    let conditionInfo = await Condition.findOne({ is_deleted: 0, _id: id })
    if (!conditionInfo) {
      req.flash('error_msg', 'Condition does not exist.');
      return res.redirect('/admin/conditions')
    }
    //let check = await User
    var userCondition = await userModel.find({ conditions: { $elemMatch: { condition_id: id } } });
    if (userCondition.length > 0) {
      req.flash('error_msg', 'Condition is in use so you could not remove this record.');
      return res.redirect('/admin/conditions')
    }
    await Condition.updateOne({ _id: id }, { is_deleted: 1 })
    req.flash('success_msg', 'Condition removed successfully.');
  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/conditions')
}

exports.manageConditionOrdering = async (req, res, next) => {
  try {
    const ids = req.body.id;
    //console.log(ids)
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let condition = await Condition.findById(id);
      //console.log(i)
      condition.sort_order = i + 1;
      await condition.save();
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
  }
  res.send('list sorted');
};


exports.getCountryList = async (req, res, next) => {
  let data = commonController.getCommonParams('Country List', req);
  var totalRecords = 0
  try {
    let findCond = { is_deleted: 0 }
    let filterDatas = data.filterDatas;
    var pageNo = (data.filterDatas.page_no && data.filterDatas.page_no > 1) ? data.filterDatas.page_no : 1
    if (req.body.filter == 1) {
      if (filterDatas.search_text) {
        findCond.name = { '$regex': filterDatas.search_text, '$options': 'i' }
      }
      if (filterDatas.is_active) {
        findCond.is_active = filterDatas.is_active
      }
    }
    totalRecords = await Country.countDocuments(findCond);
    let list = []
    if (totalRecords > 0) {
      var skip = 0
      var pageRecordLimit = 20
      if (pageNo > 0) {
        skip = (parseInt(pageNo) - 1) * pageRecordLimit
      }
      let countrylist = await Country.find(findCond).limit(pageRecordLimit).skip(skip).sort({ name: 1 })
      //console.log(countrylist)
      if (countrylist.length > 0) {
        for (var i = 0; i < countrylist.length; i++) {
          list.push({
            _id: countrylist[i]._id,
            name: countrylist[i].name,
            alternative_name: countrylist[i].alternative_name,
            local_name: countrylist[i].local_name,
            is_active: countrylist[i].is_active
          })
        }
      }
    }

    data.records = list
    data.current = pageNo;
    data.totalRecords = totalRecords;
    data.pages = Math.ceil(totalRecords / pageRecordLimit)
  } catch (e) {
    req.flash('danger', e.message)
  }

  res.render('admin/countrylist', { layout: layout.admin.session_with, data });
}

exports.getCreateCountryView = async (req, res, next) => {
  let data = commonController.getCommonParams('Add New Country', req);
  data.details = {
    _id: '',
    name: '',
    alternative_name: '',
    local_name: ''
  }
  res.render('admin/countryform', { layout: layout.admin.session_with, data });
}

exports.getUpdateCountryView = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Country', req);
  var countryId = req.params.id
  let countryInfo = await Country.findOne({ _id: countryId, is_deleted: 0 })
  if (!countryInfo) {
    req.flash('error_msg', 'Country does not exist');
    res.redirect('/admin/country')
  }
  data.details = countryInfo
  res.render('admin/countryform', { layout: layout.admin.session_with, data });
}

exports.manageCountry = async (req, res, next) => {
  //console.log(req.body)
  try {
    const id = req.body.id
    let checkCountryCond = { is_deleted: 0, name: req.body.name }
    if (id) {
      checkCountryCond._id = { $ne: id }
    }
    const check = await Country.findOne(checkCountryCond);
    if (check) {
      req.flash('error_msg', 'Sorry! this Country name already exists, Please try with some other name.');
      return res.redirect('/admin/country')
    }
    if (id) {
      let countryInfo = await Country.findOne({ is_deleted: 0, _id: id })
      if (!countryInfo) {
        req.flash('error_msg', 'Country does not exist.');
        return res.redirect('/admin/country')
      }
      countryInfo.name = req.body.name
      countryInfo.alternative_name = req.body.alternative_name
      countryInfo.local_name = req.body.local_name
      countryInfo.updated_by = req.user._id
      countryInfo.is_active = (req.body.is_active === '1') ? req.body.is_active : 0


      await countryInfo.save();
      req.flash('success_msg', 'Country has been updated successfully');
    } else {
      let newCountry = new Country({
        name: req.body.name,
        alternative_name: req.body.alternative_name,
        local_name: req.body.local_name,
        updated_by: req.user._id
      });
      newCountry.is_active = (req.body.is_active === '1') ? req.body.is_active : 0

      await newCountry.save();
      req.flash('success_msg', 'Country has been added successfully');
    }

  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/country')
}

exports.deleteCountry = async (req, res, next) => {
  try {
    const id = req.params.id
    let countryInfo = await Country.findOne({ is_deleted: 0, _id: id })
    if (!countryInfo) {
      req.flash('error_msg', 'Country does not exist.');
      return res.redirect('/admin/country')
    }
    //let check = await User
    var countryInUse = await userModel.find({ country: id });
    if (countryInUse.length > 0) {
      req.flash('error_msg', 'Country is in use so you could not remove this record.');
      return res.redirect('/admin/country')
    }
    await Country.updateOne({ _id: id }, { is_deleted: 1 })
    req.flash('success_msg', 'Country removed successfully.');
  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/country')
}

exports.getStateList = async (req, res, next) => {
  let data = commonController.getCommonParams('State List', req);
  var totalRecords = 0
  try {
    let findCond = { is_deleted: 0 }
    let filterDatas = data.filterDatas;
    var pageNo = (data.filterDatas.page_no && data.filterDatas.page_no > 1) ? data.filterDatas.page_no : 1
    if (req.body.filter == 1) {
      if (filterDatas.search_text) {
        findCond.name = { '$regex': filterDatas.search_text, '$options': 'i' }
      }
      if (filterDatas.is_active) {
        findCond.is_active = filterDatas.is_active
      }
    }
    totalRecords = await State.countDocuments(findCond);
    let list = []
    if (totalRecords > 0) {
      var skip = 0
      var pageRecordLimit = 20
      if (pageNo > 0) {
        skip = (parseInt(pageNo) - 1) * pageRecordLimit
      }
      let statelist = await State.find(findCond).populate({
        path: 'country',
        select: { "name": 1 }
      }).limit(pageRecordLimit).skip(skip).sort({ name: 1 })
      //console.log(statelist)
      if (statelist.length > 0) {
        for (var i = 0; i < statelist.length; i++) {
          list.push({
            _id: statelist[i]._id,
            name: statelist[i].name,
            local_name: statelist[i].local_name,
            country_id: (statelist[i].country) ? statelist[i].country._id : '',
            country_name: (statelist[i].country) ? statelist[i].country.name : '',
            is_active: statelist[i].is_active
          })
        }
      }
    }
    //console.log(list)
    data.records = list
    data.current = pageNo;
    data.totalRecords = totalRecords;
    data.pages = Math.ceil(totalRecords / pageRecordLimit)
  } catch (e) {
    req.flash('danger', e.message)
  }

  res.render('admin/state_list', { layout: layout.admin.session_with, data });
}

exports.getCreateStateView = async (req, res, next) => {
  let data = commonController.getCommonParams('Add New State', req);
  let countrylist = await Country.find({ is_deleted: 0, is_active: 1 })
  data.countrylist = countrylist
  data.details = {
    _id: '',
    name: '',
    local_name: '',
    country: ''
  }
  res.render('admin/state_form', { layout: layout.admin.session_with, data });
}

exports.getUpdateStateView = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Country', req);
  let countrylist = await Country.find({ is_deleted: 0, is_active: 1 })
  data.countrylist = countrylist
  var stateId = req.params.id
  let stateInfo = await State.findOne({ _id: stateId, is_deleted: 0 })
  if (!stateInfo) {
    req.flash('error_msg', 'State does not exist');
    res.redirect('/admin/states')
  }
  data.details = stateInfo
  res.render('admin/state_form', { layout: layout.admin.session_with, data });
}

exports.manageState = async (req, res, next) => {
  //console.log(req.body)
  try {
    const id = req.body.id
    let checkStateCond = { is_deleted: 0, name: req.body.name }
    if (id) {
      checkStateCond._id = { $ne: id }
    }
    const check = await State.findOne(checkStateCond);
    if (check) {
      req.flash('error_msg', 'Sorry! this State name already exists, Please try with some other name.');
      return res.redirect('/admin/states')
    }
    if (id) {
      let stateInfo = await State.findOne({ is_deleted: 0, _id: id })
      if (!stateInfo) {
        req.flash('error_msg', 'State does not exist.');
        return res.redirect('/admin/states')
      }
      stateInfo.name = req.body.name
      stateInfo.local_name = req.body.local_name
      stateInfo.country = req.body.country
      stateInfo.updated_by = req.user._id
      stateInfo.is_active = (req.body.is_active === '1') ? req.body.is_active : 0


      await stateInfo.save();
      req.flash('success_msg', 'State has been updated successfully');
    } else {
      let newState = new State({
        name: req.body.name,
        local_name: req.body.local_name,
        country: req.body.country,
        updated_by: req.user._id
      });
      newState.is_active = (req.body.is_active === '1') ? req.body.is_active : 0

      await newState.save();
      req.flash('success_msg', 'State has been added successfully');
    }

  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/states')
}

exports.deleteState = async (req, res, next) => {
  try {
    const id = req.params.id
    let stateInfo = await State.findOne({ is_deleted: 0, _id: id })
    if (!stateInfo) {
      req.flash('error_msg', 'State does not exist.');
      return res.redirect('/admin/states')
    }
    //let check = await User
    var stateInUse = await userModel.find({ state: id });
    if (stateInUse.length > 0) {
      req.flash('error_msg', 'State is in use so you could not remove this record.');
      return res.redirect('/admin/states')
    }
    await State.updateOne({ _id: id }, { is_deleted: 1 })
    req.flash('success_msg', 'State removed successfully.');
  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/states')
}

exports.importStateList = async (req, res, next) => {
  const userId = req.user._id
  let statelist = JSON.parse(fs.readFileSync(`${uploadPath}/states.json`))
  //console.log(statelist)
  let states = []
  if (statelist.length > 0) {
    for (var s = 0; s < statelist.length; s++) {
      states.push({
        name: statelist[s].State,
        local_name: statelist[s].Abbrev,
        //local_name:statelist[s].Abbrev,
        code_name: statelist[s].Code,
        country: '611008e44829e60f23f18204',
        updated_by: userId
      })
    }
  }
  if (states.length > 0) {
    await State.insertMany(states)
  }
  res.redirect('/admin/states')
}


//ConsumptionFrequency

exports.getConsumptionFrequencyList = async (req, res, next) => {
  let data = commonController.getCommonParams('Consumption Frequency List', req);
  var totalRecords = 0
  try {
    let findCond = { is_deleted: 0 }
    let filterDatas = data.filterDatas;
    var pageNo = (data.filterDatas.page_no && data.filterDatas.page_no > 1) ? data.filterDatas.page_no : 1
    if (req.body.filter == 1) {
      if (filterDatas.search_text) {
        findCond.name = { '$regex': filterDatas.search_text, '$options': 'i' }
      }
      if (filterDatas.is_active) {
        findCond.is_active = filterDatas.is_active
      }
    }
    totalRecords = await ConsumptionFrequency.countDocuments(findCond);
    let list = []
    if (totalRecords > 0) {
      var skip = 0
      var pageRecordLimit = 20
      if (pageNo > 0) {
        skip = (parseInt(pageNo) - 1) * pageRecordLimit
      }
      let frequencylist = await ConsumptionFrequency.find(findCond).limit(pageRecordLimit).skip(skip).sort({ name: 1 })
      //console.log(frequencylist)
      if (frequencylist.length > 0) {
        for (var i = 0; i < frequencylist.length; i++) {
          list.push({
            _id: frequencylist[i]._id,
            name: frequencylist[i].name,
            is_active: frequencylist[i].is_active
          })
        }
      }
    }
    //console.log(list)
    data.records = list
    data.current = pageNo;
    data.totalRecords = totalRecords;
    data.pages = Math.ceil(totalRecords / pageRecordLimit)
  } catch (e) {
    req.flash('danger', e.message)
  }

  res.render('admin/consumption_frequency_list', { layout: layout.admin.session_with, data });
}

exports.getCreateConsumptionFrequencyView = async (req, res, next) => {
  let data = commonController.getCommonParams('Add New Consumption Frequency', req);

  data.details = {
    _id: '',
    name: ''
  }
  res.render('admin/consumption_frequency_form', { layout: layout.admin.session_with, data });
}

exports.getUpdateConsumptionFrequencyView = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Consumption Frequency', req);

  var frequencyId = req.params.id
  let frequencyInfo = await ConsumptionFrequency.findOne({ _id: frequencyId, is_deleted: 0 })
  if (!frequencyInfo) {
    req.flash('error_msg', 'Consumption frequency does not exist');
    res.redirect('/admin/consumption-frequency')
  }
  data.details = frequencyInfo
  res.render('admin/consumption_frequency_form', { layout: layout.admin.session_with, data });
}

exports.manageConsumptionFrequency = async (req, res, next) => {
  //console.log(req.body)
  try {
    const id = req.body.id
    let checkCond = { is_deleted: 0, name: req.body.name }
    if (id) {
      checkCond._id = { $ne: id }
    }
    const check = await ConsumptionFrequency.findOne(checkCond);
    if (check) {
      req.flash('error_msg', 'Sorry! this name already exists, Please try with some other name.');
      return res.redirect('/admin/consumption-frequency')
    }
    if (id) {
      let frequencyInfo = await ConsumptionFrequency.findOne({ is_deleted: 0, _id: id })
      if (!frequencyInfo) {
        req.flash('error_msg', 'Consumption frequency does not exist.');
        return res.redirect('/admin/consumption-frequency')
      }
      frequencyInfo.name = req.body.name
      frequencyInfo.updated_by = req.user._id
      frequencyInfo.is_active = (req.body.is_active === '1') ? req.body.is_active : 0


      await frequencyInfo.save();
      req.flash('success_msg', 'Consumption frequency has been updated successfully');
    } else {
      let newFrequency = new ConsumptionFrequency({
        name: req.body.name,
        updated_by: req.user._id
      });
      newFrequency.is_active = (req.body.is_active === '1') ? req.body.is_active : 0

      await newFrequency.save();
      req.flash('success_msg', 'Consumption frequency has been added successfully');
    }

  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/consumption-frequency')
}

exports.deleteConsumptionFrequency = async (req, res, next) => {
  try {
    const id = req.params.id
    let info = await ConsumptionFrequency.findOne({ is_deleted: 0, _id: id })
    if (!info) {
      req.flash('error_msg', 'Consumption frequency does not exist.');
      return res.redirect('/admin/consumption-frequency')
    }
    //let check = await User
    var checkInUse = await userModel.find({ cannabis_consumption: id });
    if (checkInUse.length > 0) {
      req.flash('error_msg', 'Consumption frequency is in use so you could not remove this record.');
      return res.redirect('/admin/consumption-frequency')
    }
    await ConsumptionFrequency.updateOne({ _id: id }, { is_deleted: 1 })
    req.flash('success_msg', 'Consumption frequency removed successfully.');
  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/consumption-frequency')
}

// Consumption Reason

exports.getConsumptionReasonList = async (req, res, next) => {
  let data = commonController.getCommonParams('Consumption Reason List', req);
  var totalRecords = 0
  try {
    let findCond = { is_deleted: 0 }
    let filterDatas = data.filterDatas;
    var pageNo = (data.filterDatas.page_no && data.filterDatas.page_no > 1) ? data.filterDatas.page_no : 1
    if (req.body.filter == 1) {
      if (filterDatas.search_text) {
        findCond.name = { '$regex': filterDatas.search_text, '$options': 'i' }
      }
      if (filterDatas.is_active) {
        findCond.is_active = filterDatas.is_active
      }
    }
    totalRecords = await ConsumptionReason.countDocuments(findCond);
    let list = []
    if (totalRecords > 0) {
      var skip = 0
      var pageRecordLimit = 20
      if (pageNo > 0) {
        skip = (parseInt(pageNo) - 1) * pageRecordLimit
      }
      let frequencylist = await ConsumptionReason.find(findCond).limit(pageRecordLimit).skip(skip).sort({ name: 1 })
      //console.log(frequencylist)
      if (frequencylist.length > 0) {
        for (var i = 0; i < frequencylist.length; i++) {
          list.push({
            _id: frequencylist[i]._id,
            name: frequencylist[i].name,
            is_active: frequencylist[i].is_active
          })
        }
      }
    }
    //console.log(list)
    data.records = list
    data.current = pageNo;
    data.totalRecords = totalRecords;
    data.pages = Math.ceil(totalRecords / pageRecordLimit)
  } catch (e) {
    req.flash('danger', e.message)
  }

  res.render('admin/consumption_reason_list', { layout: layout.admin.session_with, data });
}

exports.getCreateConsumptionReasonView = async (req, res, next) => {
  let data = commonController.getCommonParams('Add New Consumption Frequency', req);

  data.details = {
    _id: '',
    name: ''
  }
  res.render('admin/consumption_reason_form', { layout: layout.admin.session_with, data });
}

exports.getUpdateConsumptionReasonView = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Consumption Frequency', req);

  var frequencyId = req.params.id
  let frequencyInfo = await ConsumptionReason.findOne({ _id: frequencyId, is_deleted: 0 })
  if (!frequencyInfo) {
    req.flash('error_msg', 'Consumption frequency does not exist');
    res.redirect('/admin/consumption-reason')
  }
  data.details = frequencyInfo
  res.render('admin/consumption_reason_form', { layout: layout.admin.session_with, data });
}

exports.manageConsumptionReason = async (req, res, next) => {
  //console.log(req.body)
  try {
    const id = req.body.id
    let checkCond = { is_deleted: 0, name: req.body.name }
    if (id) {
      checkCond._id = { $ne: id }
    }
    const check = await ConsumptionReason.findOne(checkCond);
    if (check) {
      req.flash('error_msg', 'Sorry! this name already exists, Please try with some other name.');
      return res.redirect('/admin/consumption-reason')
    }
    if (id) {
      let frequencyInfo = await ConsumptionReason.findOne({ is_deleted: 0, _id: id })
      if (!frequencyInfo) {
        req.flash('error_msg', 'Consumption frequency does not exist.');
        return res.redirect('/admin/consumption-reason')
      }
      frequencyInfo.name = req.body.name
      frequencyInfo.updated_by = req.user._id
      frequencyInfo.is_active = (req.body.is_active === '1') ? req.body.is_active : 0


      await frequencyInfo.save();
      req.flash('success_msg', 'Consumption frequency has been updated successfully');
    } else {
      let newFrequency = new ConsumptionReason({
        name: req.body.name,
        updated_by: req.user._id
      });
      newFrequency.is_active = (req.body.is_active === '1') ? req.body.is_active : 0

      await newFrequency.save();
      req.flash('success_msg', 'Consumption frequency has been added successfully');
    }

  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/consumption-reason')
}

exports.deleteConsumptionReason = async (req, res, next) => {
  try {
    const id = req.params.id
    let info = await ConsumptionReason.findOne({ is_deleted: 0, _id: id })
    if (!info) {
      req.flash('error_msg', 'Consumption frequency does not exist.');
      return res.redirect('/admin/consumption-reason')
    }
    //let check = await User
    var checkInUse = await userModel.find({ cannabis_consumption: id });
    if (checkInUse.length > 0) {
      req.flash('error_msg', 'Consumption frequency is in use so you could not remove this record.');
      return res.redirect('/admin/consumption-reason')
    }
    await ConsumptionReason.updateOne({ _id: id }, { is_deleted: 1 })
    req.flash('success_msg', 'Consumption frequency removed successfully.');
  } catch (e) {
    console.log(e)
    req.flash('error_msg', e.message)
  }
  res.redirect('/admin/consumption-reason')
}

exports.getMyEntourageSettings = async (req, res, next) => {
  let data = commonController.getCommonParams('My Entourage Settings', req);
  let myEntourage = await SettingsMyEntourage.find({ is_deleted: 0 })
  
  data.entourage = myEntourage
  res.render('admin/my_entourage', { layout: layout.admin.session_with, data });
}

exports.updateMyEntourageSettingsForm = async (req, res, next) => {
  let data = commonController.getCommonParams('My Entourage Settings', req);
  var id = req.query.id;
  let myEntourage = await SettingsMyEntourage.findOne({ is_deleted: 0, _id: id })

  data.entourage = myEntourage
  res.render('admin/my_entourage_update', { layout: layout.admin.session_with, data });
}

exports.updateMyEntourageSettings = async (req, res, next) => {
  let data = commonController.getCommonParams('My Entourage Settings', req);
  var id = req.body.id;
  var entourage_image = req.files.entourage_image;
  let myEntourage = await SettingsMyEntourage.findOne({ is_deleted: 0, _id: id})
  //Crop Image
  const imagePath = uploadPath + '/entourage/' + req.files.entourage_image[0].filename;

  const entourageImage = {
    file: req.files.entourage_image[0],
    type: 'entourage_image',
    imagePath: imagePath,
    width: 750,
    height: 500
  }
  const response = await s3Upload(entourageImage);
  if (response) {
    myEntourage.image = req.files.entourage_image[0].filename;
  }

  CommonHelper.unlinkFile(imagePath)

  await myEntourage.save()
  
  return res.redirect('/admin/settings/my-entourage');
}