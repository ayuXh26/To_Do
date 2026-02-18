require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("../config/database");
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://to-do-gvbq.onrender.com",
  "http://localhost:5500",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.startsWith("http://localhost")
      ) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "../public")));

const taskRoutes = require("../routes/taskRoutes");
const userRoutes = require("../routes/userRoutes");

app.use("/", userRoutes);
app.use("/", taskRoutes);

connectDB()
  .then(() => {
    console.log("Task MongoDB Connected");
    app.listen(PORT, () => {
      console.log("Server Listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
