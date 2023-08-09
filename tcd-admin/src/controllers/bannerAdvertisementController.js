const layout = require('../../config/layout')
const commonController = require('./commonController')
const CommonHelper = require('../utils/commonHelper')
const bannerAdvertisementModel = require("../models/bannerAdvertisementModel")
var path = require('path')
let uploadPath = path.resolve(__dirname, '../../public/uploads')

let imageResize = async (width,height,imagePath,outputImagePath) => {
	const sharp = require('sharp')
	await sharp(imagePath)
	//.extract({ left: 0, top: 0, width: width, height: height })
	.resize(width, height)
	.toFile(outputImagePath)
}

exports.getBannerAdvertisement = async(req,res,next)=>{
	let data = commonController.getCommonParams('Banner Advertisement', req);
	let findCond = {is_deleted:0}
	let filterDatas = data.filterDatas;
	if(req.body.filter == 1){
		if(filterDatas.banner_advertisement_title){
			findCond.banner_advertisement_title = { '$regex' : filterDatas.banner_advertisement_title, '$options' : 'i' }
		}
	}
	let banner_advertisements = await bannerAdvertisementModel.find(findCond).sort({_id:-1})
	data.bannerAdvertisementList = banner_advertisements
	res.render('admin/banner_advertisement_list',{ layout: layout.admin.session_with, data })
}

exports.addBannerAdvertisement = async(req,res,next)=>{
	let data = commonController.getCommonParams('Add Banner Advertisement', req);
	let dataInfo = {
		_id:'',
		banner_advertisement_title:'',
		banner_advertisement_image:'',
		is_active:1
	}
	data.details = dataInfo
	res.render('admin/banner_advertisement_form',{ layout: layout.admin.session_with, data })
}

exports.updateBannerAdvertisement = async(req,res,next)=>{
	let data = commonController.getCommonParams('Update Banner Advertisement', req);
	const dataId = req.params.id
	let dataInfo = await bannerAdvertisementModel.findById(dataId)
	data.details = dataInfo
	res.render('admin/banner_advertisement_form',{ layout: layout.admin.session_with, data })
}

exports.manageBannerAdvertisement = async(req,res,next)=>{
	try {
		const dataId = req.body.id
		if (dataId) {
			let dataInfo = await bannerAdvertisementModel.findById(dataId)
			dataInfo.banner_advertisement_title = req.body.banner_advertisement_title
			dataInfo.is_active = req.body.is_active ? 1 : 0
			// if(req.file){
			// 	CommonHelper.unlinkFile(uploadPath+'/banner_advertisement/'+dataInfo.banner_advertisement_image)
			// 	dataInfo.banner_advertisement_image = req.file.filename
			// }
			if(req.file){
				var oldImage = dataInfo.banner_advertisement_image
				if(oldImage){
				  CommonHelper.unlinkFile(uploadPath+'/banner_advertisement/'+oldImage);
				}        
				//Crop Image
				const imagePath = uploadPath+'/banner_advertisement/'+req.file.filename;
				const outputImageName = 'IMG_'+ req.file.filename;
				const outputImagePath = uploadPath+'/banner_advertisement/' + outputImageName;
				await imageResize(160,80,imagePath,outputImagePath)			
				dataInfo.banner_advertisement_image = outputImageName
				CommonHelper.unlinkFile(imagePath)
			}
			await dataInfo.save()
			req.flash('success_msg','Banner Advertisement has been updated successfully')
		} else {
			let dataInfo = new bannerAdvertisementModel({
				banner_advertisement_title:req.body.banner_advertisement_title,
				is_active:req.body.is_active ? 1 : 0
			})
			if(req.file){
				//console.log(req.file)
				//Crop Image
				const imagePath = uploadPath+'/banner_advertisement/'+req.file.filename;
				const outputImageName = 'IMG_'+ req.file.filename;
				const outputImagePath = uploadPath+'/banner_advertisement/' + outputImageName;
				await imageResize(160,80,imagePath,outputImagePath)			
				dataInfo.banner_advertisement_image = outputImageName
				CommonHelper.unlinkFile(imagePath)
			}
			await dataInfo.save()
			req.flash('success_msg','Banner Advertisement has been added successfully')
		}
	} catch (e){
		console.log(e)
		req.flash('error_msg',e.message)
	}
	res.redirect('/admin/banner-advertisement')
}

exports.deleteBannerAdvertisement = async(req,res,next)=>{
	try {
		const dataId = req.params.id
		let dataInfo = await bannerAdvertisementModel.findOneAndUpdate(
			{"_id" : dataId},
			{$set: {"is_deleted" : 1}},
			{new : true}
		)
		if(dataInfo.banner_advertisement_image.length > 0){
			CommonHelper.unlinkFile(uploadPath+'/banner_advertisement/'+dataInfo.banner_advertisement_image)
		}
		req.flash('success_msg','Banner Advertisement has been deleted successfully')
	} catch (e){
		req.flash('error_msg',e.message)
	}
	res.redirect('/admin/banner-advertisement')
}