const mongoose = require('mongoose')
const searchLogsSchema = new mongoose.Schema({
    search_terms: {
        type: String,
        trim:true,
        required:true
    },
    type:{
        type:String,
        default:2 //1 for parent product type , 2 for sub-type
    },
    search_by:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    status:{
        type:String,
        default: 'completed'
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

const SearchLogs = mongoose.model('SearchLogs',searchLogsSchema)
module.exports = SearchLogs