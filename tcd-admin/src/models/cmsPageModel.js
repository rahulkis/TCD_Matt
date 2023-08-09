const mongoose = require('mongoose')
const slugify = require('slugify')

const cmsPageSchema = new mongoose.Schema({
    page_title:{
        type:String,
        required:[true,'Please add a title'],
        maxlength:[150,'Title can not be more than 150 characters']
    },
    banner_image:{
        type:String,
        default:''
    },
    page_content:{
        type:String,
        required:[true,'Please add content']
    },
    slug:String,
    content_type:{
        type:Number,
        default:1
    },
    parent_content:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Diary',
        default: null
    },
    meta_title:{
        type:String,
        default:''
    },
    meta_description:{
        type:String,
        default:''
    },
    meta_keywords:{
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
    sort_order:{
        type:Number,
        default:0
    },
    is_deleted:{
        type:Number,
        default:0
    }
})
/*cmsPageSchema.pre('save',function(next){
    this.slug = slugify(this.page_title,{lower:true})
    next()
})*/
cmsPageSchema.pre('save',async function(next){
    const page = this
    if(page.isModified('page_title')){
        page.slug = slugify(this.page_title,{lower:true})
    }
    next()
})
const cmsPage = new mongoose.model('cmspage',cmsPageSchema)
module.exports = cmsPage