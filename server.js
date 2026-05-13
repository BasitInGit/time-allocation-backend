const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// ROUTES
const taskRoutes = require("./routes/tasks");
app.use("/tasks", taskRoutes);

const reminderRoutes = require("./routes/reminders");
app.use("/reminders", reminderRoutes);

const deadlineRoutes = require("./routes/deadlines");
app.use("/deadlines", deadlineRoutes);

const timeDistributionRoutes = require("./routes/distribution");
app.use("/time-distribution", timeDistributionRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});