import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const googleLogin = async (req, res) => {
  try {
    const { name, email, photo: googlePhotoUrl, uid } = req.body;

    let user = await User.findOne({ email });
    console.log("Logined User:", user);

    if (!user) {
      user = await User.create({ 
        name, 
        email, 
        photo: googlePhotoUrl, 
        photoCloudinary: null, 
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
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photoCloudinary || user.photo, 
        uid: user.uid 
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



export const verifyToken = async (req, res) => {
  try {
    // The authMiddleware already attached the user to req.user
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ 
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photoCloudinary || user.photo,
        uid: user.uid
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
