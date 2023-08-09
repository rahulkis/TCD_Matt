const mongoose = require('mongoose')

const UserBlockedSchema = new mongoose.Schema({
    blocked_userid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    blocked_by:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    is_active:{
        type:String,
        required:false,
        default:1
    },
    is_deleted:{
        type:Number,
        required:false,
        default:0
    }
})
const UserBlocked = new mongoose.model('userblocked',UserBlockedSchema)
module.exports = UserBlocked