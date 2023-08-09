const mongoose = require('mongoose')

const stateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a title'],
        maxlength:[150,'Title can not be more than 150 characters']
    },
    local_name:{
        type:String,
        required:[true,'Please add local name']
    },
    code_name:{
        type:String,
        default:''
    },
    country:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    updated_by:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
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
    is_active:{
        type:Number,
        default:1
    },
    is_deleted:{
        type:Number,
        default:0
    }
})
const State = new mongoose.model('State',stateSchema)
module.exports = State