const mongoose = require('mongoose')

const articleCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add a category name'],
        maxlength:[150,'Name can not be more than 150 characters']
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
const ArticleCategory = new mongoose.model('ArticleCategory',articleCategorySchema)
module.exports = ArticleCategory