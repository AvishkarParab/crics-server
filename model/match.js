const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    mtype:{
        type:String,
        required:true,
    },
    overs:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    aname:{
        type:String,
        required:true,
    },
    bname:{
        type:String,
        required:true,
    },
    teamA:[
        {
            p1:{
                type:String,
            },
            r1:{
                type:String,
            },
            p2:{
                type:String,
            },
            r2:{
                type:String,
            },
            p3:{
                type:String,
            },
            r3:{
                type:String,
            },
            p4:{
                type:String,
            },
            r4:{
                type:String,
            },
            p5:{
                type:String,
            },
            r5:{
                type:String,
            },
            p6:{
                type:String,
            },
            r6:{
                type:String,
            },
        
            p7:{
                type:String,
            },
            r7:{
                type:String,
            },
        
            p8:{
                type:String,
            },
            r8:{
                type:String,
            },
        
            p9:{
                type:String,
            },
            r9:{
                type:String,
            },
        
            p10:{
                type:String,
            },
            r10:{
                type:String,
            },
        
            p11:{
                type:String,
            },
            r11:{
                type:String,
            }
        }
    ],
    teamB:[
        {
            p1:{
                type:String,
            },
            r1:{
                type:String,
            },
            p2:{
                type:String,
            },
            r2:{
                type:String,
            },
            p3:{
                type:String,
            },
            r3:{
                type:String,
            },
            p4:{
                type:String,
            },
            r4:{
                type:String,
            },
            p5:{
                type:String,
            },
            r5:{
                type:String,
            },
            p6:{
                type:String,
            },
            r6:{
                type:String,
            },
        
            p7:{
                type:String,
            },
            r7:{
                type:String,
            },
        
            p8:{
                type:String,
            },
            r8:{
                type:String,
            },
        
            p9:{
                type:String,
            },
            r9:{
                type:String,
            },
        
            p10:{
                type:String,
            },
            r10:{
                type:String,
            },
        
            p11:{
                type:String,
            },
            r11:{
                type:String,
            }
        }
    ],
    toss:[
        {
            won:{
                type:String,
                required:true,
            },
            elect:{
                type:String,
                required:true,
            }
        }
    ]

})
// storing team A details
matchSchema.methods.addTeamA = async function(p1,r1,p2,r2,p3,r3,p4,r4,p5,r5,p6,r6,p7,r7,p8,r8,p9,r9,p10,r10,p11,r11){
    try{
        this.teamA = this.teamA.concat({p1,r1,p2,r2,p3,r3,p4,r4,p5,r5,p6,r6,p7,r7,p8,r8,p9,r9,p10,r10,p11,r11});
        await this.save();
        return this.teamA;


    }catch(err){
        console.log(err);
    }
}
// storing team B details

matchSchema.methods.addTeamB = async function(p1,r1,p2,r2,p3,r3,p4,r4,p5,r5,p6,r6,p7,r7,p8,r8,p9,r9,p10,r10,p11,r11){
    try{
        this.teamB = this.teamB.concat({p1,r1,p2,r2,p3,r3,p4,r4,p5,r5,p6,r6,p7,r7,p8,r8,p9,r9,p10,r10,p11,r11});
        await this.save();
        return this.teamB;


    }catch(err){
        console.log(err);
    }
}

matchSchema.methods.addToss = async function(won,elect){
    try{
        this.toss = this.toss.concat({won,elect});
        await this.save();
        return this.toss;
    }catch(err){
        const error =  Error(err);
        throw error;
        
    }
}
const Match = mongoose.model("MATCH",matchSchema);
module.exports = Match;