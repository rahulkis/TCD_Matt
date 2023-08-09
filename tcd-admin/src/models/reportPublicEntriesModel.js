const mongoose = require('mongoose')
const ReportedPublicEntriesSchema = new mongoose.Schema({
    entry_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Diary'
    },
    comment:{
        type:String,
        required:false
    },
    report_reason:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref: 'ReportReason'
    },
    reported_by:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
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
ReportedPublicEntriesSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
    },
    
});

const ReportedPublicEntries = mongoose.model('ReportedPublicEntries',ReportedPublicEntriesSchema)
module.exports = ReportedPublicEntries