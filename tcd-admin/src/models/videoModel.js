const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Please add a video title'],
        maxlength:[150,'Title can not be more than 150 characters']
    },
    type:{
        type:Number,
        default:1,
        enum:[1,2,3,4,5] // 1 for introductory video //2= for educational 3 = news 4 = community
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description:{
        type:String,
        required:false,
        default: ''
    },
    // category:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref: 'Category'
    // },
    video_url:{
        type:String,
        default:''
    },
    video_thumb_image:{
        type:String,
        default:''
    },
    duration:{
        type:Number,
        default:0
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
        reported_count:{
            type:Number,
            default:0
        }
    }],
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
const Video = new mongoose.model('Video',videoSchema)
module.exports = Video