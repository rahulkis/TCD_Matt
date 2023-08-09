const mongoose = require('mongoose')

const favouriteEntriesSchema = new mongoose.Schema({
    entry_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Diary'
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
const FavouriteEntry = new mongoose.model('FavouriteEntry',favouriteEntriesSchema)
module.exports = FavouriteEntry