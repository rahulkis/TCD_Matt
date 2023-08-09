const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    area_of_improvement:{
        type:String,
        trim:true,
        enum:['Diary','Data Insight','Entourage Profile','Entry Summary','New Entry','Community','Cannabis Insignt','Recommendations','Profile','Settings','FAQ','Other'],
        required:[true,'Please select area of improvement'],
    },
    feedback:{
        type:String,
        trim:true,
        required:[true,'Please add an feedback'],
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
const Feedback = new mongoose.model('Feedback',feedbackSchema)
module.exports = Feedback