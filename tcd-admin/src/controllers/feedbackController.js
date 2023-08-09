const layout = require('../../config/layout')
const commonController = require('./commonController')
const feedbackModel = require("../models/feedbackModel")

exports.getFeedback = async(req,res,next)=>{
	let data = commonController.getCommonParams('Feedback', req)
	let findCond = {is_deleted:0}
	let findUserCond = {}
	let filterDatas = data.filterDatas;
	if(req.body.filter == 1){
	  if(filterDatas.name_email){
		  findUserCond = {
				$or:[
						{
							full_name:{ '$regex' : filterDatas.name_email, '$options' : 'i' }
						},
						{
							email:{ '$regex' : filterDatas.name_email, '$options' : 'i' }
						}
				]
		  }	  
	  }
	  if(filterDatas.feedback){
		  findCond.feedback = { '$regex' : filterDatas.feedback, '$options' : 'i' }
	  }
	}
	let feedbacks = await feedbackModel.find(findCond).populate({
		path:'user',
		match: findUserCond
	}).sort({created_at:-1})
	data.feedbacks = feedbacks
	res.render('admin/feedback_list',{ layout: layout.admin.session_with, data })
}

exports.deleteFeedback = async(req,res,next)=>{
	try {
		const feedbackId = req.params.id
		await feedbackModel.findOneAndUpdate(
			{"_id" : feedbackId},
			{$set: {"is_deleted" : 1}},
			{new : true}
		)		
		req.flash('success_msg','Feedback deleted successfully')
	} catch (e){
		console.log(e)
		req.flash('error_msg',e.message)
	}
	res.redirect('/admin/feedback')
}