const mongoose = require('mongoose')

const entryRatingsSchema = new mongoose.Schema({
    entry_id:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ratings:{
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
const Rating = new mongoose.model('Rating',entryRatingsSchema)
module.exports = Rating