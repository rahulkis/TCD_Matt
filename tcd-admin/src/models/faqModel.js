const mongoose = require('mongoose')

const faqSchema = new mongoose.Schema({
    category_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'FaqCategory'
    },
    question:{
        type:String,
        trim:true,
        required:[true,'Please add question'],
    },
    answer:{
        type:String,
        trim:true,
        required:[true,'Please add answer'],
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
const Faq = new mongoose.model('Faq',faqSchema)
module.exports = Faq