import jwt from "jsonwebtoken";
//user authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

req.body.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default authUser;
