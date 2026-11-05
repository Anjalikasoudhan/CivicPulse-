import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser=async(req,res)=>{
    try{
        const{name,email,password}=req.body;

        //check req fields

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide all required fields."
            });
        }
        if(password.length<6){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 6 characters long."
            })
        }
        //check if user already exists
        const existingUser=await User.findOne({
            email:email.toLowerCase().trim()
        });
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User with this email already exists."
            });
        }

        //Create new User
        const user=await User.create({
            name,email,password
        });

        //generate jwt token
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );

        res.status(201).json({
            success:true,
            message:"User registered successfully.",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });
     }catch(error){
        console.error("Error in registerUser:",error);

        res.status(500).json({
            success:false,
            message:"Server Error. Please try again later."
        });
     }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user and retrieve hidden password hash
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};