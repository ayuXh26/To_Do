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
  //   if (!req.userId) {
  //     return res.status(500).json({ error: "Auth failed internally" });
  //   }
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
  //   if (!req.userId) {
  //     return res.status(500).json({ error: "Auth failed internally" });
  //   }
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

// router.delete("/todo/delete/:taskId", userAuth, async (req, res) => {
//   const taskId = req.params.taskId;
//   console.log("🟡 Incoming DELETE for taskId:", taskId);

//   const task = await Task.findById(taskId);

//   // 1️⃣ Existence check FIRST
//   if (!task) {
//     console.log("❌ Task not found");
//     return res.status(404).json({ error: "Task Not Found" });
//   }

//   // 2️⃣ Log ownership values BEFORE comparison
//   console.log("🟢 Task.userId (ObjectId):", task.userId);
//   console.log("🟢 Task.userId.toString():", task.userId.toString());
//   console.log("🟢 req.userId (string):", req.userId);

//   // 3️⃣ Ownership check (normalized comparison)
//   if (task.userId.toString() !== req.userId) {
//     console.log("⛔ Ownership mismatch → FORBIDDEN");
//     return res
//       .status(403)
//       .json({ error: "Not authorized to modify this task" });
//   }

//   // 4️⃣ Delete
//   try {
//     await task.deleteOne();
//     console.log("✅ Task deleted successfully");

//     res.status(200).json({
//       message: "Task deleted successfully",
//     });
//   } catch (err) {
//     console.error("🔥 Delete failed:", err.message);
//     res.status(500).json({
//       error: "Error occurred while deleting task",
//     });
//   }
// });

module.exports = router;
