import jwt from "jsonwebtoken";
//doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET_KEY);

    req.body.docId = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default authDoctor;
