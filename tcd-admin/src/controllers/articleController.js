const articleModel = require("../models/articleModel");
const articleCategoryModel = require("../models/articleCategoryModel");
var fs = require('fs');
var path = require('path');
const layout = require('../../config/layout');
const commonController = require('./commonController');
const CommonHelper = require('../utils/commonHelper')
var uploadPath = path.resolve(__dirname, '../../public/uploads');
const { s3Upload, s3Remove } = require("../utils/AWS")
const User = require("../models/usersModel");

//article Model Crud
exports.getArticle = async (req, res, next) => {
  let data = commonController.getCommonParams('Article List', req);
  let findCond = { is_deleted: 0 }
  let filterDatas = data.filterDatas;
  if (req.body.filter == 1) {
    if (filterDatas.title) {
      findCond.title = { '$regex': filterDatas.title, '$options': 'i' }
    }
  }
  try {
    const article = await articleModel.find(findCond).populate({
      path: 'category',
      select: { "name": 1 }
    }).sort({ created_at: -1 });
    data.article = article;
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.render('admin/articlelist', { layout: layout.admin.session_with, data });
};

exports.showAddArticleForm = async (req, res, next) => {
  let data = commonController.getCommonParams('Add Article', req);
  try {
    const articleCategory = await articleCategoryModel.find({ is_deleted: 0 });
    const users = await User.find({ is_active: 1, is_deleted: 0  });
    data.articleCategory = articleCategory;
    data.users = users;
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.render('admin/articleAdd', { layout: layout.admin.session_with, data });
};

exports.addArticle = async (req, res, next) => {
  try {
    var { title, category, author, content } = req.body;
    const article = await articleModel.find({ is_deleted: 0, title });
    if (article.length > 0) {
      req.flash('error_msg', 'Sorry! Article title already exists, plaese try with some other value');
      if (req.file) {
        var image = req.file.filename
        CommonHelper.unlinkFile(uploadPath + '/article/' + image);
      }
    }
    else {
      const newArticle = new articleModel({
        title,
        category,
        author,
        content
      });
      if (req.file) {
        const imagePath = uploadPath + '/article/' + req.file.filename;
        const articleImage = {
          file: req.file,
          type: 'article_image',
        }
        const response = await s3Upload(articleImage);
        if (response) {
          newArticle.image = req.file.filename
        }
        CommonHelper.unlinkFile(imagePath)
      }
      newArticle.is_active = (req.body.is_active === '1') ? req.body.is_active : 0;
      await newArticle.save();
      req.flash('success_msg', 'Article has been added successfully');
    }
  }
  catch (e) {
    console.log("Error message :: " + e);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/article');
};

exports.getupdateArticle = async (req, res, next) => {
  let data = commonController.getCommonParams('Update Article', req);
  try {
    var id = req.query.id;
    const updatingArticle = await articleModel.findById(id).populate({
      path: 'category',
      select: { "name": 1 }
    }).populate({
      path: 'author',
      select: { "name": 1 }
    });
    const articleCategory = await articleCategoryModel.find({ is_deleted: 0 });
    const users = await User.find({ is_active: 1, is_deleted: 0  });
    data.articleCategory = articleCategory;
    data.updatingArticle = updatingArticle;
    data.users = users;
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.render('admin/articleedit', { layout: layout.admin.session_with, data });
};

exports.updateArticle = async (req, res, next) => {
  try {
    var id = req.query.id;
    const articleInfo = await articleModel.findById(id);
    const article = await articleModel.find({ is_deleted: 0, title: req.body.title });
    if (article.length > 0 && articleInfo.title !== req.body.title) {
      req.flash('error_msg', 'Article title already exists!');
      if (req.file) {
        var image = req.file.filename
        CommonHelper.unlinkFile(uploadPath + '/article/' + image);
      }
    }
    else {
      articleInfo.title = req.body.title
      articleInfo.updated_at = new Date();
      articleInfo.content = req.body.content
      articleInfo.category = req.body.category
      articleInfo.author = req.body.author
      articleInfo.is_active = (req.body.is_active) ? 1 : 0;
      var oldImage = articleInfo.image;
      if (req.file) {
        if (oldImage) {
          const removeImage = {
            imgName: oldImage,
            type: 'article_image'
          }
          await s3Remove(removeImage);
        }

        const imagePath = uploadPath + '/article/' + req.file.filename;
        const articleImage = {
          file: req.file,
          type: 'article_image',
        }
        const response = await s3Upload(articleImage);
        if (response) {
          articleInfo.image = req.file.filename;
        }
        CommonHelper.unlinkFile(imagePath)
      }
      await articleInfo.save();
      req.flash('success_msg', 'Article has been updated successfully');
    }
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/article');
};

exports.deleteArticle = async (req, res, next) => {
  try {
    var updated_at = new Date();
    var id = req.query.id;
    const updatingArticle = await articleModel.findById(id);
    var oldImage = updatingArticle.image;
    if (oldImage.length > 0) {
      const removeIcon = {
        imgName: oldImage,
        type: 'article_image'
      }
      await s3Remove(removeIcon);
      // CommonHelper.unlinkFile(uploadPath + '/article/' + oldImage);
      image = "";
    }
    await articleModel.findByIdAndUpdate(
      { _id: id },
      {
        is_deleted: 1,
        image,
        updated_at
      },
      function (err, result) {
        if (err) {
          req.flash('error_msg', ' Sorry! Something went wrong, Please try again.');
        } else {
          req.flash('success_msg', 'Article has been deleted successfully');
        }
      }
    );
  }
  catch (e) {
    console.log("Error message :: ", e.message);
    req.flash('error_msg', e.message);
  }
  res.redirect('/admin/article');
};