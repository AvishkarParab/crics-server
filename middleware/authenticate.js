const User = require("../model/user");
const jwt = require("jsonwebtoken");

const Authenticate = async (req,res,next)=>{
    try{
        let token = req.cookies.jwtoken;
        const verifytoken = jwt.verify(token,process.env.SECRET_KEY);
        const rootuser = await User.findOne({_id:verifytoken._id,"tokens.token":token});
        if(!rootuser){
            throw new Error('User NOT FOUND')
        }

        req.token = token;
        req.rootuser= rootuser;
        req.userID = rootuser._id;

        next();
    }catch(err){
        res.status(401).send("No Token Provided")
        console.log(err);
    }
}

module.exports = Authenticate;