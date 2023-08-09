import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const formatedDate = function (inputDate, type) {
  let formatedDate = '';
  let formatedMonth = '';
  let sortFormatedMonth = '';
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const sortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  if (inputDate) {
    var year = new Date(inputDate).getUTCFullYear();
    var month = new Date(inputDate).getUTCMonth();
    var day = new Date(inputDate).getUTCDate();
    var weekDay = new Date(inputDate).getUTCDay();

    var seconds = new Date(inputDate).getSeconds();
    var minutes = new Date(inputDate).getUTCMinutes();
    var hour = new Date(inputDate).getUTCHours();
    var ampm = hour >= 12 ? 'PM' : 'AM';

    for (const index in months) {
      if (index == month.toString()) {
        formatedMonth = months[month];
        sortFormatedMonth = sortMonths[month];
      }
    }
    if (type == 1) {
      formatedDate =
        (day < 10 ? '0' + day : day) + ' ' + formatedMonth + ' ' + year;
    }
    if (type == 2) {
      formatedDate =
        year +
        '/' +
        (month < 9 ? '0' + (month + 1) : month + 1) +
        '/' +
        (day < 10 ? '0' + day : day);
    }
    if (type == 3) {
      // 05/23/20
      formatedDate =
        (month < 9 ? '0' + (month + 1) : month + 1) +
        '/' +
        (day < 10 ? '0' + day : day) +
        '/' +
        year;
    }
    if (type == 4) {
      formatedDate =
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes) +
        ' ' +
        ampm;
    }
    if (type == 5) {
      formatedDate =
        (day < 10 ? '0' + day : day) + ' ' + formatedMonth + ', ' + year;
    }
    if (type == 6) {
      //July 07, 2020
      formatedDate =
        formatedMonth + ' ' + (day < 10 ? '0' + day : day) + ', ' + year;
    }
    if (type == 7) {
      formatedDate =
        year +
        '-' +
        (month < 9 ? '0' + (month + 1) : month + 1) +
        '-' +
        (day < 10 ? '0' + day : day);
    }
    if (type == 8) {
      formatedDate =
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minutes < 10 ? '0' + minutes : minutes);
    }
    if (type == 9) {
      formatedDate = days[weekDay];
    }
  }
  //console.log(formatedDate)
  return formatedDate.toString();
};

const getExcerpt = function (originalString, length) {
  let strippedString = originalString.replace(/(<([^>]+)>)/gi, '');
  if (strippedString.length > length) {
    strippedString = strippedString.substring(0, length) + ' ...';
  }
  return strippedString;
};

const dynamicSort = function (property) {
  let sortOrder = -1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
};

const convertMinsToHrsMins = (mins) => {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const h = hours < 10 ? '0' + hours : hours;
  const m = minutes < 10 ? '0' + minutes : minutes;
  return `${h}:${m}`;
};

const getWeekNumber = (currentDate) => {
  const startDate: any = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  const weekNumber = Math.ceil(days / 7);
  return weekNumber;
};

const roundUp = (num, precision) => {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
};

const encrypt = async function (text) {
  const iv = randomBytes(16);
  const password = randomBytes(16);
  const algorithm = 'aes-256-ctr';

  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const cipher = createCipheriv(algorithm, key, iv);

  const textToEncrypt = text;
  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);
  // const algorithm = 'aes-256-cbc';

  // const key_new = 'g6ZOpvHQ78X4PbLzmU5eErPRtdh6mAXp';
  // const iv_new = 'o6SG75PDEbNTBYJV';

  // var cipher = crypto.createCipheriv(algorithm, key_new, iv_new)
  // var crypted = cipher.update(text, 'utf8', 'hex')
  // crypted += cipher.final('hex');
  return encryptedText;
}

export {
  formatedDate,
  getExcerpt,
  dynamicSort,
  convertMinsToHrsMins,
  getWeekNumber,
  roundUp,
  encrypt
};
