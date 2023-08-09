const layout = require('../../config/layout');
const commonController = require('./commonController');
const User = require('../models/usersModel');
const Partner = require('../models/partner/partnerModel');
const CommonHelper = require('../utils/commonHelper');
const path = require('path');
const uploadPath = path.resolve(__dirname, '../../public/uploads');
const { s3Upload, s3Remove } = require("../utils/AWS");
const { partnerAdminCreationEmail, partnerCreationEmail } = require('../utils/mailHelper');
// const randomstring = require('randomstring');

exports.getPartnerAdmin = async (req, res, next) => {
	let data = commonController.getCommonParams('Partner Admin List', req)
	try {
		let findCond = { partner_type: 1, is_deleted: 0 }
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
		let partnerAdminList = await Partner.find(findCond).sort({ _id: -1 })
		data.records = partnerAdminList
	} catch (e) {
		req.flash('error_msg', e.message)
	}
	res.render('admin/partnerAdmin_list', { layout: layout.admin.session_with, data })
}

exports.addPartnerAdmin = async (req, res, next) => {
	let data = commonController.getCommonParams('Add Partner Admin', req)
	let partnerAdminInfo = {
		_id: '',
		full_name: '',
		email: '',
		contact_no: '',
		profile_image: '',
		gender: '',
		new_password: '',
		new_confirm_password: '',
		crud_type: 'Add',
		is_active: 1
	}
	data.details = partnerAdminInfo
	res.render('admin/partnerAdmin_form', { layout: layout.admin.session_with, data })
}

exports.updatePartnerAdmin = async (req, res, next) => {
	const data = commonController.getCommonParams('Update Partner Admin', req);
	const { id: userId } = req.params
	const userInfo = await Partner.findById(userId);
	userInfo.crud_type = 'Update';
	data.details = userInfo;
	res.render('admin/partnerAdmin_form', { layout: layout.admin.session_with, data })
}

exports.managePartnerAdmin = async (req, res, next) => {
	try {
		const { id, email, full_name, contact_no, is_active, gender, new_password, new_confirm_password } = req.body;
		if (id) {
			const userCheckEmail = await User.find({ email: email, is_deleted: 0, _id: { $ne: id } })
			if (userCheckEmail.length == 0) {
				const userInfo = await Partner.findById(id);
				if (new_password !== new_confirm_password) {
					req.flash('error_msg', 'Password and Confirm Password should be same');
					return res.redirect('/admin/partner-admin');
				}
				if (new_password && new_confirm_password) {
					userInfo.password = new_password;
				}
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
				userInfo.full_name = full_name;
				userInfo.email = email;
				userInfo.contact_no = contact_no;
				userInfo.gender = gender;
				userInfo.is_active = is_active ? 1 : 0;
				await userInfo.save();
				req.flash('success_msg', 'Partner Admin updated successfully')
			} else {
				req.flash('error_msg', 'Email already exists!')
			}
		} else {
			const userCheckEmail = await User.find({ email: email, is_deleted: 0 })
			if (userCheckEmail.length == 0) {
				// const autoPassword = await randomstring.generate({
				// 	length: 8,
				// 	charset: 'alphanumeric',
				// 	capitalization: 'uppercase'
				// });
				if (new_password !== new_confirm_password) {
					req.flash('error_msg', 'Password and Confirm Password should be same');
					return res.redirect('/admin/partner-admin');
				}
				const userInfo = new Partner({
					full_name: full_name,
					email: email,
					contact_no: contact_no,
					gender: gender,
					// password: autoPassword, //dynamic password to be sent to email
					password: new_password, //dynamic password to be sent to email
					partner_type: 1,
					is_active: is_active ? 1 : 0
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
					email: email,
					// password: autoPassword,
					password: new_password,
					name: full_name
				}
				partnerAdminCreationEmail(emailData)
				req.flash('success_msg', 'Partner Admin added successfully')
			} else {
				req.flash('error_msg', 'Email already exists!')
			}
		}
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/partner-admin')
}

exports.deletePartnerAdmin = async (req, res, next) => {
	try {
		const { id: userId } = req.params;
		let userInfo = await Partner.findById(userId)
		userInfo.is_deleted = 1;
		userInfo.deleted_at = new Date();
		await userInfo.save()
		req.flash('success_msg', 'Partner Admin deleted successfully')
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/partner-admin')
}

exports.blockUnblockPartnerAdmin = async (req, res, next) => {
	try {
		const { id: userId } = req.params;
		let userInfo = await Partner.findById(userId)
		userInfo.is_active = userInfo.is_active == 1 ? 0 : 1
		await userInfo.save()
		req.flash('success_msg', 'Partner Admin status updated successfully')
		res.redirect('/admin/partner-admin')
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/partner-admin')
}

exports.getPartner = async (req, res, next) => {
	let data = commonController.getCommonParams('Partner List', req)
	try {
		let findCond = { partner_type: 2, is_deleted: 0 }
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
		let partnerList = await Partner.find(findCond)
			.populate({
				path: 'partner_admin',
				select: { "full_name": 1 }
			}).sort({ _id: -1 })
		data.records = partnerList;
	} catch (e) {
		req.flash('error_msg', e.message)
	}
	res.render('admin/partner_list', { layout: layout.admin.session_with, data })
}

exports.addPartner = async (req, res, next) => {
	let data = commonController.getCommonParams('Add Partner', req)
	let partnerInfo = {
		_id: '',
		full_name: '',
		email: '',
		contact_no: '',
		profile_image: '',
		gender: '',
		new_password: '',
		new_confirm_password: '',
		crud_type: 'Add',
		partner_admin: { _id: '', full_name: '' },
		is_active: 1
	}
	const partnerAdminList = await Partner.find({ partner_type: 1, is_deleted: 0, is_active: 1 });
	data.details = partnerInfo;
	data.partnerAdminList = partnerAdminList;
	res.render('admin/partner_form', { layout: layout.admin.session_with, data })
}

exports.updatePartner = async (req, res, next) => {
	const data = commonController.getCommonParams('Update Partner Admin', req);
	const { id: userId } = req.params
	const userInfo = await Partner.findById(userId)
		.populate({
			path: 'partner_admin',
			select: { "full_name": 1, "_id": 1 }
		});
		console.log(userInfo)
	const partnerAdminList = await Partner.find({ partner_type: 1, is_deleted: 0, is_active: 1 });
	data.details = userInfo;
	data.partnerAdminList = partnerAdminList;
	console.log(partnerAdminList)
	res.render('admin/partner_form', { layout: layout.admin.session_with, data })
}

exports.managePartner = async (req, res, next) => {
	try {
		const { id, email, full_name, contact_no, is_active, gender, partner_admin, new_password, new_confirm_password } = req.body;
		if (id) {
			const userCheckEmail = await User.find({ email: email, is_deleted: 0, _id: { $ne: id } })
			if (userCheckEmail.length == 0) {
				const userInfo = await Partner.findById(id);
				if (new_password !== new_confirm_password) {
					req.flash('error_msg', 'Password and Confirm Password should be same');
					return res.redirect('/admin/partner');
				}
				if (new_password && new_confirm_password) {
					userInfo.password = new_password;
				}
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
				userInfo.full_name = full_name;
				userInfo.email = email;
				userInfo.contact_no = contact_no;
				userInfo.gender = gender;
				userInfo.partner_admin = partner_admin;
				userInfo.is_active = is_active ? 1 : 0;
				await userInfo.save();
				req.flash('success_msg', 'Partner updated successfully')
			} else {
				req.flash('error_msg', 'Email already exists!')
			}
		} else {
			const userCheckEmail = await User.find({ email: email, is_deleted: 0 })
			if (userCheckEmail.length == 0) {
				// const autoPassword = await randomstring.generate({
				// 	length: 8,
				// 	charset: 'alphanumeric',
				// 	capitalization: 'uppercase'
				// });
				if (new_password !== new_confirm_password) {
					req.flash('error_msg', 'Password and Confirm Password should be same');
					return res.redirect('/admin/partner');
				}
				const userInfo = new Partner({
					full_name: full_name,
					email: email,
					contact_no: contact_no,
					gender: gender,
					password: new_password, //dynamic password to be sent to email
					partner_type: 2,
					partner_admin: partner_admin,
					is_active: is_active ? 1 : 0
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
					email: email,
					password: new_password,
					name: full_name
				}
				partnerCreationEmail(emailData)
				req.flash('success_msg', 'Partner added successfully')
			} else {
				req.flash('error_msg', 'Email already exists!')
			}
		}
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/partner')
}

exports.deletePartner = async (req, res, next) => {
	try {
		const { id: userId } = req.params;
		let userInfo = await Partner.findById(userId)
		userInfo.is_deleted = 1;
		userInfo.deleted_at = new Date();
		await userInfo.save()
		req.flash('success_msg', 'Partner deleted successfully')
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/partner')
}

exports.blockUnblockPartner = async (req, res, next) => {
	try {
		const { id: userId } = req.params;
		let userInfo = await Partner.findById(userId)
		userInfo.is_active = userInfo.is_active == 1 ? 0 : 1
		await userInfo.save()
		req.flash('success_msg', 'Partner status updated successfully')
		res.redirect('/admin/partner')
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/partner')
}