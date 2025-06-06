const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

//generate JWT token
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
};

//Register user
exports.registerUser = async(req, res)=>{
    const {fullName,username, email, password, profileImageUrl} = req.body;
    
    //validation: check for missing fields
    if(!fullName||!username||!email||!password){
        return res.status(400).json({message: "All fields are required"});
    }

    //validation: check username format
    // allows alphanumeric characters and hypens only
    const usernameRegex= /^[a-zA-Z0-9]+$/;
    if(!usernameRegex.test(username)){
        return res.status(400).json({
            message:
            "Invalid username.Only alphanumeric characters and hypens are allowed. No spaces are premitted.",
        })
    }

    try {
        //check if email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "email already in use"});
        }
        
        //check if username already exists
        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res
                .status(400)
                .json({message: "Username not availabe. Try another one."});
        }

        //create the user
        const user = await User.create({
            fullName,
            username,
            email,
            password,
            profileImageUrl,
        });
        
        res.status(201).json({
            id:user._id,
            user,
            token: generateToken(user._id),
        });


    } catch (err) {
        res
            .status(500)
            .json({message: "Error registering user", error: err.message});
    }

}

exports.loginUser = async(req, res)=>{
    const {email, password} = req.body;
    if(!email||!password){
        return res.status(400).json({message: "All fields are required"});
    }
    try {
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message: "Invalid credentials"})
        }  
        res
            .status(200)
            .json({
                id: user._id,
                user:{
                    ...user.toObject(),
                    totalPollsCreated: 0,
                    totalPollsVotes: 0, 
                    totalPollsBookmarked: 0,
                },
                token: generateToken(user._id),
            });      
    } catch (err) {
        res
            .status(500)
            .json({message: "Error registering user", error: err.message});
    }
}

exports.getUserInfo = async(req, res)=>{}
