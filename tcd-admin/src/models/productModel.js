const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:[100,'Name can not be more than 100 characters']
    },
    description:{
        type:String,
        trim:true,
        //maxlength:[500,'Description can not be more than 500 characters'],
        default:''
    },
    weight:{
        type:String,
        default:''
    },
    strain:{
        type:mongoose.Schema.Types.ObjectId,
        //required:true,
        ref: 'Strain'
    },
    product_type:{
        type:mongoose.Schema.Types.ObjectId,
        //required:true,
        ref: 'ProductType'
    },
    product_image:{
        type:String,
        default:''
    },
    state:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'State',
        default: null
    },
    COA_identifier:{
        type:String,
        default:''
    },
    chemical_compounds:[{
        composition_id:{
            type:mongoose.Schema.Types.ObjectId,
            //required:true,
            ref: 'Compositions'
        },
        composition_value:{
            type:String
        }
    }],
    has_identifier:{
        type:Number,
        default:2
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
const Product = new mongoose.model('Product',productSchema)
module.exports = Product