const mongoose = require('mongoose')

const communityQuesionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    question_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'CommunityQuesion'
    },
    comment:{
        type:String,
        trim:true,
        required:[true,'Please add comment'],
    },
    type:{
        type:Number,
        enum:['1','2','3'] //1 for community Q&A , 2 for community video
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
const CommunityQuesion = new mongoose.model('CommunityQuesion',communityQuesionSchema)
module.exports = CommunityQuesion