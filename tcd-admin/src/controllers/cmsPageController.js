const layout = require('../../config/layout');
const commonController = require('./commonController');
const cmsPageModel = require("../models/cmsPageModel");
const { s3Upload, s3Remove } = require("../utils/AWS");
const path = require('path');
const uploadPath = path.resolve(__dirname, '../../public/uploads');
const CommonHelper = require('../utils/commonHelper')

exports.getCMS = async (req, res, next) => {
	let data = commonController.getCommonParams('CMS', req);
	let findCond = { is_deleted: 0, content_type: 1 }
	let filterDatas = data.filterDatas;
	if (req.body.filter == 1) {
		if (filterDatas.page_title) {
			findCond.page_title = { '$regex': filterDatas.page_title, '$options': 'i' }
		}
	}
	let cms = await cmsPageModel.find(findCond).sort({ page_title: 1 })
	data.cmsList = cms
	res.render('admin/cms_list', { layout: layout.admin.session_with, data });
}

exports.addCMS = async (req, res, next) => {
	let data = commonController.getCommonParams('Add CMS', req);
	let cmsInfo = {
		_id: '',
		page_title: '',
		page_content: '',
		meta_title: '',
		meta_keywords: '',
		meta_description: '',
		is_active: 1
	}
	data.details = cmsInfo
	res.render('admin/cms_form', { layout: layout.admin.session_with, data });
}

exports.updateCMS = async (req, res, next) => {
	let data = commonController.getCommonParams('Update CMS', req);
	const cmsId = req.params.id
	let cmsInfo = await cmsPageModel.findById(cmsId)
	data.details = cmsInfo
	res.render('admin/cms_form', { layout: layout.admin.session_with, data })
}

exports.manageCMS = async (req, res, next) => {
	try {
		const cmsId = req.body.id
		if (cmsId) {
			let cmsInfo = await cmsPageModel.findById(cmsId)
			//cmsInfo.page_title = req.body.page_title
			cmsInfo.page_content = req.body.page_content
			cmsInfo.meta_title = req.body.meta_title
			cmsInfo.meta_keywords = req.body.meta_keywords
			cmsInfo.meta_description = req.body.meta_description
			cmsInfo.is_active = req.body.is_active ? 1 : 0
			await cmsInfo.save()
			req.flash('success_msg', 'CMS has been updated successfully')
		} else {
			// Check if a page already exist
			let cmsData = await cmsPageModel.find({ is_deleted: 0, page_title: req.body.page_title })
			if (cmsData.length == 0) {
				let cmsInfo = new cmsPageModel({
					page_title: req.body.page_title,
					page_content: req.body.page_content,
					meta_title: req.body.meta_title,
					meta_keywords: req.body.meta_keywords,
					meta_description: req.body.meta_description,
					is_active: req.body.is_active ? 1 : 0
				})
				await cmsInfo.save()
				req.flash('success_msg', 'CMS has been added successfully')
			} else {
				req.flash('error_msg', 'Page Title already exists!')
			}
		}
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/cms')
}

exports.deleteCMS = async (req, res, next) => {
	try {
		const cmsId = req.params.id
		let cmsInfo = await cmsPageModel.findById(cmsId)
		cmsInfo.is_deleted = 1
		await cmsInfo.save()
		req.flash('success_msg', 'CMS has been deleted successfully')
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/cms')
}

exports.getContentList = async (req, res, next) => {
	let data = commonController.getCommonParams('Static Contents', req);
	let findCond = { is_deleted: 0, content_type: 2 }
	let filterDatas = data.filterDatas;
	if (req.body.filter == 1) {
		if (filterDatas.page_title) {
			findCond.page_title = { '$regex': filterDatas.page_title, '$options': 'i' }
		}
	}
	let cms = await cmsPageModel.find(findCond).sort({ parent_content: 1, sort_order: 1 })
	data.cmsList = cms
	res.render('admin/static_content_list', { layout: layout.admin.session_with, data });
}

exports.addContent = async (req, res, next) => {
	let data = commonController.getCommonParams('Add Content', req);
	let findCond = { is_deleted: 0, content_type: 2 }
	let cms = await cmsPageModel.find(findCond).sort({ page_title: 1 })
	data.cmsList = cms
	let cmsInfo = {
		_id: '',
		page_title: '',
		page_content: '',
		banner_image: '',
		parent_content: data.cmsList,
		meta_title: '',
		meta_keywords: '',
		meta_description: '',
		sort_order: '',
		is_active: 1
	}
	data.details = cmsInfo
	res.render('admin/static_content_form', { layout: layout.admin.session_with, data });
}

exports.updateContent = async (req, res, next) => {
	let data = commonController.getCommonParams('Update Content', req);
	let findCond = { is_deleted: 0, content_type: 2 }
	let cms = await cmsPageModel.find(findCond).sort({ page_title: 1 })
	data.cmsList = cms
	const cmsId = req.params.id
	let cmsInfo = await cmsPageModel.findById(cmsId)
	data.details = cmsInfo
	res.render('admin/static_content_form', { layout: layout.admin.session_with, data })
}

exports.manageStaticContent = async (req, res, next) => {
	try {
		const cmsId = req.body.id
		if (cmsId) {
			let cmsInfo = await cmsPageModel.findById(cmsId)
			//cmsInfo.page_title = req.body.page_title
			cmsInfo.page_content = req.body.page_content
			cmsInfo.meta_title = req.body.meta_title
			cmsInfo.meta_keywords = req.body.meta_keywords
			cmsInfo.parent_content = !!req.body.parent_content ? req.body.parent_content : null
			cmsInfo.meta_description = req.body.meta_description
			cmsInfo.is_active = req.body.is_active ? 1 : 0
			cmsInfo.sort_order = req.body.sort_order ? req.body.sort_order : 0
			if (req.file) {
				if (cmsInfo.banner_image) {
					const removeImage = {
						imgName: cmsInfo.banner_image,
						type: 'cms_image'
					}
					await s3Remove(removeImage);
				}
				const imagePath = uploadPath + '/cms/' + req.file.filename;
				const cmsImage = {
					file: req.file,
					type: 'cms_image',
				}
				const response = await s3Upload(cmsImage);
				if (response) {
					cmsInfo.banner_image = req.file.filename
				}
				CommonHelper.unlinkFile(imagePath)
			}
			await cmsInfo.save()
			req.flash('success_msg', 'Content has been updated successfully')
		} else {
			// Check if a page already exist
			let cmsData = await cmsPageModel.find({ is_deleted: 0, page_title: req.body.page_title })
			if (cmsData.length == 0) {
				let cmsInfo = new cmsPageModel({
					page_title: req.body.page_title,
					page_content: req.body.page_content,
					meta_title: req.body.meta_title,
					parent_content: !!req.body.parent_content ? req.body.parent_content : null,
					content_type: 2,
					meta_keywords: req.body.meta_keywords,
					meta_description: req.body.meta_description,
					sort_order: req.body.sort_order,
					is_active: req.body.is_active ? 1 : 0
				})
				if (req.file) {
					const imagePath = uploadPath + '/cms/' + req.file.filename;
					const cmsImage = {
						file: req.file,
						type: 'cms_image',
					}
					const response = await s3Upload(cmsImage);
					if (response) {
						cmsInfo.banner_image = req.file.filename
					}
					CommonHelper.unlinkFile(imagePath)
				}
				await cmsInfo.save()
				req.flash('success_msg', 'Content has been added successfully')
			} else {
				req.flash('error_msg', 'Page Title already exists!')
			}
		}
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/static-content')
}

exports.deleteStaticContent = async (req, res, next) => {
	try {
		const cmsId = req.params.id
		let cmsInfo = await cmsPageModel.findById(cmsId)
		cmsInfo.is_deleted = 1
		await cmsInfo.save()
		req.flash('success_msg', 'CMS has been deleted successfully')
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/static-content')
}