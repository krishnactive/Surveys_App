const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const Poll = require("../models/Poll");

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
        //count polls created by the user
        const totalPollsCreated = await Poll.countDocuments({creator: user._id});

        //count polls the user has voted in
        const totalPollsVotes = await Poll.countDocuments({
            voters: user._id,
        })

        // get the count of booked marked polls
        const totalPollsBookmarked = user.bookmarkedPolls.length;

        res
            .status(200)
            .json({
                id: user._id,
                user:{
                    ...user.toObject(),
                    totalPollsCreated,
                    totalPollsVotes, 
                    totalPollsBookmarked,
                },
                token: generateToken(user._id),
            });      
    } catch (err) {
        res
            .status(500)
            .json({message: "Error registering user", error: err.message});
    }
}

exports.getUserInfo = async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        //Add the new attributes to response
        //count polls created by the user
        const totalPollsCreated = await Poll.countDocuments({creator: user._id});

        //count polls the user has voted in
        const totalPollsVotes = await Poll.countDocuments({
            voters: user._id,
        })

        // get the count of booked marked polls
        const totalPollsBookmarked = user.bookmarkedPolls.length;
        // console.log("kjnknadlknfladk",totalPollsBookmarked);
        const userInfo = {
            ...user.toObject(),
            totalPollsCreated,
            totalPollsVotes,
            totalPollsBookmarked,
        };
        res.status(200).json(userInfo);
    } catch (err) {
        res
            .status(500)
            .json({message: "Error registering user", error: err.message});

    }
}
