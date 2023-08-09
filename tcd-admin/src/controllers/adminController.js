const passport = require('passport')
const layout = require('../../config/layout');
const randomstring = require('randomstring')
const commonController = require('./commonController');
const activityModel = require("../models/activityModel");
const cannabinoidModel = require("../models/cannabinoidModel");
const effectModel = require("../models/effectModel");
const physiqueModel = require("../models/physiqueModel");
const symptomModel = require("../models/symptomModel");
const User = require("../models/usersModel");
const userDiaryModel = require("../models/userDiaryModel");
const communityQuestionsModel = require("../models/communityQuestionsModel");
const videoModel = require("../models/videoModel");
const CommonHelper = require('../utils/commonHelper');
const { sendAdminForgotPasswordEmail } = require('../utils/mailHelper')
const path = require('path');
const uploadPath = path.resolve(__dirname, '../../public/uploads');
const bcrypt = require('bcryptjs');
const { s3Upload, s3Remove } = require("../utils/AWS")


exports.adminLogin = async (req, res, next) => {
  let data = {
    'pageTitle': 'Login',
  };
  res.render('admin/login', { layout: layout.admin.session_without, data })
}

//OTP functions
addMinutes = async (dateObj, minutes) => {
  return new Date(dateObj.getTime() + minutes * 60000);
}

doOTPSend = async (userId) => {
  let userInfo = await User.findOne({ _id: userId })
  // userInfo.login_otp_code = await randomstring.generate({
  // length: 6,
  // charset: 'numeric'
  // })
  userInfo.login_otp_code = 123456
  userInfo.login_otp_expiry_on = await addMinutes(new Date(), 1) // Valid for one minute only
  await userInfo.save()
  //Send SMS	
  return
}

exports.resendOTP = async (req, res, next) => {
  let userInfo = await User.findOne({ email: req.body.email })
  await doOTPSend(userInfo._id)
  res.send({ success: true, data: { message: 'Verification Code resend successfully' } })
}

exports.adminDoLogin = async (req, res, next) => {
  try {
    let postData = req.body;
    //console.log("postData :: ",postData);
    //Do login logic here
    let userInfo = await User.findOne({ email: postData.email, is_deleted: 0 })
    if (!userInfo) {
      req.flash('error_msg', 'Email id does not exist, Please try again. ')
      return res.redirect('/admin/login')
    }
    let passwordCheck = await bcrypt.compare(postData.password, userInfo.password)
    if (!passwordCheck) {
      req.flash('error_msg', 'Incorrect password')
      return res.redirect('/admin/login')
    } else {
      if (userInfo.is_active == 1) {
        //Send SMS OTP here
        await doOTPSend(userInfo._id)
        req.session.login_email = postData.email
        req.session.login_password = postData.password
        return res.redirect('/admin/verify-otp')
      } else {
        req.flash('error_msg', 'Your account is blocked.Please contact Super Admin.')
        return res.redirect('/admin/login')
      }
    }
    //Do login logic here  

  } catch (error) {
    //console.log(error)
    req.flash('error_msg', error.message)
    return res.redirect('/admin/login')
  }
}

exports.adminVerifyOTPAction = async (req, res, next) => {
  let postData = req.body;
  let userInfo = await User.findOne({ email: postData.email, is_deleted: 0 })
  if (userInfo.login_otp_code == postData.otp_code && userInfo.login_otp_expiry_on > new Date()) {
    passport.authenticate('local', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/admin/login',
      failureFlash: true
    })(req, res, next);
  } else {
    req.flash('error_msg', 'Verification Code is invalid.Please try again.')
    return res.redirect('/admin/verify-otp')
  }
}

exports.adminVerifyOTP = async (req, res, next) => {
  let data = {
    'pageTitle': 'Verification Code',
    login_email: req.session.login_email,
    login_password: req.session.login_password
  };
  res.render('admin/verify_otp', { layout: layout.admin.session_without, data })
}
//OTP functions

exports.adminDashboard = async (req, res) => {
  let data = commonController.getCommonParams('Dashboard', req);
  //get total counts
  try {
    let totalUserRecords = await User.countDocuments({ is_deleted: 0 })
    let totalUserDiaryRecords = await userDiaryModel.countDocuments({ is_deleted: 0 })
    let totalCommunityQuestionsRecords = await communityQuestionsModel.countDocuments({ is_deleted: 0 })
    let totalVideoRecords = await videoModel.countDocuments({ is_deleted: 0 })
    data.totalUserRecords = totalUserRecords
    data.totalUserDiaryRecords = totalUserDiaryRecords
    data.totalVideoRecords = totalVideoRecords
    data.totalCommunityQuestionsRecords = totalCommunityQuestionsRecords

  } catch (e) {
    console.log("Error message :: ", e, message);
  }
  res.render('admin/dashboard', { layout: layout.admin.session_with, data })
}

exports.forgotPasswordView = async (req, res, next) => {
  let data = {
    'pageTitle': 'Request a Reset Password Link',
  };
  res.render('admin/forgot_password', { layout: layout.admin.session_without, data })
}

//@desc request for a forgot password link
//route POST /admin/forgot-password
//@access Private
exports.forgotPassword = async (req, res, next) => {
  let email = req.body.email;
  if (email) {
    let user = await User.findOne({ is_deleted: 0, user_type: 1, email: email, is_active: 1 })
    //return console.log(user)
    if (user) {
      if (user.reset_password_attempted >= 3) {
        req.flash('error_msg', 'Maximum number of attempt has been exceeded')
      } else {
        const OTP = await randomstring.generate({
          length: 6,
          charset: 'alphanumeric',
          capitalization: 'uppercase'
        });
        var uid = CommonHelper.encrypt(email)
        var salt = CommonHelper.encrypt(OTP)
        var url = req.protocol + '://' + req.get('host') + '/admin/reset-password?uid=' + uid + '&code=' + salt
        //console.log(url)
        //console.log(OTP)
        try {
          const modifiedUserObj = {
            reset_password_otp: OTP,
            reset_password_attempted: user.reset_password_attempted + 1,
            reset_password_attempted_on: new Date()
          }
          await User.updateOne({ is_deleted: 0, user_type: 1, _id: user._id }, modifiedUserObj);
          const emailData = {
            email: user.email,
            //email:'debabrata.ncrts@gmail.com',
            name: user.full_name,
            url
          }
          sendAdminForgotPasswordEmail(emailData)
          req.flash('success_msg', 'Password reset link sent to your email address')
        } catch (error) {
          console.log(error)
        }

      }
    }
    else {
      req.flash('error_msg', 'Email id does not exist, Please try again. ')
    }
  }
  else {
    req.flash('error_msg', 'Email field is required')
  }
  return res.redirect('back')
}
//@desc get view for reset password
//route GET /admin/reset-password
//@access Private
exports.resetPassword = async (req, res, next) => {
  data = []
  let email = req.query.uid ? CommonHelper.decrypt(req.query.uid) : ''
  let code = req.query.code ? CommonHelper.decrypt(req.query.code) : ''
  let message_type = req.query.message_type ? req.query.message_type : ''
  const user = await User.findOne({ email: email, reset_password_otp: code }).select({ "name": 1 })
  if (user) {
    data.identity = req.query.uid
    data.salt = req.query.code
    data.is_valid_link = 1
  } else {
    data.is_valid_link = 0
    data.message_type = message_type
  }
  return res.render('admin/reset_password', { layout: false, data: data })
}
//@desc reset password
//route POST /admin/reset-password
//@access Private
exports.resetPasswordAction = async (req, res) => {
  let email = CommonHelper.decrypt(req.body.identity)
  let code = CommonHelper.decrypt(req.body.salt)
  const user = await User.findOne({ email: email, reset_password_otp: code }).select({ "name": 1 })
  //console.log(user)
  if (user) {
    user.password = req.body.password
    user.reset_password_otp = ''
    await user.save()
    return res.redirect('/admin/reset-password?message_type=success')
  } else {
    return res.redirect('/admin/reset-password?message_type=failure')
  }
}

//@desc get view for change password
//route GET /admin/change-password
//@access Private
exports.getChangePasswordForm = async (req, res, next) => {
  let data = commonController.getCommonParams('Change Password', req);
  res.render('admin/change_password', { layout: layout.admin.session_with, data })
}

//@desc change password
//route POST /admin/change-password
//@access Private
exports.changePassword = async (req, res) => {
  try {
    await User.checkOldPassword(req.user._id, req.body.old_password)
    let user = await User.findOne({ _id: req.user._id })
    user.password = req.body.new_password
    await user.save()
    req.flash('success_msg', 'Password has been updated successfully')
    return res.redirect('/admin/change-password')
  } catch (error) {
    //console.log(error)
    req.flash('error_msg', error.message)
    return res.redirect('/admin/change-password')
  }
}

exports.adminProfile = async (req, res, next) => {
  let data = commonController.getCommonParams('Admin Profile', req)
  let userInfo = await User.findById(data.loggedUser._id).select({
    full_name: 1, email: 1, contact_no: 1, profile_image: 1, gender: 1
  })
  data.userInfo = userInfo
  res.render('admin/profile', { layout: layout.admin.session_with, data })
}

exports.adminProfileUpdate = async (req, res, next) => {
  if (!req.body.full_name) {
    req.flash('error_msg', 'Name is required')
  } else if (!req.body.email) {
    req.flash('error_msg', 'Email is required')
  } else if (!req.body.contact_no) {
    req.flash('error_msg', 'Phone is required')
  }
  let userInfo = await User.findById(req.user._id)
  userInfo.full_name = req.body.full_name
  userInfo.email = req.body.email
  userInfo.contact_no = req.body.contact_no
  userInfo.gender = req.body.gender
  if (req.file) {
    const imagePath = uploadPath + '/profile_image/' + req.file.filename;
    if (userInfo.profile_image) {
      const removeImage = {
        imgName: userInfo.profile_image,
        type: 'profile_image'
      }
      await s3Remove(removeImage);
    }
    const profileImage = {
      file: req.file,
      type: 'profile_image',
    }
    const response = await s3Upload(profileImage);
    if (response) {
      userInfo.profile_image = req.file.filename
    }
    CommonHelper.unlinkFile(imagePath)
  }
  await userInfo.save()
  req.flash('success_msg', 'Profile has been updated')
  return res.redirect('/admin/profile')
}

exports.adminLogout = async (req, res, next) => {
  try {
    req.logout()
    req.flash('error_msg', 'You are logged out')
  } catch (e) {
    console.log("Error :: ", e);
  }
  res.redirect('/admin/login')
}
