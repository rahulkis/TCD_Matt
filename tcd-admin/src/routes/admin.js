const express = require("express");
const router = express.Router();
const { ensureAuthenticated, checkUserNotLogin } = require('../middleware/adminAuth')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const masterDataController = require('../controllers/masterDataController');
const articleController = require('../controllers/articleController');
const cmsPageController = require('../controllers/cmsPageController')
const faqController = require('../controllers/faqController')
const feedbackController = require('../controllers/feedbackController')
const coaNumberController = require('../controllers/coaNumberController');
const communityQuestionsController = require('../controllers/communityQuestionsController')
const subAdminController = require('../controllers/subAdminController')
const bannerAdvertisementController = require('../controllers/bannerAdvertisementController')
const productController = require('../controllers/productController')
const StatisticsController = require('../controllers/statisticController')
const PartnerAdminController = require('../controllers/partnerAdminController')
const TCDUpdatesController = require('../controllers/tcdUpdatesController')
const { s3UploadToTextractBucket } = require("../utils/AWS");
const AWS = require('aws-sdk');
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION_NAME, AWS_BUCKET } = process.env
const s3Credentials = {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION_NAME
}

AWS.config.update(s3Credentials);
const s3 = new AWS.S3(s3Credentials.region);

var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');
const uploadPath = path.resolve(__dirname, '../../public/uploads');

const masterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'activity_image' || file.fieldname === 'activity_icon') {
      cb(null, uploadPath + '/activity');
    } else if (file.fieldname === 'effect_image' || file.fieldname === 'effect_icon') {
      cb(null, uploadPath + '/effect');
    } else if (file.fieldname === 'symptom_image' || file.fieldname === 'symptom_icon') {
      cb(null, uploadPath + '/symptom');
    } else if (file.fieldname === 'condition_image' || file.fieldname === 'condition_icon') {
      cb(null, uploadPath + '/condition');
    } else if (file.fieldname === 'article_image') {
      cb(null, uploadPath + '/article');
    } else if (file.fieldname === 'method_icon') {
      cb(null, uploadPath + '/method');
    } else if (file.fieldname === 'coa_image') {
      cb(null, uploadPath + '/coa')
    } else if (file.fieldname === 'composition_image') {
      cb(null, uploadPath + '/composition')
    } else if (file.fieldname === 'cms_image') {
      cb(null, uploadPath + '/cms')
    } else if (file.fieldname === 'product_image') {
      cb(null, uploadPath + '/product')
    } else if (file.fieldname === 'stat_file') {
      cb(null, uploadPath + '/statistics')
    } else if (file.fieldname === 'entourage_image') {
      cb(null, uploadPath + '/entourage')
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const masterUpload = multer({
  storage: masterStorage,
  limits: { filesize: 10 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

//Banner Advertisement image
const bannerAdvertisementImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath + '/banner_advertisement')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const bannerAdvertisementImageUpload = multer({
  storage: bannerAdvertisementImageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

//Banner Advertisement image
const stateFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath + '/coadata')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const stateFileUpload = multer({
  storage: stateFileStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})
//User profile image
const userImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath + '/profile_image')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const userImageUpload = multer({
  storage: userImageStorage,
  limits: { filesize: 10 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})
//COA PDF Image Storeage
const coaPDFImageStorage = multerS3({
  s3: s3,
  bucket: 'tcd-coaparser',
  key: function (req, file, cb) {
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const uploadCoaFile = multer({
  storage: coaPDFImageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|png|jpg|jpeg|tiff)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

router.get('/', (req, res) => {
  let redirect = '/admin/login';
  if (req.isAuthenticated()) {
    redirect = '/admin/dashboard';
  }
  return res.redirect(redirect)
})


router.get('/forgot-password', adminController.forgotPasswordView)
router.post('/forgot-password', adminController.forgotPassword)
router.get('/reset-password', adminController.resetPassword)
router.post('/reset-password', adminController.resetPasswordAction)

router.get('/login', checkUserNotLogin, adminController.adminLogin)
router.post('/login', checkUserNotLogin, adminController.adminDoLogin)
router.get('/dashboard', ensureAuthenticated, adminController.adminDashboard)
router.get('/userlist', ensureAuthenticated, userController.getUserList)
router.get('/change-password', ensureAuthenticated, adminController.getChangePasswordForm)
router.post('/change-password', ensureAuthenticated, adminController.changePassword)
router.get('/logout', ensureAuthenticated, adminController.adminLogout)
router.get('/profile', ensureAuthenticated, adminController.adminProfile)
router.post('/profile', ensureAuthenticated, userImageUpload.single('profile_image'), adminController.adminProfileUpdate)
router.get('/verify-otp', adminController.adminVerifyOTP)
router.post('/verify-otp', adminController.adminVerifyOTPAction)
router.post('/resend-otp', adminController.resendOTP)

//mood crud
router.get('/mood', ensureAuthenticated, masterDataController.getMood);
router.post('/mood', ensureAuthenticated, masterDataController.getMood);
router.post('/mood/add', ensureAuthenticated, masterDataController.addMood);
router.get('/mood/update', ensureAuthenticated, masterDataController.getUpdateMood);
router.post('/mood/update', ensureAuthenticated, masterDataController.updateMood);
router.post('/mood/delete', ensureAuthenticated, masterDataController.deleteMood);
router.post('/mood/ordering', ensureAuthenticated, masterDataController.moodOrdering);

//effects crud
router.get('/effect', ensureAuthenticated, masterDataController.getEffect);
router.post('/effect', ensureAuthenticated, masterDataController.getEffect);
router.get('/effect/add', ensureAuthenticated, masterDataController.addEffect);
router.get('/effect/update/:id', ensureAuthenticated, masterDataController.getUpdateEffect);

router.post('/effect/manage', ensureAuthenticated, masterUpload.fields([
  { name: 'effect_image', maxCount: 1 },
  { name: 'effect_icon', maxCount: 1 }
]), masterDataController.manageEffect)

router.post('/effect/delete', ensureAuthenticated, masterDataController.deleteEffect);
router.post('/effect/manage-ordering', ensureAuthenticated, masterDataController.manageEffectOrdering)

//activity crud
router.get('/activity', ensureAuthenticated, masterDataController.getActivity);
router.post('/activity', ensureAuthenticated, masterDataController.getActivity);
router.post('/activity/add', ensureAuthenticated, masterUpload.fields([
  { name: 'activity_image', maxCount: 1 },
  { name: 'activity_icon', maxCount: 1 }
]), masterDataController.addActivity);
router.get('/activity/update', ensureAuthenticated, masterDataController.getUpdateActivity);
router.post('/activity/update', ensureAuthenticated, masterUpload.fields([
  { name: 'activity_image', maxCount: 1 },
  { name: 'activity_icon', maxCount: 1 },
]), masterDataController.updateActivity);
router.post('/activity/delete', ensureAuthenticated, masterDataController.deleteActivity);
router.post('/activity/manage-ordering', ensureAuthenticated, masterDataController.manageActivityOrdering)

//partner crud
router.get('/partner-admin', ensureAuthenticated, PartnerAdminController.getPartnerAdmin);
router.post('/partner-admin', ensureAuthenticated, PartnerAdminController.getPartnerAdmin);
router.get('/partner-admin/add', ensureAuthenticated, PartnerAdminController.addPartnerAdmin);
router.get('/partner-admin/update/:id', ensureAuthenticated, PartnerAdminController.updatePartnerAdmin)
router.post('/partner-admin/manage', ensureAuthenticated, userImageUpload.single('profile_image'), PartnerAdminController.managePartnerAdmin);
router.get('/partner-admin/block-unblock/:id', ensureAuthenticated, PartnerAdminController.blockUnblockPartnerAdmin)
router.get('/partner-admin/delete/:id', ensureAuthenticated, PartnerAdminController.deletePartnerAdmin)

router.get('/partner', ensureAuthenticated, PartnerAdminController.getPartner);
router.post('/partner', ensureAuthenticated, PartnerAdminController.getPartner);
router.get('/partner/add', ensureAuthenticated, PartnerAdminController.addPartner);
router.get('/partner/update/:id', ensureAuthenticated, PartnerAdminController.updatePartner)
router.post('/partner/manage', ensureAuthenticated, userImageUpload.single('profile_image'), PartnerAdminController.managePartner);
router.get('/partner/block-unblock/:id', ensureAuthenticated, PartnerAdminController.blockUnblockPartner)
router.get('/partner/delete/:id', ensureAuthenticated, PartnerAdminController.deletePartner)

//symptoms crud
router.get('/symptom', ensureAuthenticated, masterDataController.getSymptom);
router.post('/symptom', ensureAuthenticated, masterDataController.getSymptom);
router.get('/symptom/add', ensureAuthenticated, masterDataController.addSymptom);
router.get('/symptom/update/:id', ensureAuthenticated, masterDataController.getUpdateSymptom);

router.post('/symptom/manage', ensureAuthenticated, masterUpload.fields([
  { name: 'symptom_image', maxCount: 1 },
  { name: 'symptom_icon', maxCount: 1 }
]), masterDataController.manageSymptom)
router.get('/symptom/delete/:id', ensureAuthenticated, masterDataController.deleteSymptom);
router.post('/symptom/manage-ordering', ensureAuthenticated, masterDataController.manageSymptomOrdering)


//Physique crud
router.get('/physique', ensureAuthenticated, masterDataController.getPhysique);
router.post('/physique', ensureAuthenticated, masterDataController.getPhysique);
router.post('/physique/add', ensureAuthenticated, masterDataController.addPhysique);
router.get('/physique/update', ensureAuthenticated, masterDataController.getUpdatePhysique);
router.post('/physique/update', ensureAuthenticated, masterDataController.updatePhysique);
router.post('/physique/delete', ensureAuthenticated, masterDataController.deletePhysique);

//Cannabinoid crud
router.get('/cannabinoid', ensureAuthenticated, masterDataController.getCannabinoid);
router.post('/cannabinoid', ensureAuthenticated, masterDataController.getCannabinoid);
router.post('/cannabinoid/add', ensureAuthenticated, masterDataController.addCannabinoid);
router.get('/cannabinoid/update', ensureAuthenticated, masterDataController.getUpdateCannabinoid);
router.post('/cannabinoid/update', ensureAuthenticated, masterDataController.updateCannabinoid);
router.post('/cannabinoid/delete', ensureAuthenticated, masterDataController.deleteCannabinoid);

//Strain crud
router.get('/strain', ensureAuthenticated, masterDataController.getStrain);
router.post('/strain', ensureAuthenticated, masterDataController.getStrain);
router.post('/strain/add', ensureAuthenticated, masterDataController.addStrain);
router.get('/strain/update', ensureAuthenticated, masterDataController.getUpdateStrain);
router.post('/strain/update', ensureAuthenticated, masterDataController.updateStrain);
router.post('/strain/delete', ensureAuthenticated, masterDataController.deleteStrain);

//video crud
const fileUpload = function () {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (req.body.type === '1' || req.body.type === '5') {
        var type = "introductory"
      }
      else if (req.body.type === '2') {
        var type = "educational"
      }
      else if (req.body.type === '3') {
        var type = "news"
      }
      else if (req.body.type === '4') {
        var type = "community"
      }
      // console.log(type);
      if (file.fieldname === 'video_url') {
        var uploadPath = path.resolve(__dirname, `../../public/uploads/video/${type}`);
      }
      else if (file.fieldname === 'video_thumb_image') {
        var uploadPath = path.resolve(__dirname, `../../public/uploads/video_thumb_image/${type}`);
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  var upload = multer({
    storage: storage,
    limits: 1024 * 1024 * 10 | 1024 * 1024,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)) {
        return cb(new Error('Please upload image and video'))
      }
      cb(undefined, true)
    }
  });
  var uploadMultiple = upload.fields([{ name: 'video_url' }, { name: 'video_thumb_image' }]);
  return uploadMultiple;
}

router.get('/video', ensureAuthenticated, masterDataController.getVideo);
router.post('/video', ensureAuthenticated, masterDataController.getVideo);
router.get('/video/add', ensureAuthenticated, masterDataController.showAddVideoForm);
router.post('/video/add', ensureAuthenticated, fileUpload(), masterDataController.addVideo);
router.get('/video/update', ensureAuthenticated, masterDataController.getUpdateVideo);
router.post('/video/update', ensureAuthenticated, fileUpload(), masterDataController.updateVideo);
router.post('/video/delete', ensureAuthenticated, masterDataController.deleteVideo);
router.get('/video/comments/:id', ensureAuthenticated, masterDataController.getVideoComments)
router.get('/video/comments/reports/:id', ensureAuthenticated, masterDataController.getVideoCommentReports)
router.get('/video/comments/remove-comment', ensureAuthenticated, masterDataController.removeComment)
router.get('/video/comments/block-commenter/:id', ensureAuthenticated, masterDataController.blockCommenter)

/*router.get('/report-reason', ensureAuthenticated, masterDataController.reportReason);
router.get('/report-reason/add', ensureAuthenticated, masterDataController.reportReasonAdd);
router.get('/report-reason/:id', ensureAuthenticated, masterDataController.reportReasonEdit);
router.post('/report-reason/update', ensureAuthenticated, masterDataController.reportReasonSave);
*/

//articleCategory crud
router.get('/article-category', ensureAuthenticated, masterDataController.getArticleCategory);
router.post('/article-category', ensureAuthenticated, masterDataController.getArticleCategory);
router.post('/article-category/add', ensureAuthenticated, masterDataController.addArticleCategory);
router.get('/article-category/update', ensureAuthenticated, masterDataController.getUpdateArticleCategory);
router.post('/article-category/update', ensureAuthenticated, masterDataController.updateArticleCategory);
router.post('/article-category/delete', ensureAuthenticated, masterDataController.deleteArticleCategory);

//medicineComposition crud
router.get('/coa-composition', ensureAuthenticated, masterDataController.getMedicineComposition);
router.post('/coa-composition', ensureAuthenticated, masterDataController.getMedicineComposition);
router.get('/coa-composition/add', ensureAuthenticated, masterDataController.addMedicineCompositionForm);
router.post('/coa-composition/manage', ensureAuthenticated, masterUpload.single('composition_image'), masterDataController.manageCOAComposition);
router.get('/coa-composition/update/:id', ensureAuthenticated, masterDataController.UpdateMedicineCompositionForm);
router.post('/coa-composition/delete', ensureAuthenticated, masterDataController.deleteMedicineComposition);

//article crud
router.get('/article', ensureAuthenticated, articleController.getArticle);
router.post('/article', ensureAuthenticated, articleController.getArticle);
router.get('/article/add', ensureAuthenticated, articleController.showAddArticleForm);
router.post('/article/add', ensureAuthenticated, masterUpload.single('article_image'), articleController.addArticle);
router.get('/article/update', ensureAuthenticated, articleController.getupdateArticle);
router.post('/article/update', ensureAuthenticated, masterUpload.single('article_image'), articleController.updateArticle);
router.post('/article/delete', ensureAuthenticated, articleController.deleteArticle);

//ConsumptionNegatives crud
router.get('/consumption-negatives', ensureAuthenticated, masterDataController.getConsumptionNegatives);
router.post('/consumption-negatives', ensureAuthenticated, masterDataController.getConsumptionNegatives);
router.post('/consumption-negatives/add', ensureAuthenticated, masterDataController.addConsumptionNegatives);
router.get('/consumption-negatives/update', ensureAuthenticated, masterDataController.getUpdateConsumptionNegatives);
router.post('/consumption-negatives/update', ensureAuthenticated, masterDataController.updateConsumptionNegatives);
router.post('/consumption-negatives/delete', ensureAuthenticated, masterDataController.deleteConsumptionNegatives);

//Composition CRUD 
router.get('/consumption-methods', ensureAuthenticated, masterDataController.getConsumptionMethods)
router.post('/consumption-methods', ensureAuthenticated, masterDataController.getConsumptionMethods)
router.get('/consumption-methods/add', ensureAuthenticated, masterDataController.addConsumptionMethod)
router.get('/consumption-methods/update/:id', ensureAuthenticated, masterDataController.updateConsumptionMethod)
router.post('/consumption-methods/manage', ensureAuthenticated, masterUpload.single('method_icon'), masterDataController.manageConsumptionMethods)
router.post('/consumption-methods/delete/:id', ensureAuthenticated, masterDataController.deleteConsumptionMethod)

//CMS CRUD 
router.get('/cms', ensureAuthenticated, cmsPageController.getCMS)
router.post('/cms', ensureAuthenticated, cmsPageController.getCMS)
router.get('/cms/add', ensureAuthenticated, cmsPageController.addCMS)
router.get('/cms/update/:id', ensureAuthenticated, cmsPageController.updateCMS)
router.post('/cms/manage', ensureAuthenticated, cmsPageController.manageCMS)
router.get('/cms/delete/:id', ensureAuthenticated, cmsPageController.deleteCMS)

//CONTENT CRUD 
router.get('/static-content', ensureAuthenticated, cmsPageController.getContentList)
router.post('/static-content', ensureAuthenticated, cmsPageController.getContentList)
router.get('/static-content/add', ensureAuthenticated, cmsPageController.addContent)
router.get('/static-content/update/:id', ensureAuthenticated, cmsPageController.updateContent)
router.post('/static-content/manage', masterUpload.single('cms_image'), ensureAuthenticated, cmsPageController.manageStaticContent)
router.get('/static-content/delete/:id', ensureAuthenticated, cmsPageController.deleteStaticContent)

//faqCategory crud
router.get('/faq-category', ensureAuthenticated, masterDataController.getFaqCategory)
router.post('/faq-category', ensureAuthenticated, masterDataController.getFaqCategory)
router.get('/faq-category/add', ensureAuthenticated, masterDataController.addFaqCategory)
router.get('/faq-category/update/:id', ensureAuthenticated, masterDataController.updateFaqCategory)
router.post('/faq-category/manage', ensureAuthenticated, masterDataController.manageFaqCategory)
router.post('/faq-category/delete/:id', ensureAuthenticated, masterDataController.deleteFaqCategory)

//FAQ crud
router.get('/faq', ensureAuthenticated, faqController.getFAQ)
router.post('/faq', ensureAuthenticated, faqController.getFAQ)
router.get('/faq/add', ensureAuthenticated, faqController.addFAQ)
router.get('/faq/update/:id', ensureAuthenticated, faqController.updateFAQ)
router.post('/faq/manage', ensureAuthenticated, faqController.manageFAQ)
router.get('/faq/delete/:id', ensureAuthenticated, faqController.deleteFAQ)
router.post('/faq/subcategory', ensureAuthenticated, faqController.getFAQSubCategory)

//coa crud
router.get('/coa', ensureAuthenticated, coaNumberController.getCoa)
router.post('/coa', ensureAuthenticated, coaNumberController.getCoa)
router.get('/coa/add', ensureAuthenticated, coaNumberController.addCoa)
router.get('/coa/update/:id', ensureAuthenticated, coaNumberController.updateCoa)
router.post('/coa/manage', masterUpload.fields([{ name: 'coa_image' }]), ensureAuthenticated, coaNumberController.manageCoa)
router.get('/coa/delete/:id', ensureAuthenticated, coaNumberController.deleteCoa)
router.get('/coa/download-sample-xls', ensureAuthenticated, coaNumberController.downloadSampleExcel)
router.post('/read-json-data', ensureAuthenticated, coaNumberController.readJsonData)
router.post('/coa/upload-xls', ensureAuthenticated, stateFileUpload.single('coa_data_file'), coaNumberController.uploadCOAExcelData)
router.get('/coa/details/:id', ensureAuthenticated, coaNumberController.getCOADetails)

//coa parser
router.get('/coa-upload', ensureAuthenticated, coaNumberController.getUploadCoa)
router.get('/coa-pending', ensureAuthenticated, coaNumberController.pendingCoa)
router.get('/coa-process/:id', ensureAuthenticated, coaNumberController.processCoa)
router.get('/coa-testlabs', ensureAuthenticated, coaNumberController.getCoaTestLabs)
router.get('/coa-testlabs/add', ensureAuthenticated, coaNumberController.coaTestLabs)
router.post('/coa-testlabs/add', ensureAuthenticated, coaNumberController.addTestLabs)
router.get('/coa-url-process', ensureAuthenticated, coaNumberController.getURLCoa)
router.get('/coa-search-list', ensureAuthenticated, coaNumberController.getCoaSearchList)
router.post('/coa-url-process', ensureAuthenticated, coaNumberController.getURLCoaProcess)
router.get('/coa-testlabs/edit/:id', ensureAuthenticated, coaNumberController.editTestLabs)
router.post('/parse-coa', ensureAuthenticated, uploadCoaFile.single('coa'), coaNumberController.parseCoa)
router.get('/coaqueue/delete/:id', ensureAuthenticated, coaNumberController.deletePendingCoa)

//Feedback listing
router.get('/feedback', ensureAuthenticated, feedbackController.getFeedback)
router.post('/feedback', ensureAuthenticated, feedbackController.getFeedback)
router.post('/feedback/delete/:id', ensureAuthenticated, feedbackController.deleteFeedback)

//Community Questions listing
router.get('/community-questions', ensureAuthenticated, communityQuestionsController.getCommunityQuestion)
router.post('/community-questions', ensureAuthenticated, communityQuestionsController.getCommunityQuestion)
router.get('/community-questions/update/:id', ensureAuthenticated, communityQuestionsController.updateCommunityQuestion)
router.post('/community-questions/manage', ensureAuthenticated, communityQuestionsController.manageCommunityQuestion)
router.get('/community-questions/comments/:id', ensureAuthenticated, communityQuestionsController.getCommunityQuestionComments)
router.get('/community-questions/delete/:id', ensureAuthenticated, communityQuestionsController.deleteCommunityQuestion)

//Community Question Category crud
router.get('/community-questions-category', ensureAuthenticated, masterDataController.getCommunityQuestionCategory);
router.post('/community-questions-category', ensureAuthenticated, masterDataController.getCommunityQuestionCategory);
router.post('/community-questions-category/add', ensureAuthenticated, masterDataController.addCommunityQuestionCategory);
router.get('/community-questions-category/update', ensureAuthenticated, masterDataController.getUpdateCommunityQuestionCategory);
router.post('/community-questions-category/update', ensureAuthenticated, masterDataController.updateCommunityQuestionCategory);
router.post('/community-questions-category/delete', ensureAuthenticated, masterDataController.deleteCommunityQuestionCategory);

//user crud
router.post('/userlist', ensureAuthenticated, userController.getUserList)
router.get('/userlist/update/:id', ensureAuthenticated, userController.userUpdate)
router.post('/userlist/manage', ensureAuthenticated, userImageUpload.single('profile_image'), userController.manageUserUpdate)
router.get('/userlist/block-unblock/:id', ensureAuthenticated, userController.blockUnblockUser)
router.get('/userlist/delete/:id', ensureAuthenticated, userController.deleteUser)
router.get('/userlist/export-user-info/:id', ensureAuthenticated, userController.exportUserInformation)
// router.get('/userlist/export-all-user-info', ensureAuthenticated, userController.exportAllUserInformation)
router.post('/userlist/delete-users', ensureAuthenticated, userController.bulkUserDelete)


//user diary listing
router.get('/userdiarylist', ensureAuthenticated, userController.getUserDiaryList)
router.post('/userdiarylist', ensureAuthenticated, userController.getUserDiaryList)
router.get('/userdiarylist/view/:id', ensureAuthenticated, userController.getUserDiaryView)

//sub admin crud
router.get('/subadminlist', ensureAuthenticated, subAdminController.getSubAdminList)
router.post('/subadminlist', ensureAuthenticated, subAdminController.getSubAdminList)
router.get('/subadminlist/add', ensureAuthenticated, subAdminController.addSubAdmin)
router.get('/subadminlist/update/:id', ensureAuthenticated, subAdminController.updateSubAdmin)
router.post('/subadminlist/manage', ensureAuthenticated, userImageUpload.single('profile_image'), subAdminController.manageSubAdmin)
router.get('/subadminlist/block-unblock/:id', ensureAuthenticated, subAdminController.blockUnblockSubAdmin)
router.get('/subadminlist/delete/:id', ensureAuthenticated, subAdminController.deleteSubAdmin)

//banner advertisement crud
router.get('/banner-advertisement', ensureAuthenticated, bannerAdvertisementController.getBannerAdvertisement)
router.post('/banner-advertisement', ensureAuthenticated, bannerAdvertisementController.getBannerAdvertisement)
router.get('/banner-advertisement/add', ensureAuthenticated, bannerAdvertisementController.addBannerAdvertisement)
router.get('/banner-advertisement/update/:id', ensureAuthenticated, bannerAdvertisementController.updateBannerAdvertisement)
router.post('/banner-advertisement/manage', ensureAuthenticated, bannerAdvertisementImageUpload.single('banner_advertisement_image'), bannerAdvertisementController.manageBannerAdvertisement)
router.get('/banner-advertisement/delete/:id', ensureAuthenticated, bannerAdvertisementController.deleteBannerAdvertisement)

//Condition 
router.get('/conditions', ensureAuthenticated, masterDataController.getConditionList)
router.post('/conditions', ensureAuthenticated, masterDataController.getConditionList)
router.get('/conditions/create', ensureAuthenticated, masterDataController.getCreateConditionView)
router.get('/conditions/update/:id', ensureAuthenticated, masterDataController.getUpdateConditionView)
router.post('/conditions/manage', ensureAuthenticated, masterUpload.fields([
  { name: 'condition_image', maxCount: 1 },
  { name: 'condition_icon', maxCount: 1 }
]), masterDataController.manageCondition)
router.get('/conditions/delete/:id', ensureAuthenticated, masterDataController.deleteCondition)
router.post('/conditions/manage-ordering', ensureAuthenticated, masterDataController.manageConditionOrdering)


//Product Type 
router.post('/product-types/subtypes', ensureAuthenticated, productController.getProductSubTypes)
router.get('/product-types', ensureAuthenticated, productController.getProductTypes)
router.post('/product-types', ensureAuthenticated, productController.getProductTypes)
router.get('/product-types/add', ensureAuthenticated, productController.getCreateProductTypeView)
router.get('/product-types/update/:id', ensureAuthenticated, productController.getUpdateProductTypeView)
router.post('/product-types/manage', ensureAuthenticated, productController.manageProductType)
router.get('/product-types/delete/:id', ensureAuthenticated, productController.deleteProductType)

//Products 
router.get('/products', ensureAuthenticated, productController.getProducts)
router.post('/products', ensureAuthenticated, productController.getProducts)
router.get('/products/add', ensureAuthenticated, productController.addProduct)
router.get('/products/update/:id', ensureAuthenticated, productController.updateProduct)
router.post('/products/manage', ensureAuthenticated, masterUpload.single('product_image'), productController.manageProduct)
router.get('/products/delete/:id', ensureAuthenticated, productController.deleteProduct)


//Country 
router.get('/country', ensureAuthenticated, masterDataController.getCountryList)
router.post('/country', ensureAuthenticated, masterDataController.getCountryList)
router.get('/country/add', ensureAuthenticated, masterDataController.getCreateCountryView)
router.get('/country/update/:id', ensureAuthenticated, masterDataController.getUpdateCountryView)
router.post('/country/manage', ensureAuthenticated, masterDataController.manageCountry)
router.get('/country/delete/:id', ensureAuthenticated, masterDataController.deleteCountry)


//State 
router.get('/states', ensureAuthenticated, masterDataController.getStateList)
router.post('/states', ensureAuthenticated, masterDataController.getStateList)
router.get('/states/add', ensureAuthenticated, masterDataController.getCreateStateView)
router.get('/states/update/:id', ensureAuthenticated, masterDataController.getUpdateStateView)
router.post('/states/manage', ensureAuthenticated, masterDataController.manageState)
router.get('/states/delete/:id', ensureAuthenticated, masterDataController.deleteState)
//router.get('/states/import-states',ensureAuthenticated, masterDataController.importStateList)


//Consumption Frequency 
router.get('/consumption-frequency', ensureAuthenticated, masterDataController.getConsumptionFrequencyList)
router.post('/consumption-frequency', ensureAuthenticated, masterDataController.getConsumptionFrequencyList)
router.get('/consumption-frequency/add', ensureAuthenticated, masterDataController.getCreateConsumptionFrequencyView)
router.get('/consumption-frequency/update/:id', ensureAuthenticated, masterDataController.getUpdateConsumptionFrequencyView)
router.post('/consumption-frequency/manage', ensureAuthenticated, masterDataController.manageConsumptionFrequency)
router.get('/consumption-frequency/delete/:id', ensureAuthenticated, masterDataController.deleteConsumptionFrequency)

//Consumption Reason 
router.get('/consumption-reason', ensureAuthenticated, masterDataController.getConsumptionReasonList)
router.post('/consumption-reason', ensureAuthenticated, masterDataController.getConsumptionReasonList)
router.get('/consumption-reason/add', ensureAuthenticated, masterDataController.getCreateConsumptionFrequencyView)
router.get('/consumption-reason/update/:id', ensureAuthenticated, masterDataController.getUpdateConsumptionFrequencyView)
router.post('/consumption-reason/manage', ensureAuthenticated, masterDataController.manageConsumptionFrequency)
router.get('/consumption-reason/delete/:id', ensureAuthenticated, masterDataController.deleteConsumptionFrequency)


router.get('/statistics/upload-statistics-data', ensureAuthenticated, StatisticsController.getUploadStatisticsDataForm)
router.post('/statistics/upload-statistics-data', ensureAuthenticated, stateFileUpload.single('stat_file'), StatisticsController.uploadStatisticsData)

//My Entourage Settings
router.get('/settings/my-entourage', ensureAuthenticated, masterDataController.getMyEntourageSettings)
router.get('/settings/my-entourage/update', ensureAuthenticated, masterDataController.updateMyEntourageSettingsForm)
router.post('/settings/my-entourage/update', masterUpload.fields([{ name: 'entourage_image' }]), ensureAuthenticated, masterDataController.updateMyEntourageSettings)

//TCD Updates
router.get('/tcd-updates', ensureAuthenticated, TCDUpdatesController.getPartnerUpdates);
router.get('/tcd-updates/add',ensureAuthenticated,TCDUpdatesController.addPartnerUpdate);
router.post('/tcd-updates/manage',ensureAuthenticated,TCDUpdatesController.managePartnerUpdate);
router.get('/tcd-updates/update/:id', ensureAuthenticated, TCDUpdatesController.updatePartnerUpdate)
router.get('/tcd-updates/delete/:id', ensureAuthenticated, TCDUpdatesController.deletePartnerUpdate)

module.exports = router;
