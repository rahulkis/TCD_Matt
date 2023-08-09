const mongoose = require('mongoose')

const communityQuestionsSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add a category name'],
        maxlength:[150,'Name can not be more than 150 characters']
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
const CommunityQuestionCategory = new mongoose.model('CommunityQuestionCategory',communityQuestionsSchema)
module.exports = CommunityQuestionCategory