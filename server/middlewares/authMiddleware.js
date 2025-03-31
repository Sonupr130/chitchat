import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {

  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log("Received token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied! No Token Provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid Token" });
  }
};
