const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },

    role: {
      type: String,
      require: true,
    },
    mobile: {
      type: Number,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },

    DoB: {
      type: String,
      require: true,
    },
    aboutYou: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },

    jobCategory: {
      type: String,
      require: true,
    },

    location: {
      type: {},
      require: true,
    },

    preferenceDistance: {
      type: Number,
      require: true,
    },
    salary: {
      type: Number,
      require: true,
    },
    workDescription: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const ServiceProvider = mongoose.model(
  "ServiceProviders",
  ServiceProviderSchema
);

module.exports = ServiceProvider;
