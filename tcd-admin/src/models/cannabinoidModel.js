const mongoose = require('mongoose')

const cannabinoidSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a title'],
        maxlength:[150,'Title can not be more than 150 characters']
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
const Cannabinoid = new mongoose.model('Cannabinoid',cannabinoidSchema)
module.exports = Cannabinoid