const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const { userAuth } = require("../middlewares/auth");
const { use } = require("bcrypt/promises");

router.get("/task", userAuth, async (req, res) => {
  try {
    const allTasks = await Task.find({ userId: req.userId });
    res.status(200).json(allTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/create-task", userAuth, async (req, res) => {
  if (!req.userId) {
    return res.status(500).json({ error: "Auth failed internally" });
  }

  const { taskName } = req.body;

  const task = new Task({
    taskName,
    userId: req.userId,
  });

  try {
    await task.save();
    res.status(200).json({
      message: "Task added successfully",
      task,
    });
  } catch (err) {
    res.status(400).send("Error occurred while saving task: " + err.message);
  }
});

router.patch("/todo/edit/:taskId", userAuth, async (req, res) => {
  const taskId = req.params.taskId;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ error: "Task Not Found" });
  }

  if (task.userId !== req.userId) {
    return res
      .status(403)
      .json({ error: "Not authorized to modify this task" });
  }

  const { userInput } = req.body;
  task.taskName = userInput;

  try {
    await task.save();
    res.status(201).json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    res.status(400).send("Error occurred while saving task: " + err.message);
  }
});

router.delete("/todo/delete/:taskId", userAuth, async (req, res) => {
  const taskId = req.params.taskId;
  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json({ error: "Task Not Found" });
  }

  if (task.userId !== req.userId) {
    return res
      .status(403)
      .json({ error: "Not authorized to modify this task" });
  }

  try {
    await task.deleteOne();
    res.status(200).json({
      message: "Task deleted successfully",
      task,
    });
  } catch (err) {
    res.status(500).send("Error occurred while deleting task: " + err.message);
  }
});

module.exports = router;
