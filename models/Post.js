const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    username:String,
    body:String,
    createAt:String,
   
    likes:[{
        username:String,
        createAt:String
    }],
    comments:[{
        username:String,
        createAt:String,
        body:String
    }],
    commentCount:{
        type:Number,
        default:0
    },
    likeCount:{
        type:Number,
        default:0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }

}) 


module.exports = mongoose.model("Post",PostSchema);