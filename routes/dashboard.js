const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getDashboardStats, getUserDashboardStats } = require("../controllers/dashboardController");

console.log("Dashboard Routes Loaded");
router.use(auth);

router.get("/stats", getDashboardStats);
router.get("/userStats", getUserDashboardStats); // Get user-specific dashboard stats

module.exports = router;
