const layout = require('../../config/layout');
const commonController = require('./commonController');
const faqModel = require("../models/faqModel");
const faqCategoryModel = require("../models/faqCategoryModel");


exports.getFAQ = async(req,res,next)=>{
	let data = commonController.getCommonParams('FAQ', req)
	let faqCategory = await faqCategoryModel.find({is_deleted:0,parent_id:null})
	let faqSubCategory = await faqCategoryModel.find({is_deleted:0,parent_id:{$ne:null}})
	let findCond = {is_deleted:0}
	let filterDatas = data.filterDatas;
	if(req.body.filter == 1){
		if(filterDatas.question){
			findCond.question = { '$regex' : filterDatas.question, '$options' : 'i' }
		}
		if(filterDatas.category_id){
			let subCategories = await faqCategoryModel.find({is_deleted:0,parent_id:filterDatas.category_id}).select({_id:1,name:1})
			let subCategoryArray = [filterDatas.category_id]
			for (let subCat of subCategories) {
				subCategoryArray.push(subCat._id)
			}
			findCond.category_id = {$in:subCategoryArray}
		}
		if(filterDatas.sub_category_id){
			findCond.category_id = filterDatas.sub_category_id
		}
	  	if((filterDatas.category_id) && (!filterDatas.sub_category_id)){
			let subcategories = await faqCategoryModel.find({is_deleted:0,parent_id:filterDatas.category_id})
			let subcategoryIds = []

			if(subcategories.length > 0){
				for(var c=0;c<subcategories.length;c++){
					subcategoryIds.push(subcategories[c]._id)
				}
				findCond.category_id = {$in:subcategoryIds}
			}
		}
	}
	let faqs = await faqModel.find(findCond).populate({
		path:'category_id',
		select:{"name":1,"parent_id":1,"_id":1}
	}).sort({created_at:-1})
	data.faqs = faqs
	data.faqCategory = faqCategory
	data.faqSubCategory = faqSubCategory
	let categoryColumnArray = []
	for (let faq of faqs) {
		let parentId = faq.category_id.parent_id ? faq.category_id.parent_id : faq.category_id._id
		let catObj = await faqCategoryModel.findById(parentId)
		let categoryName = catObj ? catObj.name : ''
		categoryColumnArray.push(categoryName)
	}
	data.categoryColumnArray = categoryColumnArray
	res.render('admin/faq_list',{ layout: layout.admin.session_with, data })
}

exports.addFAQ = async(req,res,next)=>{
	let data = commonController.getCommonParams('Add FAQ', req);
	let faqCategory = await faqCategoryModel.find({is_deleted:0,type:2})
	let faqInfo = {
		_id:'',
		category_id:'',
		question:'',
		answer:'',
		is_active:1
	}
	data.details = faqInfo
	data.faqCategory = faqCategory
	data.selectedCategoryId = ''
	res.render('admin/faq_form',{ layout: layout.admin.session_with, data });	
}

exports.updateFAQ = async(req,res,next)=>{
	let data = commonController.getCommonParams('Update FAQ', req);
	let faqCategory = await faqCategoryModel.find({is_deleted:0,type:2})
	const faqId = req.params.id
	let faqInfo = await faqModel.findById(faqId)
	let categorySelected = await faqCategoryModel.findById(faqInfo.category_id)
	let selectedCategoryId = categorySelected.parent_id ? categorySelected.parent_id : categorySelected._id
	data.details = faqInfo
	data.faqCategory = faqCategory
	data.selectedCategoryId = selectedCategoryId
	res.render('admin/faq_form',{ layout: layout.admin.session_with, data })
}

exports.manageFAQ = async(req,res,next)=>{
	try {
			const faqId = req.body.id
			if (faqId) {
				let faqInfo = await faqModel.findById(faqId)
				faqInfo.category_id = req.body.sub_category_id ? req.body.sub_category_id : req.body.category_id
				faqInfo.question = req.body.question
				faqInfo.answer = req.body.answer
				faqInfo.is_active = req.body.is_active ? 1 : 0
				await faqInfo.save()
				req.flash('success_msg','FAQ has been updated successfully')
			} else {
				let faqInfo = new faqModel({
						category_id:req.body.sub_category_id ? req.body.sub_category_id : req.body.category_id,
						question:req.body.question,
						answer:req.body.answer,
						is_active:req.body.is_active ? 1 : 0
					})
				await faqInfo.save()
				req.flash('success_msg','FAQ has been created successfully')
			}
	} catch (e){
		console.log(e)
		req.flash('error_msg',e.message)
	}
	res.redirect('/admin/faq')	
}

exports.deleteFAQ = async(req,res,next)=>{
	try {
		const faqId = req.params.id
		let faqInfo = await faqModel.findById(faqId)
		faqInfo.is_deleted = 1
		await faqInfo.save()
		req.flash('success_msg','FAQ has been deleted successfully')
	} catch (e){
		console.log(e)
		req.flash('error_msg',e.message)
	}
	res.redirect('/admin/faq')		
}

exports.getFAQSubCategory = async(req,res)=>{	
	try {
		let categoryId = req.body.category_id
		let faqCategoryCond = {is_deleted:0,is_active:1,parent_id:categoryId}
		let faqCategoryData = await faqCategoryModel.find(faqCategoryCond).select({_id:1,name:1})		
		res.send({success:true,data:{faqCategoryData},message:'FAQ sub category list'})
	} catch (e){
		console.log(e)
		res.send({success:false,data:{},message:e.message})
	}
}