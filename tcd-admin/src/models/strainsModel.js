const mongoose = require('mongoose')

const strainsSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add a category name'],
        maxlength:[150,'Name can not be more than 150 characters']
    },
    description:{
        type:String,
        default:''
    },
    created_at:{
        type:Date,
        default: Date.now
    },
    updated_at:{
        type:Date,
        default: Date.now
    },
    brand_logo:{
        type:String,
        default:''
    },
    state:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'State',
        default: null
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
const Strain = new mongoose.model('Strain',strainsSchema)
module.exports = Strain