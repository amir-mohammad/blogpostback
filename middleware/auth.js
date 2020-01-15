const express = require('express');
const jwt = require('jsonwebtoken');
const config= require('config');

module.exports = async (req,res,next) =>{
    const token = req.header('x-auth-token');
    if(token){
        try {
            const user = await jwt.verify(token,config.get("secretKey"));
            req.user = user;
            next();
        } catch (error) {
           res.status(401).json({msg:"token is not valid or expire"})
        }
       
       
       
    }else{
        res.status(401).json({msg:"token does not exist"})
    }
}