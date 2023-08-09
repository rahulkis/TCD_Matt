const mongoose = require('mongoose')

const SettingsMyEntourageSchema = new mongoose.Schema({
    entourage_name:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true,
        required:false
    },
    image:{
        type:String,
        trim:true,
        required:true
    },
    max_selection:{
        type:String,
        trim:true,
        required:false
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    update_date:{
        type:Date,
        required:false
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref: 'User'
    },
    is_deleted:{
        type:Number,
        default:0
    },
    is_active:{
        type:Number,
        default:1
    }
})
const SettingsMyEntourage = new mongoose.model('settingsmyentourage',SettingsMyEntourageSchema)
module.exports = SettingsMyEntourage