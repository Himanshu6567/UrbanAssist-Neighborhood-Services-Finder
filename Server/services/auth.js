const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKay = process.env.jwt_secretKay;


//generate token
function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secretKay
  );
}

//middleware
const authMiddleware = async (req, res, next) => {
  console.log("auth calls");
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Get token from headers
    // console.log(token);
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, secretKay); // Verify token

    req.user = await User.findOne({ email: decoded.email }).select("email");
    // console.log(req.user);
    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }
    console.log("Auth Done");
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

//verify token
function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secretKay);
  } catch (err) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
  authMiddleware,
};
