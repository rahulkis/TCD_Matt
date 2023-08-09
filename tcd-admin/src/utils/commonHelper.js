var request = require('request');

const formatedDate = function(inputDate,type){
    let formatedDate = ''
    let formatedMonth = ''
    let sortFormatedMonth = ''
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const sortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    if(inputDate){
        //console.log(inputDate)
        var year = inputDate.getUTCFullYear()
        const month = inputDate.getUTCMonth()
        var day = inputDate.getUTCDate()
        var weekDay = inputDate.getUTCDay()

        var seconds = inputDate.getSeconds();
        var minutes = inputDate.getUTCMinutes();
        var hour = inputDate.getUTCHours();
        var ampm = (hour >= 12) ? "PM" : "AM";
        
        for (const index in months) {
            if(index == month){
                formatedMonth = months[month]
                sortFormatedMonth = sortMonths[month]
            }
        }
        if(type == 1){
            formatedDate = ((day < 10) ? ('0'+day) : day)+' '+formatedMonth+' '+year
        }
        if(type == 2){
            formatedDate = year+'/'+(month < 9 ? '0'+(month+1) : (month+1))+'/'+((day < 10) ? ('0'+day) : day)
        }
        if(type == 3){
            // 05/23/20
            formatedDate = (month < 9 ? '0'+(month+1) : (month+1))+'/'+((day < 10) ? ('0'+day) : day)+'/'+year
        }
        if(type == 4){
            formatedDate = ((hour < 10) ? ('0'+hour) : hour)+':'+((minutes < 10) ? ('0'+minutes) : minutes)+' '+ampm
        }
        if(type == 5){
            formatedDate = ((day < 10) ? ('0'+day) : day)+' '+formatedMonth+', '+year
        }
        if(type == 6){
            //July 07, 2020
            formatedDate = formatedMonth+' '+((day < 10) ? ('0'+day) : day)+', '+year
        }
        if(type == 7){
            formatedDate = year+'-'+(month < 9 ? '0'+(month+1) : (month+1))+'-'+((day < 10) ? ('0'+day) : day)
        }
        if(type == 8){
            formatedDate = ((hour < 10) ? ('0'+hour) : hour)+':'+((minutes < 10) ? ('0'+minutes) : minutes)
        }
        if(type == 9){
            formatedDate = days[weekDay]
        }
        

    }
    //console.log(formatedDate)
    return formatedDate.toString()
}

const dynamicSort =  function (property) {
    var sortOrder = -1;
    //console.log(property)
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }        
    }
}

const getProperDate = function (inputDate){
    dateArr = inputDate.split('/')
    let year = dateArr[0]
    month = parseInt(dateArr[1]-1)
    day = dateArr[2]
    return new Date(Date.UTC(year, month, day))
}

const unlinkFile = async (filePath) => {
    let fs = require('fs');
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
    return 
}

const generateCode = async()=>{
    const randomstring = require('randomstring');
    var referralCode = ''
    referralCode = await randomstring.generate({
        length: 6,
        charset: 'alphanumeric',
        capitalization:'uppercase'
    });
    return referralCode
}
const singleImageUpload = function(folderName){
    var multer = require('multer')
    var path = require('path');
    const uploadPath = path.resolve(__dirname, '../../public/uploads')
    const storage = multer.diskStorage({
        destination:uploadPath+'/'+folderName,
        filename:function(req,file,cb){
            cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
        }
    })
    //return storage;
    let upload = multer({
        storage,
        limits:{filesize:10},
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload an image'))
            }
            cb(undefined, true)
        }
    })
    

    return upload
}
const uploadResponse = (req,callback)=> {
    var multer = require('multer')
    console.log(req.file)
    if (req.fileValidationError) {
        callback(error.req.fileValidationError,undefined)
    }
    else if (err instanceof multer.MulterError) {
        callback(err,undefined)
    }
    else if (err) {
        callback(err,undefined)
    }
    if(req.file){
        let profileImage = req.file.filename
        callback(profileImage)
    }
}
const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const roundUp =  (num, precision)=> {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
}




//Rnd
const encrypt = function (text) {
    const crypto = require('crypto');
    const algorithm = 'aes-256-cbc';
    
    const key_new = 'g6ZOpvHQ78X4PbLzmU5eErPRtdh6mAXp';
    const iv_new = 'o6SG75PDEbNTBYJV';

    var cipher = crypto.createCipheriv(algorithm,key_new,iv_new)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

const decrypt = function (text) {
    const crypto = require('crypto');
    const algorithm = 'aes-256-cbc';
    
    const key_new = 'g6ZOpvHQ78X4PbLzmU5eErPRtdh6mAXp';
    const iv_new = 'o6SG75PDEbNTBYJV';

    var decipher = crypto.createDecipheriv(algorithm,key_new,iv_new)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}
const getExcerpt = function(originalString,length){
    let strippedString = originalString.replace(/(<([^>]+)>)/gi, "");
    if(strippedString.length > length){
        strippedString = strippedString.substring(0, length)+' ...'
    }
    return strippedString;

}
const getStartDateofWeek = function(inputdate){
    // var first = curr.getDate() - curr.getDay(); 
    // // First day is the  day of the month - the day of the week  
    // var last = first + 6; // last day is the first day + 6   
    // firstday = new Date(curr.setDate(first)).toISOString();   
    // lastday = new Date(curr.setDate(curr.getDate()+6)).toISOString();
    // console.log(firstday+lastday)
    // return firstday

    var diff = inputdate.getDate() - inputdate.getDay() + (inputdate.getDay() === 0 ? -6 : 1);
    var startOfWeek = new Date(inputdate.setDate(diff)).toISOString();
    //startOfWeek.setHours(0,0,0,0)
    return startOfWeek
}
function DayOfMonth(inputDate,type) {
    const Year = inputDate.getFullYear()
    const Month = inputDate.getMonth()
    if(type == 1){
        return new Date(Year, Month, 1);
    }
    if(type == 2){
        return new Date((new Date(Year, Month, 1)) - 1);
    }
    
}
const generatePdf = (docDefinition, callback) => {
    const pdfMakePrinter = require('pdfmake/src/printer');
    try {
        //const fontDescriptors = { ...font } 
        const fontDescriptors = {
            fontSize: 12, 
            Roboto: {
                normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
                bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
                italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
                bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'

            } 
        }
      const printer = new pdfMakePrinter(fontDescriptors);
      const doc = printer.createPdfKitDocument(docDefinition);
      
      let chunks = [];
  
      doc.on('data', (chunk) => {
        chunks.push(chunk);
      });
    
      doc.on('end', () => {
        //callback(Buffer.concat(chunks));
        const result = Buffer.concat(chunks);
        callback('data:application/pdf;base64,' + result.toString('base64'));
      });
      
      doc.end();
      
    } catch(err) {
      throw(err);
    }
};
const saveGeneratedPdf = (docDefinition, callback) => {
    const pdfMakePrinter = require('pdfmake/src/printer');
    const fs = require('fs');
    try {
        //const fontDescriptors = { ...font } 
        const fontDescriptors = {
            fontSize: 12, 
            Roboto: {
                normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
                bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
                italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
                bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'

            } 
        }
      const printer = new pdfMakePrinter(fontDescriptors);
      const doc = printer.createPdfKitDocument(docDefinition);
      doc.pipe(
        fs.createWriteStream('public/uploads/filename.pdf').on("error", (err) => {
          errorCallback(err.message);
        })
      );
      
      doc.on('end', () => {
        callback("PDF successfully created and stored");
      });
      
      
      doc.end();
      
    } catch(err) {
      throw(err);
    }
};

const regexEscape =(string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const convertMinsToHrsMins = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m}`;
}
const checkImageUrlPath = async (url) => {
    return new Promise((resolve, reject) => {
        request(url,function(error, response, body){
                if (error) {
                  reject(error);
                }
                resolve(response.statusCode);
        })
    })
}

module.exports = {
    formatedDate,
    dynamicSort,
    getProperDate,
    unlinkFile,
    generateCode,
    singleImageUpload,
    imageFilter,
    uploadResponse,
    encrypt,
    decrypt,
    getExcerpt,
    getStartDateofWeek,
    DayOfMonth,
    generatePdf,
    saveGeneratedPdf,
    roundUp,
	regexEscape,
    convertMinsToHrsMins,
    checkImageUrlPath
}