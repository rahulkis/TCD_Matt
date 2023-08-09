const layout = require('../../config/layout');
const commonController = require('./commonController');
const User = require('../models/usersModel');
const CommonHelper = require('../utils/commonHelper');
const path = require('path');
const moment = require('moment');
const uploadPath = path.resolve(__dirname, '../../public/uploads');
const { subAdminCreationEmail } = require('../utils/mailHelper');
const randomstring = require('randomstring');
const { s3Upload, s3Remove } = require("../utils/AWS");

exports.getSubAdminList = async (req, res, next) => {
	let data = commonController.getCommonParams('Sub Admin List', req)
	const filterDatesObj = {
    selected: data.filterDatas.filterDateType,
    dateRange: data.filterDatas.daterange,
  };
	const returnDate = commonController.getFilterDates(filterDatesObj);
  const dateRange = commonController.dateRangeArray();
	try {
		let list = []
		let findCond = {
      $and: [
        { user_type: 3, is_deleted: 0 },
        {
          created_at: {
            $gte: moment(returnDate.startDate).format(),
            $lt: moment(returnDate.endDate).format(),
          },
        },
      ],
    };
		// let findCond = { user_type: 3, is_deleted: 0 }
		let filterDatas = data.filterDatas;
		if (req.body.filter == 1) {
			if (filterDatas.full_name) {
				findCond.full_name = { '$regex': filterDatas.full_name, '$options': 'i' }
			}
			if (filterDatas.email) {
				findCond.email = { '$regex': filterDatas.email, '$options': 'i' }
			}
			if (filterDatas.contact_no) {
				let escape_string = CommonHelper.regexEscape(filterDatas.contact_no)
				findCond.contact_no = { $regex: escape_string.concat(".*"), $options: 'si' }
			}
		}
		let subAdminList = await User.find(findCond).sort({ _id: -1 });
		if (subAdminList.length > 0) {
			var profileImgPath = 'https://tcd-project.s3.us-west-2.amazonaws.com/tcd-admin/profile_image/'
			for (let i = 0; i < subAdminList.length; i++) {
				list.push({
					_id: subAdminList[i]._id,
					name: subAdminList[i].full_name,
					email: subAdminList[i].email,
					contact_no: subAdminList[i].contact_no,
					profile_image: (subAdminList[i].profile_image) ? profileImgPath + subAdminList[i].profile_image : '',
					is_active: subAdminList[i].is_active,
					created_at: moment(subAdminList[i].created_at).format(" Do MMM YY"),
				})
		  }
		}	

		// data.records = subAdminList
		data.dateRange=dateRange;
		data.records = list;
	} catch (e) {
		req.flash('error_msg', e.message)
	}
	res.render('admin/subadmin_list', { layout: layout.admin.session_with, data })
}

exports.addSubAdmin = async (req, res, next) => {
	let data = commonController.getCommonParams('Add Sub Admin', req)
	let subAdminInfo = {
		_id: '',
		full_name: '',
		email: '',
		contact_no: '',
		profile_image: '',
		gender: '',
		is_active: 1
	}
	data.details = subAdminInfo
	res.render('admin/subadmin_form', { layout: layout.admin.session_with, data })
}

exports.updateSubAdmin = async (req, res, next) => {
	let data = commonController.getCommonParams('Update Sub Admin', req);
	const userId = req.params.id
	let userInfo = await User.findById(userId)
	data.details = userInfo
	res.render('admin/subadmin_form', { layout: layout.admin.session_with, data })
}

exports.manageSubAdmin = async (req, res, next) => {
	try {
		const userId = req.body.id
		if (userId) {
			let email = req.body.email
			let userCheckEmail = await User.find({ email: email, is_deleted: 0, _id: { $ne: userId } })
			if (userCheckEmail.length == 0) {
				let userInfo = await User.findById(userId)
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
				userInfo.full_name = req.body.full_name
				userInfo.email = req.body.email
				userInfo.contact_no = req.body.contact_no
				userInfo.is_active = req.body.is_active ? 1 : 0
				await userInfo.save()
				req.flash('success_msg', 'Sub Admin updated successfully')
			} else {
				req.flash('error_msg', 'Email already exists!')
			}
		} else {
			let email = req.body.email
			let userCheckEmail = await User.find({ email: email, is_deleted: 0 })
			if (userCheckEmail.length == 0) {
				const autoPassword = await randomstring.generate({
					length: 8,
					charset: 'alphanumeric',
					capitalization: 'uppercase'
				})
				let userInfo = new User({
					full_name: req.body.full_name,
					email: req.body.email,
					contact_no: req.body.contact_no,
					gender: req.body.gender,
					password: autoPassword, //dynamic password to be sent to email
					user_type: 3,
					is_active: req.body.is_active ? 1 : 0
				})
				if (req.file) {
					const imagePath = uploadPath + '/profile_image/' + req.file.filename;
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
				const emailData = {
					email: req.body.email,
					password: autoPassword,
					name: req.body.full_name
				}
				subAdminCreationEmail(emailData)
				req.flash('success_msg', 'Sub Admin added successfully')
			} else {
				req.flash('error_msg', 'Email already exists!')
			}
		}
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/subadminlist')
}

exports.blockUnblockSubAdmin = async (req, res, next) => {
	try {
		const userId = req.params.id
		let userInfo = await User.findById(userId)
		userInfo.is_active = userInfo.is_active == 1 ? 0 : 1
		await userInfo.save()
		req.flash('success_msg', 'Sub Admin status updated successfully')
		res.redirect('/admin/subadminlist')
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/subadminlist')
}

exports.deleteSubAdmin = async (req, res, next) => {
	try {
		const userId = req.params.id
		let userInfo = await User.findById(userId)
		userInfo.is_deleted = 1
		await userInfo.save()
		req.flash('success_msg', 'Sub Admin status deleted successfully')
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/subadminlist')
}

