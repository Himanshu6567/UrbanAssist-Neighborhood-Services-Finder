const Service = require("../Models/ServiceModel");
const { setUser, getUser } = require("../services/auth");
const multer = require("multer");
const { getSocketIO } = require("../socket");
const cloudinary = require("../cloudinary-config");
const ServiceProvider = require("../Models/ServiceProviderModel");
const User = require("../Models/UserModel");
require("dotenv").config();
const { Resend } = require("resend");

const {
  NewRequestMailFormet,
  RequestAcceptMailFormet,
  RequestRejectMailFormet,
} = require("../services/MailFormet");

const resend = new Resend(process.env.resendEmailApi); // connect with resend mail api

// create  storege
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// crete new service
const handleCreateNewService = async (req, res) => {
  console.log("handleCreateNewService calls");
  const body = req.body;

  const { title, description, date, time, location, ProviderID } = req.body;

  if (!req.file) {
    return res.status(400).json({ msg: "Image is required" });
  }

  if (!body) {
    res.status(400).json({ mgs: "data not send by user" });
    return;
  }

  const token = req.header("Authorization")?.split(" ")[1];
  const usr = getUser(token);

  const userId = usr._id;

  console.log("Uploading image to Cloudinary...");
  const imagePath = req.file.path;
  const cloudinaryResult = await cloudinary.uploader.upload(imagePath, {
    folder: "service_images",
  });

  const { secure_url } = cloudinaryResult; //  image url

  const provider = await ServiceProvider.findById(ProviderID);
  const user = await User.findById(userId);

  const { name: providerName, email: providerEmail } = provider;
  const { name: userName, email: userEmail } = user;

  const result = await Service.create({
    userId: userId,
    serviceProviderId: ProviderID, // assign with service provider
    serviceTitle: title,
    serviceDescription: description,
    date: date,
    time: time,
    location: location,
    images: secure_url,
  });

  const io = getSocketIO(); // initial socket
  io.emit("newRequest", { ProviderID: ProviderID, task: result }); // real time notification

  const emaildata = NewRequestMailFormet({
    // generate mail formet
    providerName,
    userName,
    title,
    date,
    time,
    userEmail,
    description,
  });

  // send email
  try {
    const response = await resend.emails.send({
      from: process.env.email, // register email
      to: providerEmail,
      subject: "new request from urbanAssist",
      html: emaildata,
    });
  } catch (error) {
    console.log("enable to send mail", error);
  }

  return res.status(201).json({ mgs: "success", id: result._id });
};

// get all tasks which are assing to any specific provider
const handlegetAllTasks = async (req, res) => {
  try {
    console.log("handlegetAllTasks call");
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const usr = getUser(token);
    if (!usr) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const providerId = usr._id;
    const allTasks = await Service.find({ serviceProviderId: providerId }); // search tasks

    if (allTasks.length === 0) {
      return res.status(202).json({ msg: "No data found" });
    }

    return res.status(200).json(allTasks);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// accept the request
const handleAcceptReq = async (req, res) => {
  try {
    console.log("handleAcceptReq");

    const Tid = req.body.TaskId; // Extract TaskId from request body

    if (!Tid) {
      return res.status(400).json({ msg: "TaskId is required" });
    }

    // Update only the 'status' field to "pending"
    const task = await Service.findByIdAndUpdate(
      Tid,
      { status: "Pending" }, // Update only the status field
      { new: true } // Returns the updated document
    );

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    const userIdStr = task.userId.toString();
    const serviceProviderIdStr = task.serviceProviderId.toString();

    const { serviceTitle, date, time } = task;
    const user = await User.findById(userIdStr);
    const provider = await ServiceProvider.findById(serviceProviderIdStr);

    const { name: providerName, email: providerEmail } = provider;
    const { name: userName, email: userEmail } = user;

    console.log(task); // Log the updated task
    const emailDetails = RequestAcceptMailFormet({
      userName,
      serviceTitle,
      providerName,
      date,
      time,
      providerEmail,
    });

    const io = getSocketIO();
    io.emit("reqAccept", { id: Tid, task: task });

    // send email
    try {
      const response = await resend.emails.send({
        from: process.env.email, // register email
        to: userEmail,
        subject: "Your request has been accept",
        html: emailDetails,
      });
    } catch (error) {
      console.log("enable to send mail", error);
    }

    return res.status(200).json({ msg: "Update success", task });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// for delete or reject the request
const handleRejectReq = async (req, res) => {
  try {
    console.log("handleRejectReq");

    const { TaskId } = req.params; // Fetch TaskId from URL params
    console.log(TaskId);

    if (!TaskId) {
      console.log("id not found");
      return res.status(400).json({ msg: "TaskId is required" });
    }

    // Reject the request (delete the task)
    const task = await Service.findByIdAndDelete(TaskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const userIdStr = task.userId.toString();
    const serviceProviderIdStr = task.serviceProviderId.toString();
    const { serviceTitle } = task;
    const user = await User.findById(userIdStr);
    const provider = await ServiceProvider.findById(serviceProviderIdStr);

    const { name: providerName } = provider;
    const { name: userName, email: userEmail } = user;

    const emailDetails = RequestRejectMailFormet({
      // email formet
      userName,
      serviceTitle,
      providerName,
    });

    const io = getSocketIO();
    io.emit("reqReject", { id: TaskId, task: task });

    // send email
    try {
      const response = await resend.emails.send({
        from: process.env.email, // register email
        to: userEmail,
        subject: "Request Rejected",
        html: emailDetails,
      });
    } catch (error) {
      console.log("enable to send mail", error);
    }

    return res.status(200).json({ msg: "Task rejected successfully" });
  } catch (error) {
    console.error("Error rejecting task:", error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


module.exports = {
  handleCreateNewService: [upload.single("file"), handleCreateNewService],
  handlegetAllTasks,
  handleAcceptReq,
  handleRejectReq,
};
