const User = require("../models/User");
const ServiceLog = require("../models/ServiceLog");
const FuelLog = require("../models/FuelLog");
const Vehicle = require("../models/Vehicle");

const userInfo = async (req, res) => {
  console.log("Authorization Header:", req.header('Authorization'));
  console.log("Decoded user:", req.user);
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // Get all vehicles for the user
    const vehicles = await Vehicle.find({ user: req.user });
    console.log("Vehicles for user:", vehicles);
    // Get number of vehicles
    const numVehicles = vehicles.length;


    // Get number of service logs for the user
    const serviceLogs = await ServiceLog.find({ user: req.user });
    console.log("Service logs for user:", serviceLogs);
    // Get number of service logs
    const numServiceLogs = serviceLogs.length;

    // Get number of fuel logs for the user
    const fuelLogs = await FuelLog.find({ user: req.user });
    console.log("Fuel logs for user:", fuelLogs);
    // Get number of fuel logs
    const numFuelLogs = fuelLogs.length;

    const totalServiceCost = serviceLogs.reduce((acc, log) => acc + (log.cost || 0), 0);
    const totalFuelCost = fuelLogs.reduce((acc, log) => acc + (log.totalCost || 0), 0);
    const totalCost = totalServiceCost + totalFuelCost;

    // Send user data as response
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      vehicles: numVehicles,
      serviceLogs: numServiceLogs,
      fuelLogs: numFuelLogs,
      totalServiceCost,
      totalFuelCost,
      totalCost,
    });

    } catch (err) {
      console.error("Error fetching user info:", err);
      res.status(500).json({ msg: "Server error" });
    }
};


module.exports = { userInfo };
