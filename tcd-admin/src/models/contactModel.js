const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    topic:{
        type:String,
        trim:true,
        required:[true,'Please add a topic'],
        maxlength:[200,'Topic can not be more than 200 characters']
    },
    // email:{
    //     type:String,
    //     trim:true,
    //     required:[true,'Please add an email'],
    //     match:[
    //         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,64})+$/,'Please add a valid email'
    //     ]
    // },
    issue:{
        type:String,
        trim:true,
        required:[true,'Please add an issue'],
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
const Contact = new mongoose.model('Contact',contactSchema)
module.exports = Contact