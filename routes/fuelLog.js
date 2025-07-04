const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addFuelLog,
  getFuelLogs,
  updateFuelLog,
  deleteFuelLog,
} = require("../controllers/fuelLogController");

console.log("FuelLog routes loaded");

router.use(auth); // Secure all routes

router.post("/", addFuelLog);
router.get("/", getFuelLogs);
router.put("/:id", updateFuelLog);
router.delete("/:id", deleteFuelLog);

module.exports = router;
