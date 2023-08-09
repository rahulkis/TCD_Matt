const mongoose = require('mongoose')

const compositionSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add a name'],
        maxlength:[150,'Name can not be more than 150 characters']
    },
    description:{
        type:String,
        trim:true
    },
    image:{
        type:String,
        default:''
    },
    type:{
        type:Number,
        required:true //1 for cannabinoid 2 for terpenes 3 pesticides 4 Microbials 5 Mycotoxins 6 Heavy Metals
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
const Composition = new mongoose.model('Composition',compositionSchema)
module.exports = Composition