const express = require('express');
const route = express.Router();
const auth = require('../middleware/auth');
const {check,validationResult} = require('express-validator');
const Post = require('../models/Post');

route.post('/add',[auth,[
   check('body',"body is requried").not().isEmpty()
]] , async ( req, res) => {
    const {body} = req.body;
 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg:errors.array()});
    }
    try {
        const newPost = new Post({
            body,
            username:req.user.user.name,
            createAt:new Date()
        });
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        return res.status(500).json({msg:`internal server error ${error}`});
    }

})

route.get('/',async (req,res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        return res.status(500).json({msg:`internal server error ${error}`});
    }
})

route.get('/:id',async (req,res) =>{
    const id = req.params.id;
    try {
        const post  = await Post.findById(id);
        res.json(post)
    } catch (error) {
        return res.status(500).json({msg:`internal server error ${error}`});
    }
});

route.delete('/:id',auth,async (req,res) => {
    const id = req.params.id;
    try {
        const post  = await Post.findById(id);
        if(post){
            if(post.username === req.user.user.name){
                await post.delete();
              return  res.json({msg:"post has been deleted successfuly"});
            }else{
                return  res.status(401).json({msg:`you can not delete this post`});
            }

        }
        return res.status(400).json({msg:"post does not exist"});
        
    } catch (error) {
        return res.status(500).json({msg:`internal server error ${error}`});
    }
})

route.put('/addcomment/:id',[auth,[
    check('body','body is required').not().isEmpty()
]],async (req,res) => {
    const id  = req.params.id;
    const {body} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg:errors.array()});
    }
    try {
        const post = await  Post.findById(id);
        if(post){
            
                post.comments.unshift({
                    username:req.user.user.name,
                    createAt:new Date(),
                    body
                })

                post.commentCount = post.comments.length;

                await post.save();
                res.json(post);
           
        }else{
            return res.status(400).json({msg:"Post does not exist"});
        }
    } catch (error) {
        return res.status(500).json({msg:`internal server error ${error}`});
    }
});

route.delete('/deletecomment/:postId/:commentId',auth,async(req,res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    
    try {
        const post = await Post.findById(postId);
        if(post){
            if(post.username === req.user.user.name){
                post.comments = post.comments.filter(comment => comment.id !== commentId);
                post.commentCount = post.comments.length;
                await post.save();
                res.json(post);
            }else{
                return res.status(400).json({msg:"you can not delete this commnet"});
            }
        }else{
            return res.status(400).json({msg:"Post is not exist"});
        }
    } catch (error) {
        return res.status(500).json({msg:`internal server error ${error}`});
    } 
})

route.put('/likepost/:postId',auth,async (req,res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if(post){
            if(post.likes.find(like => like.username === req.user.user.name)){
                post.likes = post.likes.filter(like => like.username !== req.user.user.name);
                post.likeCount = post.likes.length;
                await post.save();
                res.json(post);
            }else{
                post.likes.push({
                    username:req.user.user.name,
                    createAt:new Date()
                });
                post.likeCount = post.likes.length;
                await post.save();
                res.json(post);
            }
        }
    } catch (error) {
        return res.status(500).json({msg:`internal server error ${error}`});
    }
})

module.exports = route;