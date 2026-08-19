 
 import bcryptjs from 'bcryptjs';
 import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Store JWT in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res
            .status(201)
            .json({
                success: true,
                message: "User created successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

    } catch (error) {
        console.log("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

 export const login = async(req,res)=>{
    try {
        
        const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({success:false, message:"All fields are required"})
    }

    const user = await User.findOne({email});

    if(!user){
         return res.status(400).json({success:false, message:"Email or password is incorrect"})
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect){
        return res.status(409).json({success:false, message:"Email or password is incorrect"})
    }

    // jwt token
     const token = jwt.sign(                        
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

    res.status(200)
    .json({
        success:true,
         message:"User logged in",
          user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.log("Login error:",error);
     res.status(500).json({success:false, message:"Login failed"})
    }
        
 }

 export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get current user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get user"
        });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};