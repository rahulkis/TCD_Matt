const mongoose = require('mongoose')
const productTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required:true
    },
    parent_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'ProductType'
    },
    type:{
        type:String,
        default:2 //1 for parent product type , 2 for sub-type
    },
    display_order: {
        type: Number,
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
productTypeSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
    },
    
});

const ProductType = mongoose.model('ProductType',productTypeSchema)
module.exports = ProductType