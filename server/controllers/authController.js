import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const googleLogin = async (req, res) => {
  try {
    const { name, email, photo, uid } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ 
        name, 
        email, 
        photo, 
        uid,
        provider: 'google',  
        providerId: uid      
      });
      console.log("User Created", user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return both user and token
    res.status(200).json({ 
      user,
      token 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



export const verifyToken = async (req, res) => {
  try {
    // User is already verified by authMiddleware
    // res.status(200).json({ user: req.user });
    return res.status(200).json({ 
      success: true,
      user: req.user 
    });
  } catch (error) {
    res.status(401).json({success:false, message: "Invalid token" });
  }
};
