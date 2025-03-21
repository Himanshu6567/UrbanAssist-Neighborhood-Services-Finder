const Message = require("../Models/MessageModel");



// function to store the user query & message
const handleCreateNewMessage = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    console.log(fullName, email, message);
    if (!fullName || !email || !message) {
      return res.status(400).json({ msg: "Data not provided by user" });
    }

    const result = await Message.create({
      name: fullName,
      email: email,
      message: message,
    });

    return res.status(201).json({ msg: "Success" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  handleCreateNewMessage,
};
