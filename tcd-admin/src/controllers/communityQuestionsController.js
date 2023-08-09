const layout = require('../../config/layout')
const commonController = require('./commonController')
const communityQuestionsModel = require("../models/communityQuestionsModel")
const CommonHelper = require('../utils/commonHelper')
const { communityUpdateEmail } = require('../utils/mailHelper');
const communityQuestionModel = require("../models/communityQuestionsModel");
const communityQuestionCategoryModel = require("../models/communityQuestionsCategoryModel");

exports.getCommunityQuestion = async (req, res, next) => {
	let data = commonController.getCommonParams('Community Questions', req)
	let findCond = { is_deleted: 0 }
	let filterDatas = data.filterDatas;
	if (req.body.filter == 1) {
		if (filterDatas.question) {
			findCond.question = { '$regex': filterDatas.question, '$options': 'i' }
		}
	}
	let communityQuestions = await communityQuestionsModel.find(findCond).populate({
		path: 'user',
		select: { "full_name": 1, "email": 1 }
	}).populate({
		path: 'category'
	}).sort({ created_at: -1 })
	let list = []
	if (communityQuestions.length > 0) {
		for (var i = 0; i < communityQuestions.length; i++) {
			list.push({
				_id: communityQuestions[i]._id,
				full_name: (communityQuestions[i].user) ? communityQuestions[i].user.full_name : '',
				email: (communityQuestions[i].user) ? communityQuestions[i].user.email : '',
				question: communityQuestions[i].question,
				answer: communityQuestions[i].answer,
				category_name: (communityQuestions[i].category) ? communityQuestions[i].category.name : '',
			})
		}

	}
	data.communityQuestions = list
	res.render('admin/community_question_list', { layout: layout.admin.session_with, data })
}

exports.updateCommunityQuestion = async (req, res, next) => {
	let data = commonController.getCommonParams('Add Answer', req);
	const communityQuestionId = req.params.id
	let communityQuestionInfo = await communityQuestionsModel.findById(communityQuestionId).populate({
		path: 'category',
		select: { "name": 1 }
	})
	const getCategoryList = await communityQuestionCategoryModel.find({ is_active: 1, is_deleted: 0 });
	let info = communityQuestionInfo.toObject();
	info.category = communityQuestionInfo.category;
	info.categoryList = getCategoryList;
	data.details = info
	res.render('admin/community_question_form', { layout: layout.admin.session_with, data })
}

exports.deleteCommunityQuestion = async (req, res, next) => {
	try {
		const { id } = req.params;
		let communityInfo = await communityQuestionModel.findById(id)
		communityInfo.is_deleted = 1
		await communityInfo.save()
		req.flash('success_msg', 'Community questions has been deleted successfully')
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/community-questions')
}

exports.manageCommunityQuestion = async (req, res, next) => {
	try {
		const communityQuestionId = req.body.id
		if (communityQuestionId) {
			let communityQuestionInfo = await communityQuestionsModel.findById(communityQuestionId).populate({
				path: 'user',
				select: { "full_name": 1, "email": 1 }
			})
			var questionStatus = communityQuestionInfo.display_flag;
			communityQuestionInfo.answer = req.body.answer;
			communityQuestionInfo.question = req.body.question.trim();
			communityQuestionInfo.category = req.body.category;
			communityQuestionInfo.is_publish = req.body.is_publish == 'on' ? true : false;
			if (communityQuestionInfo.is_publish) {
				communityQuestionInfo.display_flag = 1;
				if (questionStatus == 2) {
					let emailData = {
						email: communityQuestionInfo.user.email,
						name: communityQuestionInfo.user.full_name
					}
					communityUpdateEmail(emailData)
				}
			} else
				communityQuestionInfo.display_flag = 2;
			await communityQuestionInfo.save()
			req.flash('success_msg', 'Answer has been added successfully')
		}
	} catch (e) {
		console.log(e)
		req.flash('error_msg', e.message)
	}
	res.redirect('/admin/community-questions')
}

exports.getCommunityQuestionComments = async (req, res, next) => {
	let data = commonController.getCommonParams('Community Question Comments', req);
	const questionId = req.params.id
	let qInfo = await communityQuestionsModel.findById(questionId).populate({
		path: "comments.commented_by",
		select: { "full_name": 1, "profile_image": 1 }
	})

	if (!qInfo) {
		req.flash('error_msg', 'Record does not exist')
		return res.redirect('/admin/community-questions')
	}
	let info = qInfo.toObject()
	let comments = []
	if (qInfo.comments.length > 0) {
		var profileImgPath = req.protocol + '://' + req.get('host') + '/uploads/profile_image/'
		for (var i = 0; i < qInfo.comments.length; i++) {
			comments.push({
				comment: qInfo.comments[i].comment,
				commented_by_user: (qInfo.comments[i].commented_by) ? qInfo.comments[i].commented_by.full_name : '',
				commented_by_image: (qInfo.comments[i].commented_by.profile_image) ? profileImgPath + qInfo.comments[i].commented_by.profile_image : '',
				created_at: CommonHelper.formatedDate(qInfo.comments[i].created_at, 7)
			})
		}
	}

	info.comments = comments
	data.details = info
	res.render('admin/community_question_comments', { layout: layout.admin.session_with, data })
}