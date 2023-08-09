const mongoose = require('mongoose')
const ReportedCommentsSchema = new mongoose.Schema({
    video_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Video'
    },
    comment_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    commented_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
ReportedCommentsSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
    },
    
});

const ReportedComment = mongoose.model('ReportedComment',ReportedCommentsSchema)
module.exports = ReportedComment