const mongoose = require('mongoose')

const entryAdditionalInformationSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add name']
    },
    content:{
        type:String,
        trim:true,
        required:[true,'Please add content']
    },
    image:{
        type:String,
        trim:true,
        required:false
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
const EntryAdditionalInformation = new mongoose.model('EntryAdditionalInformation',entryAdditionalInformationSchema)
module.exports = EntryAdditionalInformation