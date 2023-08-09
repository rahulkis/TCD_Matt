const mongoose = require('mongoose')
require('@mongoosejs/double');

const coaSchema = new mongoose.Schema({
    coa_no:{
        type:String,
        trim:true,
        required:[true,'Please add coa number'],
    },
    sample_id:{
        type:String,
        default:''
    },
    batch_id:{
        type:String,
        default:''
    },
    strain:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Strain'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Product'
    },
    coa_source:{
        type:String,
        required:false,
    },
    coa_source2:{
        type:String,
        required:false,
    },
    weight:{
        type:String,
        default:'',
    },
    summary:[{
        test:{
            type:String,
            default:''
        },
        tested_at:{
            type:Date,
            default:''
        },
        result:{
            type:String,
            default:''
        }
    }],
    total_cannabinoid:{
        type:String,
        default:''
    },
    total_terpenes:{
        type:String,
        default:''
    },
    total_THC:{
        type:String,
        default:''
    },
    total_CBD:{
        type:String,
        default:''
    },
    total_cannabinoid_mg:{
        type: mongoose.Schema.Types.Double,
        default:0.00
    },
    total_terpenes_mg:{
        type: mongoose.Schema.Types.Double,
        default:0.00
    },
    total_THC_mg:{
        type: mongoose.Schema.Types.Double,
        default:0.00
    },
    total_CBD_mg:{
        type: mongoose.Schema.Types.Double,
        default:0.00
    },
    cannabinoid_profile:[{
        composition_id:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref: 'Composition'
        },
        LOD:{
            type:String
        },
        LOQ:{
            type:String
        },
        weight:{
            type:String
        },
        weight_mg:{
            type: mongoose.Schema.Types.Double,
            default:0.00
        },
        tested_date:{
            type:Date,
            default:''

        },
        notes:{
            type:String
        },
    }],
    terpenes:[{
        composition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Composition'
        },
        LOD:{
            type:String
        },
        LOQ:{
            type:String
        },
        weight:{
            type:String
        },
        weight_mg:{
            type: mongoose.Schema.Types.Double,
            default:0.00
        },
        tested_date:{
            type:Date,
            default:''
        },
        notes:{
            type:String
        },
    }],
    pesticides:[{
        composition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Composition'
        },
        LOD:{
            type:String,
            default:''
        },
        LOQ:{
            type:String,
            default:''
        },
        limit:{
            type: mongoose.Schema.Types.Double,
            default:0.00
        },
        weight:{
            type: mongoose.Schema.Types.Double,
            default:0.00
        },
        status:{
            type:String,
            default:''
        },
        tested_at:{
            type:Date,
            default:''
        }
    }],
    microbials:[{
        composition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Composition'
        },
        weight:{
            type: mongoose.Schema.Types.Double,
            default:0.00
        },
        status:{
            type:String,
            default:''
        },
        tested_at:{
            type:Date,
            default:''
        }
    }],
    mycotoxins:[{
        composition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Composition'
        },
        LOD:{
            type: mongoose.Schema.Types.Double,
            default:0.00
        },
        LOQ:{
            type: mongoose.Schema.Types.Double,
            default:0.00
        },
        limit:{
            type: mongoose.Schema.Types.Double,
            default:0.00
        }
    }],
    heavy_metals:[{
        composition_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Composition'
        },
        weight:{
            type:String
        }
    }],
    tested_at:{
        type:Date
    },
    positive_test_report_text:{
        type:String,
        default:''
    },
    negative_test_report_text:{
        type:String,
        default:''
    },
    producer_name:{
        type:String,
        default:''
    },
    producer_lic:{
        type:String,
        default:''
    },
    distributor_name:{
        type:String,
        default:''
    },
    distributor_lic:{
        type:String,
        default:''
    },
    laboratory_name:{
        type:String,
        default:''
    },
    state:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref: 'State'
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
const COA = new mongoose.model('COA',coaSchema)
module.exports = COA