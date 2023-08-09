const mongoose = require("mongoose")

const statisticSchema = new mongoose.Schema({
    year:{
        type:Number
    },
    month:{
        type:Number
    },
    title:{
        type:String,
        required:[true,'Please provide a title']
    },
    scale:{
        type:String,
        required:[true,'Please provide scale']
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

const Statistic = new mongoose.model('Statistic',statisticSchema)
module.exports = Statistic