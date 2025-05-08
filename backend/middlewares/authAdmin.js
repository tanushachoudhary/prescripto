import jwt from "jsonwebtoken";
//admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET_KEY);

    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
   
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default authAdmin;
