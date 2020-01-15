const express = require('express');
const route = express.Router();
const {check,validationResult} = require('express-validator');
const User = require('../models/User');
const bcryptJs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

route.post('/register', [
    check('name','name is required').not().isEmpty(),
    check('email','email is requried').not().isEmpty(),
    check('email',('email must follow email style')).isEmail(),
    check('password',('password is required and at least has been five char')).isLength({min:5}),
    check('confirmPassword','Password is not Match').custom((value,{req})=>{
        return value === req.body.password
    })
],async (req,res) => {
    const {name,email,password,confirmPassword} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg:errors.array()});
    }

    try {
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg:[{msg:'User already exists'}]});
        }

        const newUser = new User({
            name,
            email,
            password,
            createAt: new Date()
        });

        const salt = await bcryptJs.genSalt(10);
    
        const hashPassword = await bcryptJs.hash(password,salt);

        newUser.password = hashPassword;

        const token = jwt.sign({user:{id:newUser.id,email:newUser.email,name:newUser.name}},config.get('secretKey'),{
            expiresIn:'1h'
        });


        const saveUser = await newUser.save();
        
        
        res.json({id:saveUser.id,name:saveUser.name,email:saveUser.email,token});


    } catch (error) {
        res.status(500).json({msg:{msg:["Internal Server Error" + error]}});
    }
    
});

route.post('/login',[
    check('email','email must be follow email style').isEmail(),
    check('password','password is required and must be 5 character at least')

],async (req,res) =>{
    const {email,password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg:errors.array()});
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({msg:{msg:["email is not registerd"]}});
        }

        const match = await bcryptJs.compare(password,user.password);
        if(!match){
            return res.status(401).json({msg: ["password is incorrect"]})
        }
        const token = jwt.sign({user:{id:user.id,email:user.email,name:user.name}},config.get('secretKey'),{
            expiresIn:'1h'
        });

        res.json({name:user.name,email:user.email,token});
    } catch (error) {
        res.status(500).json({msg:{msg:["Internal Server Error" + error]}});
    }
})

module.exports = route;