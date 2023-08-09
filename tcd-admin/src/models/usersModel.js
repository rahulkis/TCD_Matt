const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')

const userSchema = new mongoose.Schema({
    full_name:{
        type:String,
        trim:true,
        maxlength:[30,'First name can not be more than 30 character']
    },
    email:{
        type:String,
        trim:true,
        required:true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,64})+$/,'Please add a valid email'
        ]
    },
    password:{
        type:String,
        required:true,
        minlength:[8,'Password should contain atleast 8 characters']
    },
    user_type:{
        type:Number,
        default:2 // 1 => Super Admin, 2 => User, 3 => Sub Admin
    },
    profile_image:{
        type:String,
        default:''
    },
    contact_no:{
        type:String,
        default:'',
        match:[/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/, 'Contact no format must be of (xxx) xxx-xxxx']
    },
    city:{
        type:String,
        default:''
    },
    state:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    country:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    zipcode:{
        type:String,
        default:''
    },
    address:{
        type:String,
        default:''
    },
    latitude:{
        type:String,
        default:''
    },
    longitude:{
        type:String,
        default:''
    },
    gender:{
        type:String,
        enum:['','Male','Female','Others','Rather not say']
    },
    dob:{
        type:Date
    },
    cannabis_consumption:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ConsumptionFrequency'
    },
    physique:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Physique'
    },
    activity_level:{
        type:String,
        default:'',
        enum:['','Not active','Slightly Active','Somewhat active','Quite active','Very active']
    },
    height:{
        type:String,
        default:''
    },
    height_scale:{
        type:String,
        default:'',
        enum:['','cm','ft']
    },
    weight:{
        type:String,
        default:''
    },
    weight_scale:{
        type:String,
        default:'',
        enum:['','kg','lb']
    },
    symptoms:[{
        symptom_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Symptom'
        }
    }],
    effects:[{
        effect_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Effect'
        }
    }],
    activities:[{
        activity_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        }
    }],
    conditions:[{
        condition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Condition'
        }
    }],
    favourite_strains:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Strain'
    },
    cannabinoids:[{
        /// Cannanis Consumption Type
        cannabinoid_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Cannabinoid'
        }
    }],
    consumption_reason:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'ConsumptionReason'
    },
    reset_password_otp:{
        type:String,
        default:''
    },
    reset_password_attempted:{
        type:Number,
        default:0
    },
    reset_password_attempted_on:{
        type:Date
    },
    website:{
        type:String,
        default:'',
        match:[/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/]
    },
    account_verification_code:{
        type:String,
        default:''
    },
    account_verification_attempted:{
        type:Number,
        default:0
    },
    account_verification_attempted_on:{
        type:Date
    },
    login_otp_code:{
        type:String,
        default:''
    },
    login_otp_expiry_on:{
        type:Date
    },
    token:{
        type:String,
    },
    device_type:{
        type:Number,
        default:0
    },
    device_push_key:{
        type:String,
        default:''
    },
    device_ids:[{
        device_id:{
            type:String,
            default:''
        }
    }],
    show_tutorial_flag:{
        type:Number,
        default:2
    },
    get_tcd_update:{
        type:Number,
        default:2 //1 for on 
    },
    twoFA_is_on:{
        type:Number,
        default:2 //1 for on 
    },
    twoFA_verification_code:{
        type:String,
        default:''
    },
    post_consumption_reminder_is_on:{
        type:Number,
        default:2 //1 for on 
    },
    post_consumption_reminder_interval:{
        type:Number,
        default:0 // in minutes
    },
    last_reminder_sent_at:{
        type:Date,
        default: ''
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
        default:1 // 1=active,0=blocked,2=email not verified, 3=suspended by admin,4=deactivated by user
    },
    is_deactivated:{
        type:Number,
        default:0
    },
    is_deleted:{
        type:Number,
        default:0
    },
    deleted_at:{
        type:Date,
        default: ''
    },
    deactivated_at:{
        type:Date,
        default: ''
    }
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.token
    delete userObject.created_at
    delete userObject.updated_at
    delete userObject.__v
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    //user.tokens = user.tokens.concat({token})
    user.token = token
    await user.save()
    return token
}

userSchema.statics.checkOldPassword = async(userId,oldPassword)=>{
    const user = await User.findOne({_id:userId})
    if(!user){
        throw new ErrorResponse('User does not exist',200)
    }
    const isMatchpass = await bcrypt.compare(oldPassword,user.password)
    if(!isMatchpass){
        throw new ErrorResponse('Invalid Old Password',200)
    }
    return user
}

userSchema.statics.findByCredentials = async(email,password)=>{
    const emailAdd = email;
    var findCond = {email: {$regex : new RegExp(emailAdd, "i") },is_deleted:0};
    const user = await User.findOne(findCond)
    if(!user){
        throw new ErrorResponse('Email does not exist',200)
    }
    if(user.user_type == 1){
        throw new ErrorResponse('Admin credentials can not be used for user login',200)
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new ErrorResponse('Invalid login credentials',200)
    }
    
    return user
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User

