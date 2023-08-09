const mongoose = require('mongoose')

const faqCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add a category name'],
        maxlength:[150,'Name can not be more than 150 characters']
    },
    parent_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'FaqCategory'
    },
    type:{
        type:String,
        default:2
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
const FaqCategory = new mongoose.model('FaqCategory',faqCategorySchema)
module.exports = FaqCategory