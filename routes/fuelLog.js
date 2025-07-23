const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addFuelLog,
  getFuelLogs,
  updateFuelLog,
  deleteFuelLog,
  getVehicleFuelLogs,
} = require("../controllers/fuelLogController");

console.log("FuelLog routes loaded");

router.use(auth); // Secure all routes

router.post("/", addFuelLog);
router.get("/", getFuelLogs);
router.get("/:id", getVehicleFuelLogs); // Get logs for a specific vehicle
router.put("/:id", updateFuelLog);
router.delete("/:id", deleteFuelLog);

module.exports = router;
