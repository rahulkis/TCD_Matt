const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Please add a title'],
        maxlength:[150,'Title can not be more than 150 characters']
    },
    content:{
        type:String,
        trim:true,
        required:[true,'Please add content']
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image:{
        type:String,
        trim:true,
        required:[true,'Please add image']
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'ArticleCategory'
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
const Article = new mongoose.model('Article',articleSchema)
module.exports = Article