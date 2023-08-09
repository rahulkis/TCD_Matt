const mongoose = require('mongoose')

const diarySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Product'
    },
    coa_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'COA'
    },
    day_of_week:{
        type:String,
        trim:true,
        required:true
    },
    day_of_month:{
        type:Number,
        trim:true
    },
    month:{
        type:Number,
        trim:true
    },
    year:{
        type:Number,
        trim:true
    },
    is_public:{
        type:Number,
        default:2 //1=public,2=private
    },
    is_complete:{
        type:Number,
        default:2 
    },
    average_ratings:{
        type:String,
        default:''
    },
    cannabinoid_profile:[{
        composition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Composition'
        },
        weight:{
            //type:mongoose.Schema.Types.Decimal128
            //type: mongoose.Schema.Types.Double
            type:String
        }
    }],
    terpenes:[{
        composition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Composition'
        },
        weight:{
            type:String
        }
    }],
    pre_symptoms:[{
        symptom_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Symptom'
        }
    }],
    pre_activities:[{
        activity_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        }
    }],
    pre_condition:[{
        condition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Condition'
        }
    }],
    pre_effects:[{
        effect_id:{
             type:mongoose.Schema.Types.ObjectId,
             ref: 'Effect'
         }
    }],
    desired_effects:[{
        effect_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Effect'
        }
    }],
    desired_activities:[{
        activity_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        }
    }],
    desired_symptoms:[{
        symptom_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Symptom'
        }
    }],
    desired_condition:[{
        condition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Condition'
        }
    }],
    actual_effects:[{
        effect_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Effect'
        }
    }],
    actual_condition:[{
        condition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Condition'
        }
    }],
    actual_activities:[{
        activity_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        }
    }],
    actual_symptoms:[{
        symptom_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Symptom'
        }
    }],
    midpoint_effects:[{
        effect_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Effect'
        }
    }],
    midpoint_activities:[{
        activity_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        }
    }],
    midpoint_symptoms:[{
        symptom_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Symptom'
        }
    }],
    midpoint_condition:[{
        condition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Condition'
        }
    }],
    comments:{
        type:String,
        default:''
    },
    consumption_method:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'ConsumptionMethod'
    },
    consumption_scale:{
        type:String,
        default:''
    },
    consumption_unit:{
        type:String,
        default:''
    },
    eat_before_consumption:{
        type:String,
        default:'',
        enum:['','Yes','No']
    },
    consume_now:{
        type:String,
        default:'',
        enum:['','Yes','No']
    },
    consumption_time:{
        type:String,
        default:'',
        enum:['','Morning','Afternoon','Evening','Late Night']
    },
    consumption_place:{
        type:String,
        default:'',
        enum:['','Home','Friend','Out','Social']
    },
    consumption_partner:{
        type:String,
        default:'',
        enum:['','Alone','Partner','Friend','Group']
    },
    // consumption_negative:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref: 'ConsumptionNegative'
    // },
    consumption_negative:[{
        negative_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'ConsumptionNegative'
        }
    }],
    mood_before_consumption:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Moods'
    },
    consume_cannabis_before:{
        type:String,
        default:'',
        enum:['','Yes','No']
    },
    consume_time:{
        type:String,
        default:''
    },
    user_comments:[{
        commented_by:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment:{
            type:String
        },
        created_at:{
            type:Date,
            default: Date.now
        },
    }],
    keywords:{
        type:String,
        default:''
    },
    is_favourite:{
        type:Number,
        default:0
    },
    enjoy_taste:{
        type:Boolean,
        default:false
    },
    has_incompleteness_notified:{
        type:Number,
        default:2
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
    },
    is_deactivated:{
        type:Number,
        default:0
    }
})

diarySchema.virtual("totalLikes", {
	ref: "FavouriteEntry",
	localField: "_id",
	foreignField: "entry_id",
	count: true
});

const UserDiary = new mongoose.model('Diary',diarySchema)

module.exports = UserDiary