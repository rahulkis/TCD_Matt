const mongoose = require('mongoose')

const CoaTestLabsSchema = new mongoose.Schema({
    labname:{
        type:String,
        trim:true,
        required:true
    },
    address:{
        type:String,
        trim:true,
        required:true
    },
    license_number:{
        type:String,
        trim:true,
        required:true
    },
    contact:{
        type:String,
        trim:true,
        required:true
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    is_deleted:{
        type:Number,
        default:0
    }
})
const CoaTestLabs = new mongoose.model('coatestlabs',CoaTestLabsSchema)
module.exports = CoaTestLabs