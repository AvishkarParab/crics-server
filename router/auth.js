const express = require("express");
const cookieParser = require('cookie-parser')
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
// const matchid = require("../middleware/matchid");


require('../db/conn');
const User = require("../model/user");
const Match = require("../model/match");
const Score = require("../model/score");
const Sc = require("../model/score");
const { set } = require("mongoose");

router.use(cookieParser());
router.get('/',(req,res)=>{
    res.send("Home Page");
});
router.get('/login',(req,res)=>{
    res.send("LOGIN Page");
});
router.get('/register',(req,res)=>{
    res.send("Register Page");
});
//******************  user register  **************
router.post('/register', async (req,res)=>{   
    const {name, email, phone, password} = req.body;

    if(!name|| !email|| !phone|| !password){
        res.status(401).json({error:"Please fill the Details"});
    }

    
    try{
        const userExist = await User.findOne({email:email});
         if(userExist){
             console.log("Email Already Exists");
             return res.status(422).json({error:"Email already exists !!"});
         }

         const user = new User({name,email,phone,password});
         await user.save();
         res.status(201).json({message:"Registered Successfully"});
         console.log("Registered Successfully");
 
     }catch(err){
         console.log(err);
     }



});

router.post('/login',async (req,res)=>{   
    const {email,password} = req.body;

    if(!email || !password){
        res.status(401).json({error:"Invalid Details"});
    }

    try{
        const userLogin = await User.findOne({email:email});

        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);
            const token = await userLogin.generateAuthToken();
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+ 25892000000),
                httpOnly:true
            });
            if(!isMatch){
                res.status(400).json({message:"Login Error Invalid Details"});
                console.log("Login Error Invalid Details");
                
            }else{
                res.status(201).json({message:"Login Successfully"});
                console.log("Login Successfully");
            }
        }else{
            res.status(400).json({message:"Login Error Invalid Details"});
            console.log("Login Error Invalid Details");

        }
 
     }catch(err){
         console.log(err);
     }



});
//****************  User Data           ****************** */
router.get('/getdata',authenticate,(req,res)=>{
    res.send(req.rootuser);

})
router.get('/getmatchdata', async(req,res)=>{
   try{
    const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
      res.status(200).send(matchDetails);
   }catch(err){
       console.log(err);
   }

})
router.get('/save', async(req,res)=>{
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                res.status(201).send(scoreid);     
            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }
    }catch(err){
        console.log(err);
    }
 
 })
//******************  Match Details  **************
router.post('/matchdetails',authenticate,async (req,res)=>{   
    const {email, mtype, overs, aname, bname} = req.body;
    if(!email|| !mtype|| !overs|| !aname|| !bname){
        res.status(401).json({error:"Please fill the Details"});
    }
    try{
         const match = new Match({email, mtype, overs, aname, bname});
         await match.save();

         console.log(match._id);
         res.cookie("MATCHID",match._id,{expires:new Date(Date.now()+ 25892000000),httpOnly:true});

         res.status(201).json({message:"Match Details Entered Successfully"});
         console.log("Match Details Entered Successfully");
 
     }catch(err){
         console.log(err);
     }
});

//******************  Team A Details  **************
router.post('/teama', async (req,res)=>{   
    const {p1,r1,p2,r2,p3,r3,p4,r4,p5,r5,p6,r6,p7,r7,p8,r8,p9,r9,p10,r10,p11,r11} = req.body;
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){
            
            const teama =  matchDetails.addTeamA(p1,r1,p2,r2,p3,r3,p4,r4,p5,r5,p6,r6,p7,r7,p8,r8,p9,r9,p10,r10,p11,r11)
            // await matchDetails.save();
            res.status(201).json({message:"Team A Details Entered Successfully"});
            console.log("Team A Details Entered Successfully");
        }else{
            return res.status(400).json({message:"NO MAtch FOUND"});
        }
 
     }catch(err){
         console.log(err);
     }
});

//******************  Team B Details  **************
router.post('/teamb',async (req,res)=>{   
    const {p1,r1,p2,r2,p3,r3,p4,r4,p5,r5,p6,r6,p7,r7,p8,r8,p9,r9,p10,r10,p11,r11} = req.body;
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){
            const teamb =  matchDetails.addTeamB(p1,r1,p2,r2,p3,r3,p4,r4,p5,r5,p6,r6,p7,r7,p8,r8,p9,r9,p10,r10,p11,r11);

            // await matchDetails.save();
            res.status(201).json({message:"Team B Details Entered Successfully"});
            console.log("Team B Details Entered Successfully");

        }else{
            return res.status(400).json({message:"NO MAtch FOUND"});
        }
 
     }catch(err){
         console.log(err);
     }
});

//******************  Toss Details  **************
router.post('/toss',async (req,res)=>{   
    const {won,elect} = req.body;
    try{
        if(!won || !elect){
            console.log("Select the options");
            return res.status(401).json({error:"Please select the details"});
        }

        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){
            const teamb =  matchDetails.addToss(won,elect);
            // await matchDetails.save();
            res.cookie("MATCHID",matchDetails._id,{expires:new Date(Date.now()+ 25892000000),httpOnly:true});
            res.status(201).json({message:"Toss Details Entered Succesfully"});
            console.log("Toss Details Entered Succesfully");
            const scoreid = new Score({mid:matchDetails._id});
            await scoreid.save();

            console.log("Score Saved..");

        }else{
            return res.status(400).json({message:"NO MAtch FOUND"});
        }

       
 
     }catch(err){
         console.log(err);
     }
});


router.get('/toss', async(req,res) =>{
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){
            res.status(200).send(matchDetails.toss[0]);
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});


//**********************   1 innings     ************************* */
router.get('/selectbat', async (req,res) =>{
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            console.log("Toss won Batting Selection");
            if(matchDetails.toss[0].won === matchDetails.aname){
                if(matchDetails.toss[0].elect=== "bat"){
                    res.status(200).send(matchDetails.teamA[0]);
                }
                else{
                    res.status(200).send(matchDetails.teamB[0]);
                }
            }
            if(matchDetails.toss[0].won === matchDetails.bname){
                if(matchDetails.toss[0].elect=== "bat"){
                    res.status(200).send(matchDetails.teamB[0]);
                }
                else{
                    res.status(200).send(matchDetails.teamA[0]);
                }
            }
            
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});

//**********************   1 innings bating storing     ************************* */
router.post('/selectbat', async (req,res) =>{
    
    const {name} = req.body; 
    if(!name){
        return res.status(400).json({error:"No Player Selected"});
    }
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const play = scoreid.addBatsman(name);

                res.status(201).json({message:"Player Entered Succesfully"});
                console.log("Player Entered Succesfully");

            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});

//********************     2 innings  batting    ********************** */
router.get('/afterselectbat', async (req,res)=>{
    try{    
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});

        if(matchDetails){

            console.log("2 innings Batting Selection");
            if(matchDetails.toss[0].won === matchDetails.aname){
                if(matchDetails.toss[0].elect=== "bat"){
                    res.status(200).json(matchDetails.teamB[0]);
                }
                else{
                    res.status(200).json(matchDetails.teamA[0]);
                }
            }
            if(matchDetails.toss[0].won === matchDetails.bname){
                if(matchDetails.toss[0].elect=== "bat"){
                    res.status(200).json(matchDetails.teamA[0]);
                }
                else{
                    res.status(200).json(matchDetails.teamB[0]);
                }
            
        }
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});
//**********************   1 innings bating storing     ************************* */
router.post('/afterselectbat', async (req,res) =>{

    const {name} = req.body; 
    if(!name){
        return res.status(400).json({error:"No Player Selected"});
    }
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const play = scoreid.addAfterBatsman(name);

                res.status(201).json({message:"Player Entered Succesfully"});
                console.log("Player Entered Succesfully");

            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});


//**********************   1 innings bowling    ************************* */
router.get('/selectbowl', async (req,res) =>{
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            console.log("Toss Won Bowling Selection");
            if(matchDetails.toss[0].won === matchDetails.aname){
                if(matchDetails.toss[0].elect=== "bowl"){
                    res.status(200).json(matchDetails.teamA[0]);
                }
                else{
                    res.status(200).json(matchDetails.teamB[0]);
                }
            }
            if(matchDetails.toss[0].won === matchDetails.bname){
                if(matchDetails.toss[0].elect=== "bowl"){
                    res.status(200).json(matchDetails.teamB[0]);
                }
                else{
                    res.status(200).json(matchDetails.teamA[0]);
                }
            }


        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});

//**********************   1 innings batting storing     ************************* */
router.post('/choosebat', async (req,res) =>{

    const {name} = req.body; 
    if(!name){
        return res.status(400).json({error:"No Player Selected"});
    }
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const present = await Score.findOne({"playedbat.name":name},{"playedbat.$": 1});
                if(present){
                    res.status(201).json(present.playedbat[0]);
                    console.log("Player Found Succesfully");

                }else{
                    const play = await scoreid.addBatsman(name);
                    const present = await Score.findOne({"playedbat.name":name},{"playedbat.$": 1});
                    res.status(201).json(present.playedbat[0]);
                    console.log("Player Entered Succesfully");
                }
            
            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});

//**********************   1 innings bowling storing     ************************* */
router.post('/choosebowl', async (req,res) =>{

    const {name} = req.body; 
    if(!name){
        return res.status(400).json({error:"No Player Selected"});
    }
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const present = await Score.findOne({"playedbowl.name":name},{"playedbowl.$": 1});
                if(present){
                    res.status(201).json(present.playedbowl[0]);
                    console.log("Player Found Succesfully");

                }else{
                    const play = await scoreid.addBowler(name);
                    const present = await Score.findOne({"playedbowl.name":name},{"playedbowl.$": 1});
                    res.status(201).json(present.playedbowl[0]);
                    console.log("Player Entered Succesfully");
                }
            
            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});

//********************     2 innings  bowling    ********************** */
router.get('/afterselectbowl', async (req,res)=>{
    try{    
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});

        if(matchDetails){

            console.log("2 innings Bowling Selection");
            if(matchDetails.toss[0].won === matchDetails.aname){
                if(matchDetails.toss[0].elect=== "bowl"){
                    res.status(200).json(matchDetails.teamB[0]);
                }
                else{
                    res.status(200).json(matchDetails.teamA[0]);
                }
            }
            if(matchDetails.toss[0].won === matchDetails.bname){
                if(matchDetails.toss[0].elect=== "bowl"){
                    res.status(200).json(matchDetails.teamA[0]);
                }
                else{
                    res.status(200).json(matchDetails.teamB[0]);
                } 
        }
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});

//**********************   2 innings batting storing     ************************* */
router.post('/afterchoosebat', async (req,res) =>{

    const {name} = req.body; 
    if(!name){
        return res.status(400).json({error:"No Player Selected"});
    }
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const present = await Score.findOne({"afterplayedbat.name":name},{"afterplayedbat.$": 1});
                if(present){
                    res.status(201).json(present.afterplayedbat[0]);
                    console.log("Player Found Succesfully");

                }else{
                    const play = await scoreid.addAfterBatsman(name);
                    const present = await Score.findOne({"afterplayedbat.name":name},{"afterplayedbat.$": 1});
                    res.status(201).json(present.afterplayedbat[0]);
                    console.log("Player Entered Succesfully");
                }
            
            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});


//**********************   2 innings bowling storing     ************************* */
router.post('/afterchoosebowl', async (req,res) =>{

    const {name} = req.body; 
    if(!name){
        return res.status(400).json({error:"No Player Selected"});
    }
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const present = await Score.findOne({"afterplayedbowl.name":name},{"afterplayedbowl.$": 1});
                if(present){
                    res.status(201).json(present.afterplayedbowl[0]);
                    console.log("Player Found Succesfully");

                }else{
                    const play = await scoreid.addAfterBowler(name);
                    const present = await Score.findOne({"afterplayedbowl.name":name},{"afterplayedbowl.$": 1});
                    res.status(201).json(present.afterplayedbowl[0]);
                    console.log("Player Entered Succesfully");
                }
            
            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }

    }catch(err){
        console.log(err);
    }
});

//**********   1   update batsman           ******* */
router.put('/updatebatsman', async (req,res)=>{
    const {name,runs,balls,fours,sixes,sr} = req.body; 
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const present = await Score.findOne({"playedbat.name":name},{"playedbat.$": 1});
                if(present){

                    const update = await Score.updateOne({"playedbat.name":name},{"$set":{"playedbat.$.runs":runs,"playedbat.$.balls":balls,"playedbat.$.fours":fours,"playedbat.$.sixes":sixes,"playedbat.$.sr":sr}});

                    res.status(201).json({message:"Player Updated Succesfully"});
                    console.log("Player Updated Succesfully");

                }else{
                    return res.status(400).json({error:"No Player Found"});
                }
            
            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }
    }catch(err){
        console.log(err);
    }
});

//**********   1   update bowler           ******* */
router.put('/updatebowler', async (req,res)=>{
    const {name,overs,maidens,runs,wickets,er,balls} = req.body; 
    // if(!name || !overs|| !maidens || !runs || !wickets || !er){
    //     return res.status(400).json({error:"Fill the Details"});
    // }
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const present = await Score.findOne({"playedbowl.name":name},{"playedbowl.$": 1});
                if(present){

                    const update = await Score.updateOne({"playedbowl.name":name},{"$set":{"playedbowl.$.overs":overs,"playedbowl.$.maidens":maidens,"playedbowl.$.runs":runs,"playedbowl.$.wickets":wickets,"playedbowl.$.er":er,"playedbowl.$.balls":balls}});

                    res.status(201).json({message:"Player Updated Succesfully"});
                    console.log("Player Updated Succesfully");

                }else{
                    return res.status(400).json({error:"No Player Found"});
                }
            
            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }
    }catch(err){
        console.log(err);
    }
});
//**********   2 innings   update batsman           ******* */
router.put('/afterupdatebatsman', async (req,res)=>{
    const {name,runs,balls,fours,sixes,sr} = req.body; 
    if(!name || !runs|| !balls || !fours || !sixes || !sr){
        return res.status(400).json({error:"Fill the Details"});
    }
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const present = await Score.findOne({"afterplayedbat.name":name},{"afterplayedbat.$": 1});
                if(present){

                    const update = await Score.updateOne({"afterplayedbat.name":name},{"$set":{"afterplayedbat.$.runs":runs,"afterplayedbat.$.balls":balls,"afterplayedbat.$.fours":fours,"afterplayedbat.$.sixes":sixes,"afterplayedbat.$.sr":sr}});

                    res.status(201).json({message:"Player Updated Succesfully"});
                    console.log("Player Updated Succesfully");

                }else{
                    return res.status(400).json({error:"No Player Found"});
                }
            
            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }
    }catch(err){
        console.log(err);
    }
});

//**********   1 innings  update bowler           ******* */
router.put('/afterupdatebowler', async (req,res)=>{
    const {name,overs,maidens,runs,wickets,er,balls} = req.body; 
    if(!name || !overs|| !maidens || !runs || !wickets || !er){
        return res.status(400).json({error:"Fill the Details"});
    }
    try{
        const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
        if(matchDetails){

            const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
            if(scoreid){
                const present = await Score.findOne({"afterplayedbowl.name":name},{"afterplayedbowl.$": 1});
                if(present){

                    const update = await Score.updateOne({"afterplayedbowl.name":name},{"$set":{"afterplayedbowl.$.overs":overs,"afterplayedbowl.$.maidens":maidens,"afterplayedbowl.$.runs":runs,"afterplayedbowl.$.wickets":wickets,"afterplayedbowl.$.er":er}});

                    res.status(201).json({message:"Player Updated Succesfully"});
                    console.log("Player Updated Succesfully");

                }else{
                    return res.status(400).json({error:"No Player Found"});
                }
            
            }else{
                return res.status(400).json({error:"no Score List Found"});
            }
        }else{
            return res.status(400).json({error:"no match found"});
        }
    }catch(err){
        console.log(err);
    }
});

router.put('/save', async (req, res) =>{

    const {totscore,totovers,totball,totwicket,timeline} = req.body; 
        try{

            const matchDetails = await Match.findOne({_id:req.cookies.MATCHID});
            if(matchDetails){
    
                const scoreid = await Score.findOne({mid:req.cookies.MATCHID});
                if(scoreid){
                    const up = await Score.updateOne({mid:req.cookies.MATCHID},{"$set":{totscore,totovers,totball,totwicket,timeline}});
                    res.status(201).json({message:"Score updated"});
                    console.log("Score Updated");
                
                }else{
                    return res.status(400).json({error:"no Score List Found"});
                }
            }else{
                return res.status(400).json({error:"no match found"});
            }


        }catch(err){
            console.log(err);
        }
});


module.exports = router;