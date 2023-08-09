const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a title'],
        maxlength:[150,'Title can not be more than 150 characters']
    },
    alternative_name:{
        type:String,
        required:[true,'Please add alternative name']
    },
    local_name:{
        type:String,
        required:[true,'Please add local name']
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
const Country = new mongoose.model('Country',countrySchema)
module.exports = Country