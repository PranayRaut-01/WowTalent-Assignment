const userModel = require("../models/userModel");
const profileModel = require("../models/profileModel");
const validator = require("../validations/validator");
const postModel = require("../models/postModel");

const createProfile = async(req,res)=>{
    try {
        const userId =req.params.userId

        if (!validator.isValidObjectId(userId))
        return res
            .status(400)
            .send({ status: false, message: "Please provide valid userId" });

        const user = await userModel.findById(userId);
        if (!user)
          return res
            .status(404)
            .send({ status: false, message: "User not found" });

        if(userId!==req.userId){
            return res
            .status(403)
            .send({ status: false, message: "You are not authorised" });
        }

        const isProfileCreated = await profileModel.findOne({user_id:userId})
        if (isProfileCreated)
          return res
            .status(400)
            .send({ status: false, message: "Profile already created" });

        const totalPosts = await postModel.find({user_id:userId,isDeleted:false})

        const newObj = { user_id: userId, postCount: totalPosts.length };

        const profile = await profileModel.create(newObj)

        return res
        .status(201)
        .send({ status: true, message: "Profile created", data:profile});

        
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const getCount = async (req,res)=>{
    try {
        const userId =req.params.userId

        if (!validator.isValidObjectId(userId))
        return res
            .status(400)
            .send({ status: false, message: "Please provide valid userId" });

        const user = await userModel.findById(userId);
        if (!user)
          return res
            .status(404)
            .send({ status: false, message: "User not found" });

        const Profile = await profileModel.findOne({user_id:userId}).populate("user_id")

        if(!Profile){
            return res
            .status(404)
            .send({ status: false, message: "Profile not found" });

        }

        const followerCount = Profile.followers.length
        const followingCount = Profile.following.length
        
        const newObj = {followerCount,followingCount}

        return res.status(200).send({status:true,data:{Profile,...newObj}})

   
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


const follow = async (req,res)=>{
    try {
        const userId =req.params.userId
        const followerId =req.params.followerId

        if (!validator.isValidObjectId(userId))
        return res
            .status(400)
            .send({ status: false, message: "Please provide valid userId" });

        const user = await userModel.findById(userId);
        if (!user)
          return res
            .status(404)
            .send({ status: false, message: "User not found" });

        if(userId!==req.userId){
            return res
            .status(403)
            .send({ status: false, message: "You are not authorised" });
        }
        const profile  = await profileModel.findOne({user_id:userId})
        const followerDetail  = await userModel.findById(followerId)

        const userToFollow = followerDetail.User_name

        const followerArray = profile.following
        if(followerArray.indexOf(userToFollow)==-1){
            await profileModel.findOneAndUpdate({user_id:userId},{$addToSet:{following:userToFollow}})
            await profileModel.findOneAndUpdate({user_id:followerId},{$addToSet:{followers:user.User_name}})

            return res
            .status(200)
            .send({ status: true, message: `You are following  ${userToFollow}`});
        }
        else{
            await profileModel.findOneAndUpdate({user_id:userId},{$pull:{following:userToFollow}})
            await profileModel.findOneAndUpdate({user_id:followerId},{$pull:{followers:user.User_name}})
            return res
            .status(200)
            .send({ status: true, message: `You unfollowed  ${userToFollow}`});


        }
   
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}

const block = async (req,res)=>{
    try {
        const userId =req.params.userId
        const blockId =req.params.blockId

        if (!validator.isValidObjectId(userId))
        return res
            .status(400)
            .send({ status: false, message: "Please provide valid userId" });

        const user = await userModel.findById(userId);
        if (!user)
          return res
            .status(404)
            .send({ status: false, message: "User not found" });

        if(userId!==req.userId){
            return res
            .status(403)
            .send({ status: false, message: "You are not authorised" });
        }
        const profile  = await profileModel.findOne({user_id:userId})
        const blockDetail  = await userModel.findById(blockId)

        const userToBlock = blockDetail.User_name

        const blockedUsersArray = profile.blockedUsers
        if(blockedUsersArray.indexOf(userToBlock)==-1){
            await profileModel.findOneAndUpdate({user_id:userId},{$addToSet:{blockedUsers:userToBlock}})
            
            return res
            .status(200)
            .send({ status: true, message: `You have blocked ${userToBlock}`});
        }
        else{
            await profileModel.findByIdAndUpdate({user_id:userId},{$addToSet:{blockedUsers:userToBlock}})
            
            return res
            .status(200)
            .send({ status: true, message: `You unblocked  ${userToBlock}`});
        }
    
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}

module.exports.follow= follow
module.exports.block= block
module.exports.createProfile= createProfile
module.exports.getCount= getCount