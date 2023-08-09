const CommonHelper = require('../utils/commonHelper');
const moment = require('moment');

const getCommonParams = (pagename, req, sessionKey = '') => {
  let data = {
    pageTitle: pagename,
    danger: req.flash('danger'),
    success: req.flash('success'),
    loggedUser: undefined,
    filterDatas: req.body,
    isCollapsOpen: false,
    postData: req.body,
    projectName: 'TCD',
  };
  try {
    if (req.user) {
      data.loggedUser = req.user;
    }

    //session filter check
    if (data.filterDatas && data.filterDatas.filter) {
      data.postData = {};
      delete req.session.filterSes;
      if (data.filterDatas.filter != '2') {
        data.isCollapsOpen = true;
        if (data.filterDatas.filter == '1') {
          if (sessionKey && sessionKey.length > 0) {
            let sesData = {};
            sesData[sessionKey] = data.filterDatas;
            req.session.filterSes = sesData;
          }
        }
      } else {
        data.filterDatas = {};
      }
    } else {
      data.filterDatas = {};
      if (sessionKey && sessionKey.length > 0) {
        if (req.session.filterSes) {
          if (req.session.filterSes[sessionKey]) {
            data.filterDatas = req.session.filterSes[sessionKey];
            data.isCollapsOpen = true;
            data.postData = {};
          }
        }
      }
    }
    //if page query present
    // if (req.query.page_no && req.query.page_no > 0) {
    //   data.filterDatas.page_no = req.query.page_no;
    // }
    if (data.filterDatas.page_no != 1 && req.query.page_no && req.query.page_no > 0) {
      data.filterDatas.page_no = req.query.page_no;
    }
    if (req.query.full_name || req.body.full_name) {
      data.filterDatas.full_name = req.body && req.body.full_name ? req.body.full_name : req.query.full_name  || "";
    }
    if (req.query.email || req.body.email) {
      data.filterDatas.email = req.body && req.body.email ? req.body.email : req.query.email  || "";
    }
    if (req.query.contact_no || req.body.contact_no) {
      data.filterDatas.contact_no = req.body && req.body.contact_no ? req.body.contact_no : req.query.contact_no  || "";
    }
    if (req.query.daterange || req.body.daterange) {
      data.filterDatas.daterange = req.body && req.body.daterange ? req.body.daterange : req.query.daterange  || "";
    }
    if (req.query.filter || req.body.filter) {
      data.filterDatas.filter = req.body && req.body.filter ? req.body.filter : req.query.filter  || "";
    }
    if (req.query.filterDateType || req.body.filterDateType) {
      data.filterDatas.filterDateType = req.body && req.body.filterDateType ? req.body.filterDateType : req.query.filterDateType || "";
    }

    //form post not for filter section
    if (data.postData && data.postData.frmpost) {
      let sesData = {};
      sesData.postSessionKey = data.postData;
      req.session.postSes = sesData;
      data.isCollapsOpen = true;
    } else {
      data.postData = {};
      if (req.session.postSes) {
        if (req.session.postSes.postSessionKey) {
          data.postData = req.session.postSes.postSessionKey;
          data.isCollapsOpen = true;
        }
      }
    }
  } catch (e) {
    console.log('Error Msg :: ', e.message);
    throw new Error(e.message);
  }
  return data;
};
const cleanPostData = async (req) => {
  req.session.postSes = {};
  return true;
};

const getTags = () => {
  let allTags = [];
  return allTags;
};

const getWeights = () => {
  let weights = [];
  for (let i = 0; i <= 20; i++) {
    if (i == 11) {
      weights.push('10+');
    }
    weights.push(i);
  }
  return weights;
};

const validEmail = async (email) => {
  let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  let valid = emailRegex.test(email);
  return valid;
};

const getPerPageRecord = () => {
  return 20;
};
const getPageMaxRecord = () => {
  return 2000;
};

// random string for password
const getRandomPassword = async () => {
  const randstr = await randomstring.generate({
    length: 8,
    readable: true,
    charset: 'alphanumeric',
  });
  return randstr;
};

const getEncriptString = async (str) => {
  return bcrypt.hashSync(str, 8);
};

// end random password

//ucword functionality
const ucwords = (str) => {
  return CommonHelper.ucwords(str);
};
//check empty object
const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};
// end ucwords functionality

// filterDates functionality
const getFilterDates = (filterDateObj) => {
  let returnDateObj = {
    startDate: moment(),
    endDate: moment(),
  };
  if (filterDateObj.selected === '6' || filterDateObj.selected == undefined) {
    // 6 months
    returnDateObj.startDate = moment().subtract(6, 'months').startOf('month').format('l');
    returnDateObj.endDate = moment().subtract(1, 'months').endOf('month').format('l');
  } else if (filterDateObj.selected === '1') {
    // this month
    returnDateObj.startDate = moment().startOf('month').format('l');
    returnDateObj.endDate = moment().endOf('month').format('l');
  } else if (filterDateObj.selected === '2') {
    // last 30 days
    returnDateObj.startDate = moment().subtract(30, 'days').format('l');
    returnDateObj.endDate = moment().format('l');
  } else if (filterDateObj.selected === '3') {
    // 3 months
    returnDateObj.startDate = moment().subtract(3, 'months').startOf('month').format('l');
    returnDateObj.endDate = moment().subtract(1, 'months').endOf('month').format('l');
  } else if (filterDateObj.selected === '4') {
    // last month
    returnDateObj.startDate = moment().subtract(1, 'months').startOf('month').format('l');
    returnDateObj.endDate = moment().subtract(1, 'months').endOf('month').format('l');
  } else {
    // apply date range
    if (filterDateObj && filterDateObj.dateRange) {
      const splitDateRange = filterDateObj.dateRange.replace(/\s+/g, '').split('-');
      returnDateObj.startDate = splitDateRange[0];
      returnDateObj.endDate = splitDateRange[1];
    }
  }
  return returnDateObj;
};
// end of filterDates functionality

// dateRangeArray functionality
const dateRangeArray = () => {
  const dateRange = [
    { value: '6', month: '6 months' },
    { value: '1', month: 'This month' },
    { value: '2', month: 'Show Last 30 days' },
    { value: '4', month: 'Last month' },
    { value: '3', month: '3 months' },
    { value: '0', month: 'Date Range' },
  ];
  return dateRange;
};
// end of dateRangeArray functionality

module.exports = {
  getCommonParams: getCommonParams,
  validEmail: validEmail,
  getTags: getTags,
  cleanPostData: cleanPostData,
  getPerPageRecord: getPerPageRecord,
  getPageMaxRecord: getPageMaxRecord,
  getRandomPassword: getRandomPassword,
  getEncriptString: getEncriptString,
  ucwords: ucwords,
  isEmptyObject: isEmptyObject,
  getWeights,
  getFilterDates,
  dateRangeArray,
};
