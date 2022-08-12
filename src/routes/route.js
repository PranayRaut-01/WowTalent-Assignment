const express = require('express');
const router = express.Router();

///////////////// [ IMPORTED CONTROLLERS ] /////////////////
const userController= require("../controllers/userController");
const countController= require("../controllers/countController");
const postController= require("../controllers/postController");
const profileController= require("../controllers/profileController");
const {authenticateUser} = require("../middleware/auth")



///////////////// [ ALL API's HERE ] /////////////////

// User apis
router.post('/register',userController.createUser)
router.post('/login',userController.loginUser)
router.put('/user/:userId',authenticateUser,userController.updateUser)


// Apis for posts
router.post('/post/:userId',authenticateUser,postController.createPost)
router.get('/post/:userId',authenticateUser,postController.getPost)
router.put('/post/:postId',authenticateUser,postController.updatePost)
router.delete('/post/:postId',authenticateUser,postController.deletePost)

//api to like post
router.put('/post/:userId/:postId',authenticateUser,postController.likePost)

router.post("/user/:userId/profile",authenticateUser,profileController.createProfile)


router.get("/user/:userId/getCount",authenticateUser,profileController.getCount)

//api to follow or unfollow
router.put("/user/:userId/follow/:followerId",authenticateUser,profileController.follow)

//api to block or unblock
router.put("/user/:userId/block/:blockId",authenticateUser,profileController.block)


//api to include auto increment feature , One time use only
router.post('/count',countController.createCount)




///////////////// [ EXPRORTED ROUTHER ] /////////////////
module.exports = router;