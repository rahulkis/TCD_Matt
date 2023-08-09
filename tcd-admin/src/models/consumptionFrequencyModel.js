const mongoose = require('mongoose')

const consumptionFrequencySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add a name'],
        maxlength:[150,'Name can not be more than 150 characters']
    },
    sort_order:{
        type:Number,
        default:1
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
const ConsumptionFrequency = new mongoose.model('ConsumptionFrequency',consumptionFrequencySchema)
module.exports = ConsumptionFrequency