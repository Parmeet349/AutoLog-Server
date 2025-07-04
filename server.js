// This is the main entry point for the AutoLog API server.
// It sets up the Express server, connects to the database, and defines routes.
// It also configures middleware such as CORS and JSON parsing.
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables and connect to the database
dotenv.config();
connectDB();

// Initialize Express app and configure middleware
const app = express();
app.use(cors());
app.use(express.json());

// Middleware to log requests (for debugging)
app.get("/", (req, res) => {
  res.send("AutoLog API is running...");
});

// Health check route
// This route can be used to check if the API is up and running
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "AutoLog API is healthy" });
});


// Import and use routes
// This route handles user registration and login
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// This route handles vehicle management (CRUD operations)
const vehicleRoutes = require("./routes/vehicle");
app.use("/api/vehicles", vehicleRoutes);

// This route handles service logs (CRUD operations)
const serviceLogRoutes = require("./routes/serviceLog");
app.use("/api/services", serviceLogRoutes);

// This route handles file uploads
const uploadRoutes = require("./routes/upload");
app.use("/api/upload", uploadRoutes);

// This route handles fuel logs (CRUD operations)
const fuelLogRoutes = require("./routes/fuelLog");
app.use("/api/fuel", fuelLogRoutes);

// This route handles reminders (CRUD operations)
const reminderRoutes = require("./routes/reminder");
app.use("/api/reminders", reminderRoutes);

// This route handles export functionality (e.g., exporting data to CSV and pdf)
const exportRoutes = require("./routes/export");
app.use("/api/export", exportRoutes);

// This route handles dashboard data (e.g., statistics, summaries)
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
