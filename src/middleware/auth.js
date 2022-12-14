const jwt = require("jsonwebtoken");

const authenticateUser = function(req,res,next){
    try{
        const token = req.header("Authorization","Bearer Token");
        
        if(!token)
         return res.status(401).send({status:false,message:"Authentication Token is Required"});
         const tokenSplit = token.split(" ");

         jwt.verify(tokenSplit[1], "Assignment",function(err,decodedToken){
             if(err)
             return res.status(401).send({status:false,message:"Token is NOT Valid"})
             req.userId = decodedToken.userId;
             next();
         })

         
    }
    catch(err){
         res.status(500).send({status:false,message:err.message})
    }
}

module.exports.authenticateUser = authenticateUser