const { uploadFile } = require("../aws/aws");
const validator = require("../validations/validator");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

const createPost = async (req,res)=>{
    try{
        const userId = req.params.userId
        const body  = req.body
        const files = req.files

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
        if(body.status){
            if(["Public","Private"].indexOf(body.status)===-1)  {
                return res
                   .status(400)
                   .send({ status: false, message: "Status should be public or private" });
            } 
        }

        body["image"]= await uploadFile(files[0])
        body["user_id"]= req.params.userId

        const createPost = await postModel.create(body)
        return res.status(201).send({status:true,message:"Post created",data:createPost})

    }catch(error){
        return res.status(500).send({status:false,message:error.message})

    }

}

const getPost = async (req,res)=>{
    try {
        const userId = req.params.userId

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

        const post = await postModel.find({isDeleted:false,status:"Public"}).sort({"updatedAt":-1}).limit(10)

        return res.status(200).send({status:true,data:post})
        
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

const updatePost = async function (req, res) {
    try {
      
      const postId = req.params.postId;

      if (!validator.isValidObjectId(postId))
      return res
          .status(400)
          .send({ status: false, message: "Please provide valid postId" });

      const post = await postModel.findById(postId);
      if (!post)
        return res
          .status(404)
          .send({ status: false, message: "Post not found" });

      if(post.user_id!==req.userId){
          return res
          .status(403)
          .send({ status: false, message: "You are not authorised to update this post" });
      }


      const body = req.body;
      const files = req.files

      if(files && files.length>0){
        body["image"]= await uploadFile(files[0])
      }

      const updatedPost = await postModel.findByIdAndUpdate(postId,{$set:{...body}},{new:true})

      return res.status(200).send({ status: true, message: "Success", data: updatedPost});

      
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };

  const likePost = async(req,res)=>{
    try {
        const userId = req.params.userId
        const postId = req.params.postId

        if (!validator.isValidObjectId(userId))
        return res
            .status(400)
            .send({ status: false, message: "Please provide valid userId" });

        const user = await userModel.findById(userId);
        if (!user)
          return res
            .status(404)
            .send({ status: false, message: "User not found" });

        if (!validator.isValidObjectId(postId))
          return res
            .status(400)
            .send({ status: false, message: "Please provide valid postId" });

        const post = await postModel.findById(postId);
        if (!post)
          return res
            .status(404)
            .send({ status: false, message: "Post not found" });   

        const likedByArray = post.likedBy

        if(likedByArray.indexOf(user.User_name)==-1){
            await postModel.findByIdAndUpdate(postId,{$addToSet:{likedBy:user.User_name}},{new:true})

            return res
            .status(200)
            .send({ status: true, message: `You liked the post`});
        }else{
            return res
            .status(200)
            .send({ status: false, message: "Already liked this post"});
        }
    
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
  }
  


const deletePost=async (req,res)=>{
    try {
        const postId = req.params.postId;

        if (!validator.isValidObjectId(postId))
          return res
            .status(400)
            .send({ status: false, message: "Please provide valid postId" });

          const post = await postModel.findById(postId);
          if (!post)
              return res
                .status(404)
                .send({ status: false, message: "Post not found" });

          if (post.user_id !== req.userId) {
              return res
                .status(403)
                .send({
                  status: false,
                  message: "You are not authorised to delete this post",
                });
          }    
    
        const findPost = await postModel.findOneAndUpdate(
          { _id: postId, isDeleted: false },
          { $set: { isDeleted: true, deletedAt: new Date() } }
        );

        if(!findPost){
            return res.status(404).send({ status: false, message: "Post not found" })
        }
    
        return res.status(200).send({
          status: true,
          message: "Success",
          data: "This post is deleted now",
        });
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
      }
}






module.exports.createPost=createPost
module.exports.getPost=getPost
module.exports.updatePost=updatePost
module.exports.likePost=likePost
module.exports.deletePost=deletePost