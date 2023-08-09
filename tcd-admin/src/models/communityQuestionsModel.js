const mongoose = require('mongoose')

const communityQuestionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'CommunityQuestionCategory'
    },
    question:{
        type:String,
        trim:true,
        required:[true,'Please add question'],
    },
    answer:{
        type:String,
        trim:true
    },
    display_flag:{
        type:Number,
        default:2
    },
    comments:[{
        commented_by:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment:{
            type:String
        },
        created_at:{
            type:Date,
            default: Date.now
        },
    }],
    created_at:{
        type:Date,
        default: Date.now
    },
    updated_at:{
        type:Date,
        default: Date.now
    },
    is_deactivated:{
        type:Number,
        default:0
    },
    is_active:{
        type:Number,
        default:1
    },
    is_deleted:{
        type:Number,
        default:0
    },
    is_publish:{
        type:Boolean,
        default:false
    }
})
const CommunityQuestion = new mongoose.model('CommunityQuestion',communityQuestionSchema)
module.exports = CommunityQuestion