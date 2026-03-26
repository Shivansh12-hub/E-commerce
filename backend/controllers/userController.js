

// login user

import { userModel } from "../models/userModel.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

export const loginUser = async(req,res)=>{

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User doen't exist",
                success: false
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            const token = createToken(user._id)
            res.json(({success:true,token}))
        }
        else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message:"failed to login user"
        })
    }
}

// register user

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // checking if user already exist
        const exists = await userModel.findOne({ email: email });
        if (exists) {
            return res.json({
                success: false,
                message:"User already exist"
            })
        }

        // validation for email and strong pass
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message:"Enter a valid email"
            })
        }
        if (password.length<8) {
            return res.json({
                success: false,
                message:"Enter a strong password"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, password:hashedPass
        })
        const user = await newUser.save();

        const token = createToken(user._id);
        
        console.log("avi toh theek")
        res.json({
            success:true,token
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message:"failed to register user"
        })
    }
}


// admin login
export const adminLogin = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}