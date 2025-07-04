const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/dashboardController");

console.log("Dashboard Routes Loaded");
router.use(auth);

router.get("/stats", getDashboardStats);

module.exports = router;
