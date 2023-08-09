const mongoose = require('mongoose')

const consumptionMethodsSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add a title'],
        maxlength:[150,'Title can not be more than 150 characters']
    },
    icon:{
        type:String,
        default:''
    },
    type:{
        type:Number,
        default:1
    },
    parent_method_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ConsumptionMethod'
    },
    measurement_units:[{
        unit:{
            type:String,
            default:''
        }
    }],
    measurement_scales:[{
        scale: {
            type: String,
            default: ''
        }
    }],
    measurement_unit:{
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
    is_active:{
        type:Number,
        default:1
    },
    is_deleted:{
        type:Number,
        default:0
    }
})
const ConsumptionMethod = new mongoose.model('ConsumptionMethod',consumptionMethodsSchema)
module.exports = ConsumptionMethod