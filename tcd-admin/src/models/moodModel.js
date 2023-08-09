const mongoose = require('mongoose')
const moodSchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required:true
    },
    display_order: {
        type: Number,
        default:0
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
moodSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
    },
    
});

const Moods = mongoose.model('Moods',moodSchema)
module.exports = Moods