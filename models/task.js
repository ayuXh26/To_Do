const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  taskName: {
    type: String,
    trim: true,
    required: true,
  },
  userId: {
    type: String,
  },
});

const taskModel = mongoose.model("Task", taskSchema);
module.exports = taskModel;
