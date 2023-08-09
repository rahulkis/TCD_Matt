const express = require('express');
const router = express.Router();
const { protect, partnerAuth } = require('../middleware/appAuth');
const AWS = require('aws-sdk');
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION_NAME, AWS_BUCKET } = process.env;
const s3Credentials = {
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION_NAME,
};

AWS.config.update(s3Credentials);
const s3 = new AWS.S3(s3Credentials.region);
var multer = require('multer');
var multerS3 = require('multer-s3');
var path = require('path');
const uploadPath = path.resolve(__dirname, '../../public/uploads');

const profileStorage = multer.diskStorage({
  destination: uploadPath + '/profile_image',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const profileUpload = multer({
  storage: profileStorage,
  limits: { filesize: 10 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
});

//COA PDF Image Storeage
const coaPDFImageStorage = multerS3({
  s3: s3,
  bucket: 'tcd-coaparser',
  key: function (req, file, cb) {
    console.log(file);
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const uploadCoaFile = multer({
  storage: coaPDFImageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|png|jpg|jpeg|tiff)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
});

const previewStorage = multer.diskStorage({
  destination: uploadPath + '/preview_image',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const previewImageUpload = multer({
  storage: previewStorage,
  // limits: { filesize: 10 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
});

const {
  signup,
  login,
  getMasterData,
  getStateList,
  getConsumptionMethods,
  forgotPassword,
  resetPassword,
  getAboutUsPage,
  getPrivacyPolicyPage,
  getTerms,
  viewProfile,
  updateProfile,
  changePassword,
  dashboard,
  getIntroVideos,
  getWelcomePage,
  createEntry,
  getDiaryEntries,
  getIncompleteDiaryEntries,
  getPublicEntries,
  getFavouriteEntries,
  markPublicEntry,
  markFavouriteEntry,
  reviewEntry,
  addEntryComment,
  getArticles,
  getVideos,
  getVideoDetails,
  getCMPageSDetails,
  markFavouriteVideo,
  addVideoComment,
  contactSupport,
  sendFeedback,
  getFAQ,
  communityInfo,
  postCommunityQuestion,
  markFavouriteQuestion,
  getAllEntries,
  getCOAinformation,
  completeEntry,
  getDiaryEntryDetails,
  getPublicEntriesBlock,
  getPublicEntriesBlocked,
  getPublicEntriesUnBlock,
  getCompositions,
  getStaticContent,
  fingerPrintLogin,
  updateTutorialFlag,
  activateAccount,
  deactivateAccount,
  deleteAccount,
  getSettingsInfo,
  updateNotificationSettings,
  getProductTypes,
  createProduct,
  getBannerAdvertisements,
  updateEntryFlag,
  getSymptomsGraphData,
  getEffectGraphData,
  getActivityGraphData,
  reportSpam,
  reportVideo,
  reportReason,
  reportPublicEntries,
  reportQuestion,
  addCommunityQuestionComment,
  verify2FACode,
  logout,
  uploadCoa,
  getEntryAdditionalInformation,
  getAllProducts,
  getProductDetails,
  getAds,
  getActivitiesProducts,
  getPopularCategories,
  getProductBySelectedCategories,
  getApiCallLogs,
  getCommunityEntries,
  getBrands,
  getRecommendations
} = require('../controllers/apiController');

router.route('/get-master-data').get(getMasterData);
router.route('/get-consumption-methods').get(getConsumptionMethods);
router.route('/get-entry-additional-information').get(getEntryAdditionalInformation);
router.route('/get-statelist').get(getStateList);
router.route('/product-types').get(getProductTypes);
router.route('/api-call-logs').get(protect, getApiCallLogs);
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/page/about-us').get(getAboutUsPage);
router.route('/page/welcome').get(getWelcomePage);
router.route('/page/privacy-policy').get(getPrivacyPolicyPage);
router.route('/page/terms').get(getTerms);
router.route('/profile-view').get(protect, viewProfile);
router.route('/profile-update').post(protect, profileUpload.single('profile_image'), updateProfile);
router.route('/change-password').post(protect, changePassword);
router.route('/dashboard').get(protect, dashboard);
router.route('/intro-videos').get(protect, getIntroVideos);
router.route('/diary-entries').get(protect, getDiaryEntries);
router.route('/incomplete-diary-entries').get(protect, getIncompleteDiaryEntries);
router.route('/create-entry').post(protect, createEntry);
router.route('/mark-public-entry').post(protect, markPublicEntry);
router.route('/add-entry-comment').post(protect, addEntryComment);
router.route('/mark-favourite-entry').post(protect, markFavouriteEntry);
router.route('/review-entry').post(protect, reviewEntry);
router.route('/articles').get(protect, getArticles);
router.route('/videos').get(protect, getVideos);
router.route('/video-details').get(protect, getVideoDetails);
router.route('/page/:slug').get(protect, getCMPageSDetails);
router.route('/contact').post(protect, contactSupport);
router.route('/send-feedback').post(protect, sendFeedback);
router.route('/faqs').get(protect, getFAQ);
router.route('/mark-favourite-video').post(protect, markFavouriteVideo);
router.route('/add-video-comment').post(protect, addVideoComment);
router.route('/community-info').get(protect, communityInfo);
router.route('/community-entries').get(protect, getCommunityEntries);
router.route('/post-community-question').post(protect, postCommunityQuestion);
router.route('/mark-favourite-community-question').post(protect, markFavouriteQuestion);
router.route('/public-entries').get(protect, getPublicEntries);
router.route('/public-entries/block').post(protect, getPublicEntriesBlock);
router.route('/public-entries/unblock').post(protect, getPublicEntriesUnBlock);
router.route('/public-entries/block').get(protect, getPublicEntriesBlocked);
router.route('/favourite-entries').get(protect, getFavouriteEntries);
router.route('/get-coa-info').get(protect, getCOAinformation);
router.route('/upload-coa').post(protect, uploadCoaFile.single('coa'), uploadCoa);
router.route('/all-diary-entries').get(protect, getAllEntries);
router.route('/save-complete-entry').post(protect, completeEntry);
router.route('/get-entry-details').get(protect, getDiaryEntryDetails);
router.route('/compositions').get(getCompositions);
router.route('/get-content/:slug').get(getStaticContent);
router.route('/get-all-products/').get(getAllProducts);
router.route('/get-product-details/:id').get(getProductDetails);
router.route('/biometric-login').post(fingerPrintLogin);
router.route('/update-tutorial-flag').post(protect, updateTutorialFlag);
router.route('/activate-account').post(activateAccount);
router.route('/deactivate-account').post(protect, deactivateAccount);
router.route('/delete-account').post(protect, deleteAccount);
router.route('/get-settings').get(protect, getSettingsInfo);
router.route('/update-settings').post(protect, updateNotificationSettings);
router.route('/create-product').post(protect, createProduct);
router.route('/get-banner-advertisements').get(protect, getBannerAdvertisements);
router.route('/update-entry-notify-flag').post(protect, updateEntryFlag);
router.route('/get-activity-graph-data').get(protect, getActivityGraphData);
router.route('/get-symptom-graph-data').get(protect, getSymptomsGraphData);
router.route('/get-effect-graph-data').get(protect, getEffectGraphData);
router.route('/report-reason').get(protect, reportReason);
router.route('/report-spam').post(protect, reportSpam);
router.route('/report-video').post(protect, reportVideo);
router.route('/report-public-entries').post(protect, reportPublicEntries);
router.route('/report-questions').post(protect, reportQuestion);
router.route('/add-community-question-comment').post(protect, addCommunityQuestionComment);
router.route('/verify-2FA-code').post(protect, verify2FACode);
router.route('/logout').post(protect, logout);
router.route('/get-ads/:pageName').get(protect, getAds);
router.route('/get-activities-products').get(protect, getActivitiesProducts);
router.route('/get-popular-categories').get(protect, getPopularCategories);
router.route('/get-product-by-selected-categories').get(getProductBySelectedCategories);
router.route('/get-all-brands').get(getBrands);
router.route('/get-recommendations').get(getRecommendations);
// partner API's
const {
  partnerLogin,
  getHomeData,
  getPartnerEntries,
  getPartnerProducts,
  getPartnerProductTypes,
  getPartnerProductFilter,
  getPartnerEntriesFilter,
  partnerSignup,
  //getPartnerEntriesFilter,
  partnerSupport,
  startCampaign,
  getCampaigns,
  viewCampaign,
  updateCampaign,
  partnerGetSetting,
  partnerUpdateSetting,
  partnerAddUser,
  partnerGetUser,
  partnerDeleteUser,
  partnerGetEditUser,
  partnerUpdateUser,
  getPartnerProductsInfo,
  getPartnerEntriesInfo,
  partnerLogout,
  getAdvertisementInfo,
  publishAds,
  viewAdvertisement,
  updateAdvertisement,
  partnerForgotPassword,
  partnerResetPassword,
  getProfileMain,
  getProfileDemographics,
  getProfilePurpose,
  getProfileReason,
  getProfileFrequency,
  getObjectivesEntries,
  getObjectivesTop5,
  getObjectivesReason,
  getCategories,
  getRatingAndReviewsMain,
  getRatingAndReviewsComments,
  getHomeUserComment,
  getPublishedUpdates,
  getPublishedUpdatesById,
  getTopProducts,
  getTopCategories,
  getTopActivities,
  getTopHealthConditions,
  getTopEffects,
  getTopSymptoms,
  getObjectivesMain,
  getTopBrands,
  getConsumer,
  getHomeEntries,
  getAllState,
  getPartnerEntryDetails,
} = require('../controllers/partnerApiController');
// auth api's
router.route('/partner-login').post(partnerLogin);
router.route('/partner-signup').post(partnerSignup);
router.route('/partner-forgot-password').post(partnerForgotPassword);
router.route('/partner-reset-password').post(partnerResetPassword);

//home api's
router.route('/home-data/user-comments').get(getHomeUserComment);
router.route('/home-data/:userId').get(partnerAuth, getHomeData);
router.route('/home-graph/entries').get(getHomeEntries);
// router.route("/home-data/:userId").get(getHomeData);

//entries api's
// router.route("/get-entries").get(getPartnerEntries);
// router.route("/get-entries-filter").get(getPartnerEntriesFilter);
// router.route("/get-entries-info/:entryId/:userId").get(getPartnerEntriesInfo);
router.route('/get-entries').get(partnerAuth, getPartnerEntries);
router.route('/get-entries-filter').get(partnerAuth, getPartnerEntriesFilter);
router.route('/get-entries-info/:entryId/:userId').get(partnerAuth, getPartnerEntriesInfo);

//consumer api's
// router.route("/get-profiles-main").get(getProfileMain);
// router.route("/get-profiles-demographics").get(getProfileDemographics);
// router.route("/get-profiles-purpose").get(getProfilePurpose);
// router.route("/get-profiles-reason").get(getProfileReason);
// router.route("/get-profiles-frequency").get(getProfileFrequency);
// router.route("/get-objectives-entries").get(getObjectivesEntries);
// router.route("/get-objectives-top5").get(getObjectivesTop5);
// router.route("/get-objectives-reason").get(getObjectivesReason);
// router.route("/get-categories").get(getCategories);
// router.route("/get-ratingandreviews-main").get(getRatingAndReviewsMain);
// router.route("/get-ratingandreviews-comments").get(getRatingAndReviewsComments);
router.route('/get-profiles-main').get(getProfileMain);
router.route('/get-profiles-demographics').get(partnerAuth, getProfileDemographics);
router.route('/get-profiles-purpose').get(getProfilePurpose);
router.route('/get-profiles-reason').get(partnerAuth, getProfileReason);
router.route('/get-profiles-frequency').get(partnerAuth, getProfileFrequency);
router.route('/get-objectives-main').get(getObjectivesMain);
router.route('/get-objectives-entries').get(getObjectivesEntries);
router.route('/get-objectives-top5').get(partnerAuth, getObjectivesTop5);
router.route('/get-objectives-reason').get(getObjectivesReason);
router.route('/get-categories').get(getCategories);
router.route('/get-ratingandreviews-main').get(getRatingAndReviewsMain);
router.route('/get-ratingandreviews-comments').get(getRatingAndReviewsComments);
router.route('/get-partner-entry-details/:entryId').get(getPartnerEntryDetails);

// products api's
// router.route("/get-products").get(getPartnerProducts);
// router.route("/get-product-types").get(getPartnerProductTypes);
// router.route("/get-products-info").get(getPartnerProductsInfo);
// router.route("/get-product-filter").get(getPartnerProductFilter);
router.route('/get-products').get(getPartnerProducts);
router.route('/get-product-types').get(partnerAuth, getPartnerProductTypes);
router.route('/get-products-info').get(getPartnerProductsInfo);
router.route('/get-product-filter').get(partnerAuth, getPartnerProductFilter);

// advertisement api's
// router.route("/start-campaign").post(startCampaign);
// router.route("/get-campaigns").get(getCampaigns);
// router.route("/view-campaign/:campaignId").get(viewCampaign);
// router.route("/get-advertisement-info").get(getAdvertisementInfo);
// router.route("/publish-ads").post(publishAds);
router.route('/start-campaign').post(partnerAuth, startCampaign);
router.route('/get-campaigns').get(partnerAuth, getCampaigns);
router.route('/view-campaign/:campaignId').get(partnerAuth, viewCampaign);
router.route('/update-campaign/:id').put(partnerAuth, updateCampaign);
router.route('/get-advertisement-info').get(partnerAuth, getAdvertisementInfo);
router.route('/publish-ads').post(partnerAuth, previewImageUpload.single('advertisement_image'), publishAds);

router.route('/create-new-ad/:advertisementId').get(partnerAuth, viewAdvertisement);
router.route('/update-ads/:advertisementId').put(partnerAuth, previewImageUpload.single('advertisement_image'), updateAdvertisement);
// support api's
// router.route("/partner-support").post(partnerSupport);
router.route('/partner-support').post(partnerAuth, partnerSupport);

// setting api's
// router.route("/get-setting-detail").get(partnerGetSetting);
// router.route("/update-setting-detail").post(partnerUpdateSetting);
// router.route("/add-user").post(partnerAddUser);
// router.route("/get-user-list").get(partnerGetUser);
// router.route("/delete-user").post(partnerDeleteUser);
// router.route("/edit-user").get(partnerGetEditUser);
// router.route("/update-user").post(partnerUpdateUser);
router.route('/get-setting-detail').get(partnerAuth, partnerGetSetting);
router.route('/update-setting-detail').post(partnerAuth, partnerUpdateSetting);
router.route('/add-user').post(partnerAuth, partnerAddUser);
router.route('/get-user-list').get(partnerAuth, partnerGetUser);
router.route('/delete-user').post(partnerAuth, partnerDeleteUser);
router.route('/edit-user').get(partnerAuth, partnerGetEditUser);
router.route('/update-user').post(partnerAuth, partnerUpdateUser);

//partner logout api's
router.route('/partner-logout/:token').post(partnerLogout);
// router.route('/partner-logout').post(partnerAuth, partnerLogout);

//TCD Updates
router.route('/tcd-updates').get(partnerAuth, getPublishedUpdates);
router.route('/tcd-updates/:id').get(partnerAuth, getPublishedUpdatesById);

// MArket Insight Api's
router.route('/get-top-products').get(partnerAuth, getTopProducts);
router.route('/get-top-categories').get(partnerAuth, getTopCategories);
router.route('/get-top-activities').get(partnerAuth, getTopActivities);
router.route('/get-top-conditions').get(partnerAuth, getTopHealthConditions);
router.route('/get-top-effects').get(partnerAuth, getTopEffects);
router.route('/get-top-symptoms').get(partnerAuth, getTopSymptoms);
router.route('/get-top-brands').get(partnerAuth, getTopBrands);
router.route('/get-consumers').get(getConsumer);
router.route('/get-all-states').get(partnerAuth, getAllState);

module.exports = router;
