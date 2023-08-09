const layout = require('../../config/layout');
const commonController = require('./commonController');
const User = require('../models/usersModel');
const physiqueModel = require('../models/physiqueModel');
const symptomModel = require('../models/symptomModel');
const effectModel = require('../models/effectModel');
const moment = require('moment');
const activityModel = require('../models/activityModel');
const cannabinoidModel = require('../models/cannabinoidModel');
const strainsModel = require('../models/strainsModel');
const userDiaryModel = require('../models/userDiaryModel');
const CommunityQuestion = require('../models/communityQuestionsModel');
const CommonHelper = require('../utils/commonHelper');
const Country = require('../models/countryModel');
const State = require('../models/stateModel');
const Condition = require('../models/conditionModel');
const ConsumptionFrequency = require('../models/consumptionFrequencyModel');
const NotifyHelper = require('../utils/notifyHelper');
const { userAccountDeleteMail } = require('../utils/mailHelper');
const path = require('path');
const uploadPath = path.resolve(__dirname, '../../public/uploads');
const { s3Upload, s3Remove } = require('../utils/AWS');
const Excel = require('exceljs');

exports.getUserList = async (req, res, next) => {
  let data = commonController.getCommonParams('User List', req);
  const filterDatesObj = {
    selected: data.filterDatas.filterDateType,
    dateRange: data.filterDatas.daterange,
  };
  const returnDate = commonController.getFilterDates(filterDatesObj);
  const dateRange = commonController.dateRangeArray();
  var totalRecords = 0;
  try {
    let list = [];
    let findCond = {
      $and: [
        { user_type: 2, is_deleted: 0 },
        {
          created_at: {
            $gte: moment(returnDate.startDate).format(),
            $lt: moment(returnDate.endDate).format(),
          },
        },
      ],
    };

    // let findCond = { user_type: 2, is_deleted: 0 };
    var pageNo = data.filterDatas.page_no && data.filterDatas.page_no > 1 ? data.filterDatas.page_no : 1;
    let filterDatas = data.filterDatas;
    if (req.body.filter == 1) {
      if (filterDatas.full_name) {
        findCond.full_name = { $regex: filterDatas.full_name, $options: 'i' };
      }
      if (filterDatas.email) {
        findCond.email = { $regex: filterDatas.email, $options: 'i' };
      }
      if (filterDatas.contact_no) {
        let escape_string = CommonHelper.regexEscape(filterDatas.contact_no);
        findCond.contact_no = { $regex: escape_string.concat('.*'), $options: 'si' };
      }
    }
    const totalRecords = await User.countDocuments(findCond);

    if (totalRecords > 0) {
      var skip = 0;
      var pageRecordLimit = 20;
      if (pageNo > 0) {
        skip = (parseInt(pageNo) - 1) * pageRecordLimit;
      }
      let userList = await User.find(findCond).limit(pageRecordLimit).skip(skip).sort({ created_at: -1 });
      if (userList.length > 0) {
        // var profileImgPath = req.protocol + '://' + req.get('host') + '/uploads/profile_image/'
        var profileImgPath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/';
        for (var i = 0; i < userList.length; i++) {
          list.push({
            _id: userList[i]._id,
            name: userList[i].full_name,
            email: userList[i].email,
            contact_no: userList[i].contact_no,
            profile_image: userList[i].profile_image ? profileImgPath + userList[i].profile_image : '',
            is_active: userList[i].is_active,
            created_at: moment(userList[i].created_at).format(' Do MMM YY'),
          });
        }
      }
    }
    data.records = list;
    data.dateRange = dateRange;
    
    //now calculate the pagination section
    data.current = pageNo;
    data.totalRecords = totalRecords;
    data.pages = Math.ceil(totalRecords / pageRecordLimit);
  } catch (e) {
    req.flash('danger', e.message);
  }
  res.render('admin/userlist', { layout: layout.admin.session_with, data });
};

exports.userUpdate = async (req, res, next) => {
  let data = commonController.getCommonParams('Edit User', req);
  // let profileImgPath = req.protocol + '://' + req.get('host') + '/uploads/profile_image/'
  let profileImgPath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/';
  const userId = req.params.id;
  let physiques = await physiqueModel.find({ is_deleted: 0 }).sort({ name: 1 });
  let symptoms = await symptomModel.find({ is_deleted: 0 }).sort({ name: 1 });
  let effects = await effectModel.find({ is_deleted: 0 }).sort({ name: 1 });
  let activities = await activityModel.find({ is_deleted: 0 }).sort({ name: 1 });
  let cannabinoids = await cannabinoidModel.find({ is_deleted: 0 }).sort({ name: 1 });
  let strains = await strainsModel.find({ is_deleted: 0 }).sort({ name: 1 });
  let conditions = await Condition.find({ is_deleted: 0 }).sort({ name: 1 }).select({ name: 1 });
  let country = await Country.find({ is_deleted: 0 }).sort({ name: 1 }).select({ name: 1 });
  let states = await State.find({ is_deleted: 0 }).sort({ name: 1 }).select({ name: 1 });
  let cannabis_consumption = await ConsumptionFrequency.find({ is_deleted: 0, is_active: 1 }).select({ name: 1 }).sort({ name: 1 });
  let userInfo = await User.findOne({ _id: userId, is_deleted: 0 }).populate({
    path: 'state',
    select: { name: 1 },
    populate: {
      path: 'country',
      select: { name: 1 },
    },
  });
  let userDetails = userInfo.toObject();
  if (userInfo.state) {
    userDetails.state_name = userInfo.state.name;
    userDetails.state = userInfo.state._id;
    if (userInfo.state.country) {
      userDetails.country_name = userInfo.state.country.name;
      userDetails.country = userInfo.state.country._id;
    }
  }
  data.physiques = physiques;
  data.symptoms = symptoms;
  data.effects = effects;
  data.activities = activities;
  data.cannabinoids = cannabinoids;
  data.strains = strains;
  data.conditions = conditions;
  data.country = country;
  data.states = states;
  data.cannabisConsumption = cannabis_consumption;
  let selectedSymptomArr = [];
  for (let index in userInfo.symptoms) {
    selectedSymptomArr.push(userInfo.symptoms[index].symptom_id.toString());
  }
  let selectedEffectArr = [];
  for (let index in userInfo.effects) {
    selectedEffectArr.push(userInfo.effects[index].effect_id.toString());
  }
  let selectedActivitiesArr = [];
  for (let index in userInfo.activities) {
    selectedActivitiesArr.push(userInfo.activities[index].activity_id.toString());
  }
  let selectedCannabinoidsArr = [];
  for (let index in userInfo.cannabinoids) {
    selectedCannabinoidsArr.push(userInfo.cannabinoids[index].cannabinoid_id.toString());
  }
  let selectedConditionsArr = [];
  for (let index in userInfo.conditions) {
    selectedConditionsArr.push(userInfo.conditions[index].condition_id.toString());
  }
  let activityLevel = ['Not active', 'Slightly Active', 'Somewhat active', 'Quite active', 'Very active'];
  let wScaleList = ['kg', 'lb'];
  let weightScales = [];
  for (var index in wScaleList) {
    weightScales.push({ name: wScaleList[index] });
  }
  data.weight_scales = weightScales;

  let hScaleList = ['cm', 'ft'];
  let heightScales = [];
  for (var index in hScaleList) {
    heightScales.push({ name: hScaleList[index] });
  }
  data.height_scales = heightScales;

  data.details = userDetails;
  data.selectedSymptomArr = selectedSymptomArr;
  data.selectedEffectArr = selectedEffectArr;
  data.selectedActivitiesArr = selectedActivitiesArr;
  data.selectedCannabinoidsArr = selectedCannabinoidsArr;
  data.selectedConditionsArr = selectedConditionsArr;
  data.activity_level = activityLevel;
  data.profileImg = userInfo.profile_image.length > 0 ? profileImgPath + userInfo.profile_image : '';
  res.render('admin/useredit', { layout: layout.admin.session_with, data });
};

exports.manageUserUpdate = async (req, res, next) => {
  //console.log(req.body)
  try {
    const userId = req.body.id;
    if (userId) {
      let email = req.body.email;
      let userCheckEmail = await User.find({ email: email, _id: { $ne: userId } });
      if (userCheckEmail.length == 0) {
        let userInfo = await User.findById(userId);
        if (req.file) {
          if (userInfo.profile_image) {
            const removeImage = {
              imgName: userInfo.profile_image,
              type: 'profile_image',
            };
            await s3Remove(removeImage);
          }

          const imagePath = uploadPath + '/profile_image/' + req.file.filename;
          const profileImage = {
            file: req.file,
            type: 'profile_image',
          };
          const response = await s3Upload(profileImage);
          if (response) {
            userInfo.profile_image = req.file.filename;
          }
          CommonHelper.unlinkFile(imagePath);
        }
        userInfo.full_name = req.body.full_name;
        userInfo.email = req.body.email;
        userInfo.contact_no = req.body.contact_no;
        userInfo.dob = req.body.dob;
        userInfo.gender = req.body.gender;
        userInfo.physique = req.body.physique;
        userInfo.state = req.body.state;
        userInfo.country = req.body.country;
        userInfo.zipcode = req.body.zipcode;
        userInfo.activity_level = req.body.activity_level;
        userInfo.cannabis_consumption = req.body.cannabis_consumption;
        let symptomsArr = [];
        for (let index in req.body.symptoms) {
          symptomsArr.push({ symptom_id: req.body.symptoms[index] });
        }
        let effectsArr = [];
        for (let index in req.body.effects) {
          effectsArr.push({ effect_id: req.body.effects[index] });
        }
        let cannabinoidsArr = [];
        for (let index in req.body.cannabinoids) {
          cannabinoidsArr.push({ cannabinoid_id: req.body.cannabinoids[index] });
        }
        let activitiesArr = [];
        for (let index in req.body.activities) {
          activitiesArr.push({ activity_id: req.body.activities[index] });
        }
        let conditionsArr = [];
        for (let index in req.body.conditions) {
          conditionsArr.push({ condition_id: req.body.conditions[index] });
        }
        if (req.body.height) {
          userInfo.height = req.body.height;
        }
        if (req.body.height_scale) {
          userInfo.height_scale = req.body.height_scale;
        }
        if (req.body.weight) {
          userInfo.weight = req.body.weight;
        }
        if (req.body.weight_scale) {
          userInfo.weight_scale = req.body.weight_scale;
        }
        userInfo.symptoms = symptomsArr;
        userInfo.effects = effectsArr;
        userInfo.cannabinoids = cannabinoidsArr;
        userInfo.activities = activitiesArr;
        userInfo.conditions = conditionsArr;
        userInfo.favourite_strains = req.body.favourite_strains;
        userInfo.is_active = req.body.is_active ? 1 : 0;
        await userInfo.save();
        req.flash('success_msg', 'User data has been updated successfully');
      } else {
        req.flash('error_msg', 'Email already exists!');
      }
    }
  } catch (e) {
    // console.log(e)
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/userlist');
};

exports.blockUnblockUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    let userInfo = await User.findById(userId);
    userInfo.is_active = userInfo.is_active == 1 ? 0 : 1;
    await userInfo.save();
    req.flash('success_msg', 'User status has been updated successfully');
    res.redirect('/admin/userlist');
  } catch (e) {
    // console.log(e)
    req.flash('error_msg', e.message);
  }
};

exports.deleteUser = async (req, res, next) => {
  //console.log(req.params.id)
  const userId = req.params.id;
  let userDetails = await User.findById(userId);
  if (!userDetails) {
    req.flash('error_msg', 'User does not exist');
    return res.redirect('/admin/userlist');
  }
  if (userDetails.is_deleted == 1) {
    req.flash('error_msg', 'This user account does not exist');
    return res.redirect('/admin/userlist');
  }
  userDetails.is_deleted = 1;
  userDetails.deleted_at = new Date();
  userDetails.token = '';
  await userDetails.save();
  updRes = await userDiaryModel.updateMany({ user: userId }, { is_deleted: 1 });
  //console.log(updRes.nModified)
  await CommunityQuestion.updateMany({ user: userId }, { is_deleted: 1 });
  if (userDetails.device_push_key) {
    NotifyHelper.sendPush(userDetails.device_push_key, 'Your TCD account has been deleted by administrator', '9');
  }
  let emailData = {
    email: userDetails.email,
    name: userDetails.full_name,
  };
  userAccountDeleteMail(emailData);
  req.flash('success_msg', 'User account has been deleted succesfully');
  res.redirect('/admin/userlist');
};

exports.bulkUserDelete = async (req, res, next) => {
  //console.log(req.body.selected_users)
  var selectedUsers = req.body.selected_users;
  //console.log(selectedUsers)
  let deletingUsers = await User.find({ _id: { $in: selectedUsers } }).select({
    email: 1,
    full_name: 1,
  });

  await User.updateMany({ _id: { $in: selectedUsers } }, { is_deleted: 1 });
  await userDiaryModel.updateMany({ user: { $in: selectedUsers } }, { is_deleted: 1 });
  await CommunityQuestion.updateMany({ user: { $in: selectedUsers } }, { is_deleted: 1 });
  //req.flash('success_msg','Users removed successfully')
  //res.redirect('/admin/userlist')
  if (deletingUsers.length > 0) {
    for (var u = 0; u < deletingUsers.length; u++) {
      var emailData = {
        email: deletingUsers[u].email,
        name: deletingUsers[u].full_name,
      };
      userAccountDeleteMail(emailData);
    }
  }
  res.send({ status: 1, message: 'Users removed successfully' });
};

exports.exportUserInformation = async (req, res, next) => {
  const userId = req.params.id;
  let userInfo = await User.findById(userId)
    .populate({
      path: 'state',
      select: { name: 1 },
      populate: { path: 'country', select: { name: 1 } },
    })
    .populate({
      path: 'cannabis_consumption',
      select: { name: 1 },
    })
    .populate({
      path: 'physique',
      select: { name: 1 },
    })
    .populate({
      path: 'favourite_strains',
      select: { name: 1 },
    })
    .populate({
      path: 'effects.effect_id',
      select: { name: 1 },
    })
    .populate({
      path: 'symptoms.symptom_id',
      select: { name: 1 },
    })
    .populate({
      path: 'activities.activity_id',
      select: { name: 1 },
    })
    .populate({
      path: 'conditions.condition_id',
      select: { name: 1 },
    })
    .populate({
      path: 'cannabinoids.cannabinoid_id',
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
      height: 1,
      height_scale: 1,
      weight: 1,
      weight_scale: 1,
      activity_level: 1,
    });
  console.log({ userInfo });
  var userDetails = userInfo.toObject();
  userDetails.profile_image = userInfo.profile_image ? req.protocol + '://' + req.get('host') + '/uploads/profile_image/' + userInfo.profile_image : '';
  userDetails.height = userInfo.height ? userInfo.height + ' ' + userInfo.height_scale : '';
  userDetails.weight = userInfo.weight ? userInfo.weight + ' ' + userInfo.weight_scale : '';
  userDetails.dob = userInfo.dob ? CommonHelper.formatedDate(userInfo.dob, 7) : '';

  userDetails.state = userInfo.state ? userInfo.state.name : '';
  userDetails.country = userInfo.state ? userInfo.state.country.name : '';

  userDetails.cannabis_consumption = userInfo.cannabis_consumption ? userInfo.cannabis_consumption.name : '';

  userDetails.favourite_strains = userInfo.favourite_strains ? userInfo.favourite_strains.name : '';

  var symptomStr = '';
  if (userDetails.symptoms) {
    for (var i = 0; i < userDetails.symptoms.length; i++) {
      symptomStr += userDetails.symptoms[i].symptom_id.name + ', ';
    }
  }
  userDetails.symptoms = symptomStr;

  var effectsStr = '';
  if (userDetails.effects) {
    for (var i = 0; i < userDetails.effects.length; i++) {
      effectsStr += userDetails.effects[i].effect_id.name + ', ';
    }
  }
  userDetails.effects = effectsStr;

  var cannabinoidsStr = '';
  if (userDetails.cannabinoids) {
    for (var i = 0; i < userDetails.cannabinoids.length; i++) {
      cannabinoidsStr += userDetails.cannabinoids[i].cannabinoid_id.name;
    }
  }
  userDetails.cannabinoids = cannabinoidsStr;

  var activityStr = '';
  if (userDetails.activities) {
    for (var i = 0; i < userDetails.activities.length; i++) {
      activityStr += userDetails.activities[i].activity_id.name + ', ';
    }
  }
  userDetails.activities = activityStr;

  let conditionsStr = '';
  if (userDetails.conditions) {
    for (var i = 0; i < userDetails.conditions.length; i++) {
      conditionsStr += userDetails.conditions[i].condition_id.name + ', ';
    }
  }
  userDetails.conditions = conditionsStr;

  // console.log(userDetails)
  var workbook = new Excel.Workbook();
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible',
    },
  ];
  var worksheet = workbook.addWorksheet('User Information');
  worksheet.columns = [
    { header: 'Name', key: 'full_name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'State', key: 'state', width: 25 },
    { header: 'Country', key: 'country', width: 20 },
    { header: 'Zipcode', key: 'zipcode', width: 10 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Height', key: 'height', width: 10 },
    { header: 'Weight', key: 'weight', width: 10 },
    { header: 'Date of Birth', key: 'dob', width: 10 },
    { header: 'Favourite Strain', key: 'favourite_strains', width: 10 },
    { header: 'Consumption Type', key: 'cannabinoids', width: 10 },
    { header: 'Consumption Frequency', key: 'cannabis_consumption', width: 25 },
    { header: 'Activity Level', key: 'activity_level', width: 10 },
    { header: 'Activity', key: 'activities', width: 10 },
    { header: 'Symptoms', key: 'symptoms', width: 10 },
    { header: 'Conditions', key: 'conditions', width: 10 },
    { header: 'Effects', key: 'effects', width: 10 },
  ];

  worksheet.addRow(userDetails);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=' + 'user_information.xlsx');
  workbook.xlsx.write(res).then(function (data) {
    res.end();
  });
};

// exports.exportAllUserInformation = async (req, res, next) => {
// 	let userInfo = await User.find()
// 	.populate({
// 		path: 'state',
// 		select: { "name": 1 },
// 		populate: { path: "country", select: { "name": 1 } }
// 	})
// 	// .populate({
// 	// 	path: 'cannabis_consumption',
// 	// 	select: { "name": 1 }
// 	// })
// 	.populate({
// 		path: 'physique',
// 		select: { "name": 1 }
// 	})
// 	// .populate({
// 	// 	path: "favourite_strains",
// 	// 	select: { "name": 1 }
// 	// })
// 	.populate({
// 		path: 'effects.effect_id', select: { "name": 1 }
// 	})
// 	.populate({
// 		path: 'symptoms.symptom_id', select: { "name": 1 }
// 	})
// 	.populate({
// 		path: 'activities.activity_id', select: { "name": 1 }
// 	})
// 	.populate({
// 		path: 'conditions.condition_id', select: { "name": 1 }
// 	})
// 	.populate({
// 		path: 'cannabinoids.cannabinoid_id', select: { "name": 1 }
// 	})
// 	.select({
// 		"email": 1,
// 		"full_name": 1,
// 		"profile_image": 1,
// 		"contact_no": 1,
// 		"user_type": 1, "gender": 1, "dob": 1,
// 		"city": 1, "state": 1, "country": 1, "address": 1, "zipcode": 1, "cannabis_consumption": 1, "favourite_strains": 1,
// 		"is_active": 1,
// 		"height": 1, "height_scale": 1, "weight": 1, "weight_scale": 1, "activity_level": 1
// 	})
// 	console.log(userInfo, "Woithout to Object")
// 	console.log( "--------------------------------------")
// 	console.log(userInfo.JSON(), "with to Object")
// 	console.log( "--------------------------------------")

// 	var userDetails = userInfo;
// 	userDetails.profile_image = (userInfo.profile_image) ? req.protocol + '://' + req.get('host') + '/uploads/profile_image/' + userInfo.profile_image : '';
// 	userDetails.height = (userInfo.height) ? userInfo.height + ' ' + userInfo.height_scale : ''
// 	userDetails.weight = (userInfo.weight) ? userInfo.weight + ' ' + userInfo.weight_scale : ''
// 	userDetails.dob = (userInfo.dob) ? CommonHelper.formatedDate(userInfo.dob, 7) : ''

// 	userDetails.state = (userInfo.state) ? userInfo.state.name : ''
// 	userDetails.country = (userInfo.state) ? userInfo.state.country.name : ''

// 	userDetails.cannabis_consumption = (userInfo.cannabis_consumption) ? userInfo.cannabis_consumption.name : ''

// 	userDetails.favourite_strains = (userInfo.favourite_strains) ? userInfo.favourite_strains.name : ''

// 	var symptomStr = ''
// 	if (userDetails.symptoms) {
// 		for (var i = 0; i < userDetails.symptoms.length; i++) {
// 			symptomStr += userDetails.symptoms[i].symptom_id.name + ', '

// 		}
// 	}
// 	userDetails.symptoms = symptomStr

// 	var effectsStr = ''
// 	if (userDetails.effects) {
// 		for (var i = 0; i < userDetails.effects.length; i++) {
// 			effectsStr += userDetails.effects[i].effect_id.name + ', '
// 		}
// 	}
// 	userDetails.effects = effectsStr

// 	var cannabinoidsStr = ''
// 	if (userDetails.cannabinoids) {
// 		for (var i = 0; i < userDetails.cannabinoids.length; i++) {
// 			cannabinoidsStr += userDetails.cannabinoids[i].cannabinoid_id.name
// 		}
// 	}
// 	userDetails.cannabinoids = cannabinoidsStr

// 	var activityStr = ''
// 	if (userDetails.activities) {
// 		for (var i = 0; i < userDetails.activities.length; i++) {
// 			activityStr += userDetails.activities[i].activity_id.name + ', '
// 		}
// 	}
// 	userDetails.activities = activityStr

// 	let conditionsStr = ''
// 	if (userDetails.conditions) {
// 		for (var i = 0; i < userDetails.conditions.length; i++) {
// 			conditionsStr += userDetails.conditions[i].condition_id.name + ', '

// 		}
// 	}
// 	userDetails.conditions = conditionsStr

// 	// console.log(userDetails)
// 	var workbook = new Excel.Workbook();
// 	workbook.views = [
// 		{
// 			x: 0, y: 0, width: 10000, height: 20000,
// 			firstSheet: 0, activeTab: 1, visibility: 'visible'
// 		}
// 	];
// 	var worksheet = workbook.addWorksheet('User Information');
// 	worksheet.columns = [
// 		{ header: 'Name', key: 'full_name', width: 25 },
// 		{ header: 'Email', key: 'email', width: 30 },
// 		{ header: 'State', key: 'state', width: 25 },
// 		{ header: 'Country', key: 'country', width: 20 },
// 		{ header: 'Zipcode', key: 'zipcode', width: 10 },
// 		{ header: 'Gender', key: 'gender', width: 10 },
// 		{ header: 'Height', key: 'height', width: 10 },
// 		{ header: 'Weight', key: 'weight', width: 10 },
// 		{ header: 'Date of Birth', key: 'dob', width: 10 },
// 		{ header: 'Favourite Strain', key: 'favourite_strains', width: 10 },
// 		{ header: 'Consumption Type', key: 'cannabinoids', width: 10 },
// 		{ header: 'Consumption Frequency', key: 'cannabis_consumption', width: 25 },
// 		{ header: 'Activity Level', key: 'activity_level', width: 10 },
// 		{ header: 'Activity', key: 'activities', width: 10 },
// 		{ header: 'Symptoms', key: 'symptoms', width: 10 },
// 		{ header: 'Conditions', key: 'conditions', width: 10 },
// 		{ header: 'Effects', key: 'effects', width: 10 },

// 	];

// 	worksheet.addRows(userDetails);

// 	res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
// 	res.setHeader("Content-Disposition", "attachment; filename=" + "user_information.xlsx");
// 	workbook.xlsx.write(res)
// 		.then(function (data) {
// 			res.end();
// 		});
// }

exports.getUserDiaryList = async (req, res, next) => {
  let data = commonController.getCommonParams('User Diary List', req);
  // console.log({ data });
  var totalRecords = 0;
  // const filterDatesObj = {
  //   selected: data.filterDatas.filterDateType,
  //   dateRange: data.filterDatas.daterange,
  // };
  // const returnDate = commonController.getFilterDates(filterDatesObj);
  // const dateRange = commonController.dateRangeArray();
  // let findCond = {
  //   $and: [
  //     { is_deleted: 0 },
  //     {
  //       created_at: {
  //         $gte: moment(returnDate.startDate).format(),
  //         $lt: moment(returnDate.endDate).format(),
  //       },
  //     },
  //   ],
  // };
  let findCond = { is_deleted: 0 };
  let filterDatas = data.filterDatas;
  let findUserCond = {};
  var pageNo = data.filterDatas.page_no && data.filterDatas.page_no > 1 ? data.filterDatas.page_no : 1;
  if (req.body.filter == 1) {
    if (filterDatas.full_name) {
      findUserCond.full_name = { $regex: filterDatas.full_name, $options: 'i' };
    }
    if (filterDatas.email) {
      findUserCond.email = { $regex: filterDatas.email, $options: 'i' };
    }
    if (filterDatas.is_public) {
      findCond.is_public = filterDatas.is_public;
    }
  }
  totalRecords = await userDiaryModel.countDocuments(findCond);
  let list = [];
  if (totalRecords > 0) {
    var skip = 0;
    var pageRecordLimit = 20;
    if (pageNo > 0) {
      skip = (parseInt(pageNo) - 1) * pageRecordLimit;
    }
    let records = await userDiaryModel
      .find(findCond)
      .populate({
        path: 'user',
        match: findUserCond,
        select: { full_name: 1, email: 1 },
      })
      .populate({
        path: 'product',
        select: { name: 1 },
      })
      .populate({
        path: 'cannabinoid_profile.composition_id',
        select: { name: 1 },
      })
      .populate({
        path: 'terpenes.composition_id',
        select: { name: 1 },
      })
      .populate({
        path: 'pre_symptoms.symptom_id',
        select: { name: 1 },
      })
      .limit(pageRecordLimit)
      .skip(skip)
      .sort({ created_at: -1 });
    if (records.length > 0) {
      for (var r = 0; r < records.length; r++) {
        var cannabinoid_profile = '';
        if (records[r].cannabinoid_profile.length > 0) {
          for (var c = 0; c < records[r].cannabinoid_profile.length; c++) {
            cannabinoid_profile += records[r].cannabinoid_profile[c].composition_id.name + ' - ' + records[r].cannabinoid_profile[c].weight + '%, ';
          }
        }
        var terpenes = '';
        if (records[r].terpenes.length > 0) {
          for (var c = 0; c < records[r].terpenes.length; c++) {
            terpenes += records[r].terpenes[c].composition_id.name + ' - ' + records[r].terpenes[c].weight + '%, ';
          }
        }
        var pre_symptoms = '';
        if (records[r].pre_symptoms.length > 0) {
          for (var c = 0; c < records[r].pre_symptoms.length; c++) {
            pre_symptoms += records[r].pre_symptoms[c].symptom_id.name + ' , ';
          }
        }
        list.push({
          _id: records[r]._id,
          user_name: records[r].user ? records[r].user.full_name : '',
          user_email: records[r].user ? records[r].user.email : '',
          product_name: records[r].product ? records[r].product.name : '',
          day_of_week: records[r].day_of_week,
          is_public: records[r].is_public,
          cannabinoid_profile,
          terpenes,
          pre_symptoms,
          created_at: CommonHelper.formatedDate(records[r].created_at, 6),
        });
      }
    }
  }

  //res.send(records)
  // data.dateRange = dateRange;
  data.records = list;
  data.current = pageNo;
  data.totalRecords = totalRecords;
  data.pages = Math.ceil(totalRecords / pageRecordLimit);
  res.render('admin/userdiarylist', { layout: layout.admin.session_with, data });
};

exports.getUserDiaryView = async (req, res, next) => {
  try {
    let data = commonController.getCommonParams('User Diary Details', req);
    const userDiaryId = req.params.id;
    let userDiaryInfo = await userDiaryModel
      .findById(userDiaryId)
      .populate({
        path: 'user',
      })
      .populate({
        path: 'product',
        select: {
          name: 1,
          description: 1,
        },
        populate: {
          path: 'strain',
          select: { name: 1 },
        },
      })
      .populate({
        path: 'cannabinoid_profile.composition_id',
        select: { name: 1 },
      })
      .populate({
        path: 'terpenes.composition_id',
        select: { name: 1 },
      })
      .populate({
        path: 'pre_symptoms.symptom_id',
        select: { name: 1 },
      })
      .populate({
        path: 'actual_effects.effect_id',
        select: { name: 1 },
      })
      .populate({
        path: 'desired_effects.effect_id',
        select: { name: 1 },
      })
      .populate({
        path: 'pre_activities.activity_id',
        select: { name: 1 },
      })
      .populate({
        path: 'consumption_negative',
        select: { name: 1 },
      })
      .populate({
        path: 'mood_before_consumption',
        select: { name: 1 },
      })
      .populate({
        path: 'strain',
        select: { name: 1 },
      })
      .populate({
        path: 'consumption_method',
        select: { name: 1 },
      });
    //res.send(userDiaryInfo)
    let diaryInfo = userDiaryInfo.toObject();
    diaryInfo.created_at = CommonHelper.formatedDate(diaryInfo.created_at, 6);
    data.userDiaryInfo = diaryInfo;
    res.render('admin/userdiaryview', { layout: layout.admin.session_with, data });
  } catch (e) {
    // console.log(e)
    req.flash('error_msg', e.message);
  }
};
