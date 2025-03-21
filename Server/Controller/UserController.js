const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const { setUser } = require("../services/auth");

const handleCreateNewUser = async (req, res) => {
  const body = req.body;
  console.log(body);
  const { name, email, role, mobile, password } = req.body;
  //check if any field is empty
  if (!name || !email || !role || !mobile || !password) {
    return res.status(400).json({ mgs: "data not send by user" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ mgs: "user alredy Exist" });
  }
  //password hash
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await User.create({
    name: name,
    email: email,
    role: role,
    mobile: mobile,
    password: hashedPassword,
  });
  return res.status(201).json({ mgs: "success", id: result._id });
};

// user login
const handleLogInUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    console.log("invalid user");
    return res.status(401).json("invalid email or password");
  }
  //verify password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ msg: "Invalid email or password" });
  }

  console.log("user verified");
  //generate token
  const token = setUser(user);
  console.log(token);

  return res
    .status(201)
    .cookie("token", token)
    .json({ token: token, role: "user", useID: user._id });
};

module.exports = {
  handleCreateNewUser,
  handleLogInUser,
};
