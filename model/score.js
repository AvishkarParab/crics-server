const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    mid:{
        type:String,
        required:true
    },
    totscore:{
        type:Number,
        default:0
    },
    totovers:{
        type:Number,
        default:0
    },
    totball:{
        type:Number,
        default:0
    },
    totwicket:{
        type:Number,
        default:0
    },
    timeline:{
        type:String,
        default:""
    },
    target:{
        type:Number,
        default:0
    },
    playedbat:[
        {
            name:{
                type:String
            },
            runs:{
                type:Number,
                default:0
            },
            balls:{
                type:Number,
                default:0
            },
            fours:{
                type:Number,
                default:0
            },
            sixes:{
                type:Number,
                default:0
            },
            sr:{
                type:Number,
                default:0.00
            },
            strike:{
                type:String,
                default:"false"
            }
        }
    ],
    playedbowl:[
        {
            name:{
                type:String
            },
            overs:{
                type:Number,
                default:0
            },
            maidens:{
                type:Number,
                default:0
            },
            runs:{
                type:Number,
                default:0
            },
            wickets:{
                type:Number,
                default:0
            },
            er:{
                type:Number,
                default:0.00
            },
            balls:{
                type:Number,
                default:0
            }
        }
    ],
    afterplayedbat:[
        {
            name:{
                type:String
            },
            runs:{
                type:Number,
                default:0
            },
            balls:{
                type:Number,
                default:0
            },
            fours:{
                type:Number,
                default:0
            },
            sixes:{
                type:Number,
                default:0
            },
            sr:{
                type:Number,
                default:0.00
            }
        }
    ],
    afterplayedbowl:[
        {
            name:{
                type:String
            },
            overs:{
                type:Number,
                default:0
            },
            maidens:{
                type:Number,
                default:0
            },
            runs:{
                type:Number,
                default:0
            },
            wickets:{
                type:Number,
                default:0
            },
            er:{
                type:Number,
                default:0.00
            },
            balls:{
                type:Number,
                default:0
            }
        }
    ]
})

scoreSchema.methods.addBatsman = async function (name){
    try{
        this.playedbat = this.playedbat.concat({name});
        await this.save();
        return this.playedbat;

    }catch(err){
        console.log(err);
    }
};
scoreSchema.methods.addBowler = async function (name){
    try{
        this.playedbowl = this.playedbowl.concat({name});
        await this.save();
        return this.playedbowl;

    }catch(err){
        console.log(err);
    }
};
scoreSchema.methods.addAfterBatsman = async function (name){
    try{
        this.afterplayedbat = this.afterplayedbat.concat({name});
        await this.save();
        return this.afterplayedbat;

    }catch(err){
        console.log(err);
    }
};
scoreSchema.methods.addAfterBowler = async function (name){
    try{
        this.afterplayedbowl = this.afterplayedbowl.concat({name});
        await this.save();
        return this.afterplayedbowl;

    }catch(err){
        console.log(err);
    }
};


const Score = mongoose.model("SCORE",scoreSchema);
module.exports = Score;