const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AutoLog API is running...");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "AutoLog API is healthy" });
});


const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const vehicleRoutes = require("./routes/vehicle");
app.use("/api/vehicles", vehicleRoutes);

const serviceLogRoutes = require("./routes/serviceLog");
app.use("/api/services", serviceLogRoutes);

const uploadRoutes = require("./routes/upload");
app.use("/api/upload", uploadRoutes);


const fuelLogRoutes = require("./routes/fuelLog");
app.use("/api/fuel", fuelLogRoutes);

const reminderRoutes = require("./routes/reminder");
app.use("/api/reminders", reminderRoutes);

const exportRoutes = require("./routes/export");
app.use("/api/export", exportRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
