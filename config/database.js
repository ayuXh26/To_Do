const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ayuxh26:ayush260108@to-do.i95usc2.mongodb.net/tasks",
  );
};

module.exports = connectDB;
