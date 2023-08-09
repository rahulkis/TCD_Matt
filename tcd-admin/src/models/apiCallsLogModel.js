const mongoose = require('mongoose')
const apiCallsLogSchema = new mongoose.Schema({
    api_path: {
        type: String,
        required:true
    },
    api_request:{
        type:String,
        required:false
    },
    api_response:{
        type:String,
        required:true
    },
    api_function:{
        type:String,
        required:false
    },
    user_call:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
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
    is_deleted:{
        type:Number,
        default:0
    }
})

const ApiCallsLogs = mongoose.model('ApiCallsLogs',apiCallsLogSchema)
module.exports = ApiCallsLogs