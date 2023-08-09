const mongoose = require('mongoose')
const ReportReasonSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false,
        ref: 'ReportReason'
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    updated_at:{
        type:Date,
        default: Date.now
    },
    is_active:{
        type:Number,
        default:1
    },
    is_deleted:{
        type:Number,
        default:0
    }
})

const ReportReason = mongoose.model('reportreason',ReportReasonSchema)
module.exports = ReportReason