const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

console.log("Vehicle routes loaded");
router.use(auth); // All routes below require auth

router.post("/", addVehicle);              // Add vehicle
router.get("/", getVehicles);              // Get all vehicles
router.put("/:id", updateVehicle);         // Update by ID
router.delete("/:id", deleteVehicle);      // Delete by ID

module.exports = router;
