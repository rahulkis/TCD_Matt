const path = require('path')
const CommonHelper = require('../utils/commonHelper')
const NotifyHelper = require('../utils/notifyHelper')
const layout = require('../../config/layout');
const commonController = require('./commonController');
var publicUploadDir = path.resolve(__dirname, '../../public/uploads/');

const{ 
    sendFeedbackEmail
} = require('../utils/mailHelper');

const Excel = require('exceljs');
const Statistic = require('../models/statisticModel');
exports.getUploadStatisticsDataForm = async(req,res,next)=>{
    let data = commonController.getCommonParams('Upload Analysed Data', req);
    res.render('admin/stat_upload_form',{ layout: layout.admin.session_with, data })
}

exports.uploadStatisticsData = async(req,res,next)=>{
    console.log('hi')
    var imagePath = req.protocol+'://'+req.get('host')+'/uploads/statistics/'
    if(req.file){
        var filename = publicUploadDir+'/statistics/'+req.file.filename
    }
    console.log(filename)
    var workbook = new Excel.Workbook(); 
    let result = await workbook.xlsx.readFile(filename)
    //console.log(result)
    // if(result){
    //     let worksheet = workbook.getWorksheet('Sheet1');
    //     console.log(worksheet)
    // }
    let records = []
    workbook.xlsx.readFile(filename).then(function() {
        var worksheet = workbook.getWorksheet('Sheet1');
        var i = 0;
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {

            //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
            
            if(i >= 1){
                records.push({
                    title:row.values[1],
                    scale:row.values[3],
                    year:row.values[2],
                    updated_by:req.user._id
                })
            }
            i++;
        });
        console.log(records)
        if(records.length > 0){
            Statistic.insertMany(records, function(error, result){
                if(error){
                    console.log('Error is on insert', error);
                } 
                res.redirect('/admin/statistics/upload-statistics-data')
            });
            
        }
    });

}