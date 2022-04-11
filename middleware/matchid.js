const MatchId = async (req, res, next) =>{
    try{
        const id = await req.cookies.MATCHID;
        console.log(id);

        next();

    }catch(err){
        res.status(401).send("Unauthorized : NO Cookie provided");
        console.log(err);
    }
}
module.exports = MatchId;