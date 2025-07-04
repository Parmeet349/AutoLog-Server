const ServiceLog = require("../models/ServiceLog");
const FuelLog = require("../models/FuelLog");

console.log("Dashboard Controller Loaded");
const getDashboardStats = async (req, res) => {
  const { vehicleId } = req.query;

  try {
    // 1. Total fuel & service cost
    const serviceLogs = await ServiceLog.find({ user: req.user, vehicle: vehicleId });
    const fuelLogs = await FuelLog.find({ user: req.user, vehicle: vehicleId });

    const totalServiceCost = serviceLogs.reduce((acc, log) => acc + (log.cost || 0), 0);
    const totalFuelCost = fuelLogs.reduce((acc, log) => acc + (log.totalCost || 0), 0);
    const totalLitres = fuelLogs.reduce((acc, log) => acc + (log.litres || 0), 0);

    // 2. Monthly fuel usage & cost
    const monthlyFuelStats = {};

    fuelLogs.forEach(log => {
      const month = new Date(log.fuelDate).toLocaleString("default", { month: "short", year: "numeric" });
      if (!monthlyFuelStats[month]) {
        monthlyFuelStats[month] = { litres: 0, cost: 0 };
      }
      monthlyFuelStats[month].litres += log.litres || 0;
      monthlyFuelStats[month].cost += log.totalCost || 0;
    });

    const fuelTrend = Object.entries(monthlyFuelStats).map(([month, data]) => ({
      month,
      litres: parseFloat(data.litres.toFixed(2)),
      cost: parseFloat(data.cost.toFixed(2)),
    }));

    res.json({
      totalServiceCost,
      totalFuelCost,
      averageFuelCostPerLitre: totalLitres ? (totalFuelCost / totalLitres).toFixed(2) : 0,
      fuelTrend,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load dashboard stats" });
  }
};

module.exports = { getDashboardStats };
