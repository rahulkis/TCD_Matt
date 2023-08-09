const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Please add a title'],
        maxlength:[150,'Name can not be more than 150 characters']
    },
    parent_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    },
    type:{
        type:String,
        default:2 //1 for parent product type , 2 for sub-type
    },
    image:{
        type:String,
        default:''
    },
    icon:{
        type:String,
        default:''
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
const Activity = new mongoose.model('Activity',activitySchema)
module.exports = Activity