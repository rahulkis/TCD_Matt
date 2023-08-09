const mongoose = require('mongoose')

const bannerAdvertisementSchema = new mongoose.Schema({
	banner_advertisement_title:{
        type:String,
        required:[true,'Please add a title'],
        maxlength:[150,'Title can not be more than 150 characters']
    },
    banner_advertisement_image:{
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
    is_deleted:{
        type:Number,
        default:0
    }
})

const bannerAdvertisement = new mongoose.model('banneradvertisement',bannerAdvertisementSchema)
module.exports = bannerAdvertisement