const mongoose = require('mongoose')

const favouriteVideoSchema = new mongoose.Schema({
    video_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Video'
    },
    author:{
        type:String,
        required:false,
        default: 'TCD'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    is_favourite:{
        type:Number
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
const FavouriteVideo = new mongoose.model('FavouriteVideo',favouriteVideoSchema)
module.exports = FavouriteVideo