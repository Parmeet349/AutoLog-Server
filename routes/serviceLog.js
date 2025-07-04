const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addService,
  getServices,
  updateService,
  deleteService,
} = require("../controllers/serviceLogController");

console.log("ServiceLog routes loaded");

router.use(auth); // All routes protected

router.post("/", addService); // Create new service record
router.get("/", getServices); // Get all service logs (optionally filter by vehicle)
router.put("/:id", updateService); // Update by ID
router.delete("/:id", deleteService); // Delete by ID

module.exports = router;
