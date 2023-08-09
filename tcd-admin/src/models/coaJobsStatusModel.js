const mongoose = require('mongoose')

const CoaJobsSchema = new mongoose.Schema({
    job_id:{
        type:String,
        trim:true,
        required:false
    },
    filename:{
        type:String,
        trim:true,
        required:true
    },
    originalFilename:{
        type:String,
        trim:true,
        required:true
    },
    parsedCoa:[{}],
    coatestlabs:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref: 'coaTestLabs'
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    update_date:{
        type:Date,
        required:false
    },
    completed_date:{
        type:Date,
        required:false
    },
    job_status:{
        type:String,
        required:false
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref: 'User'
    },
    is_deleted:{
        type:Number,
        default:0
    }
})
const CoaJobs = new mongoose.model('coajobstatus',CoaJobsSchema)
module.exports = CoaJobs