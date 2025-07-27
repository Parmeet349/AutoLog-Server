const ServiceLog = require("../models/ServiceLog");
const FuelLog = require("../models/FuelLog");

console.log("Dashboard Controller Loaded");
const getDashboardStats = async (req, res) => {
  const { vehicleId } = req.query;
  console.log("Getting details for", vehicleId)

  try {
    // 1. Total fuel & service cost
    const serviceLogs = await ServiceLog.find({ user: req.user, vehicle: vehicleId });
    // Get number of services
    const numServices = serviceLogs.length;
    console.log(numServices)
    const fuelLogs = await FuelLog.find({ user: req.user, vehicle: vehicleId });
    console.log("FuelLog",fuelLogs)

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
    })).sort((a, b) => new Date(a.month) - new Date(b.month));;

    console.log(fuelTrend)

    console.log("Service Cost", totalServiceCost)

    res.json({
      numServices,
      totalServiceCost,
      totalFuelCost,
      averageFuelCostPerLitre: totalLitres ? (totalFuelCost / totalLitres).toFixed(2) : 0,
      fuelTrend: fuelTrend,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load dashboard stats" });
  }
};


const getUserDashboardStats = async (req, res) => {
  const user = req.user;
  console.log("User Dashboard Stats for", user);

  try {

    // 1. Total fuel & service cost
    const serviceLogs = await ServiceLog.find({ user: req.user});
    const fuelLogs = await FuelLog.find({ user: req.user});

    // Get number km driven
    
    const totalServiceCost = serviceLogs.reduce((acc, log) => acc + (log.cost || 0), 0);
    const totalFuelCost = fuelLogs.reduce((acc, log) => acc + (log.totalCost || 0), 0);
    // const totalKmDriven = serviceLogs.reduce((acc, log) => acc + (log.odometer || 0), 0);
    const totalLitres = fuelLogs.reduce((acc, log) => acc + (log.litres || 0), 0);

    // Get the first service log odometer reading
    const firstServiceLog = serviceLogs.sort((a, b) => new Date(a.serviceDate) - new Date(b.serviceDate))[0];
    const firstOdometer = firstServiceLog ? firstServiceLog.odometer : 0;
    console.log("First Odometer Reading:", firstOdometer);
    // Get the last service log odometer reading
    const lastServiceLog = serviceLogs.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate))[0];
    const lastOdometer = lastServiceLog ? lastServiceLog.odometer : 0;
    console.log("Last Odometer Reading:", lastOdometer);


    // Calculate total distance driven
    const totalDistanceDriven = lastOdometer - firstOdometer;
    console.log("Total Distance Driven:", totalDistanceDriven);


    // Get the first fuel log odometer reading
    const firstFuelLog = fuelLogs.sort((a, b) => new Date(a.fuelDate) - new Date(b.fuelDate))[0];
    const firstFuelOdometer = firstFuelLog ? firstFuelLog.odometer : 0;
    console.log("First Fuel Odometer Reading:", firstFuelOdometer);
    // Get the last fuel log odometer reading
    const lastFuelLog = fuelLogs.sort((a, b) => new Date(b.fuelDate) - new Date(a.fuelDate))[0];
    const lastFuelOdometer = lastFuelLog ? lastFuelLog.odometer : 0;
    console.log("Last Fuel Odometer Reading:", lastFuelOdometer);


    // Calculate total distance driven from fuel logs
    const totalFuelDistanceDriven = lastFuelOdometer - firstFuelOdometer;
    console.log("Total Distance Driven from Fuel Logs:", totalFuelDistanceDriven);

    // Check firstOdometer and firstFuelOdometer which is less
    const totalKmDriven = Math.min(firstOdometer, firstFuelOdometer) ? totalDistanceDriven : totalFuelDistanceDriven;
    console.log("Total Km Driven:", totalKmDriven);

    // Check lastOdometer and lastFuelOdometer which is greater
    const totalKmDrivenEnd = Math.max(lastOdometer, lastFuelOdometer) ? totalDistanceDriven : totalFuelDistanceDriven;
    console.log("Total Km Driven End:", totalKmDrivenEnd);

    // Calculate overall distance driven
    const overallDistanceDriven = totalKmDriven + totalKmDrivenEnd;
    console.log("Overall Distance Driven:", overallDistanceDriven);

    // Average fuel cost per litre
    const averageFuelCostPerLitre = totalLitres ? (totalFuelCost / totalLitres).toFixed(2) : 0;

    // Get the latest service log which includes 'oil' in its title for each vehicle and create a summary with vehicle make and model and service date
    const latestServiceLogs = await ServiceLog
      .find({ user: req.user, title: /oil/i })
      .sort({ serviceDate: -1 })
      .limit(5)
      .populate('vehicle', 'make model');
    // console.log("Latest Service Logs:", latestServiceLogs);
    const serviceSummary = latestServiceLogs.map(log => ({
      vehicle: log.vehicle ? `${log.vehicle.make} ${log.vehicle.model}` : "Unknown Vehicle",
      serviceDate: log.serviceDate,
      title: log.title,
      cost: log.cost || 0,
      odometer: log.odometer || 0,
    }));
    // console.log("Service Summary:", serviceSummary);

    //  Remove duplicate vehicles from serviceSummary and just keep the latest service log for each vehicle
    const uniqueVehicles = {};
    serviceSummary.forEach(log => {
      if (!uniqueVehicles[log.vehicle]) {
        uniqueVehicles[log.vehicle] = log;
      }
    });
    const latestOilChange = Object.values(uniqueVehicles);

    console.log("Unique Service Summary:", latestOilChange);


    // Fuel Cost Trend for line chart
    const fuelTrend = fuelLogs.reduce((acc, log) => {
      const month = new Date(log.fuelDate).toLocaleString("default", { month: "short", year: "numeric" });
      if (!acc[month]) {
        acc[month] = { litres: 0, cost: 0 };
      }
      acc[month].litres += log.litres || 0;
      acc[month].cost += log.totalCost || 0;
      return acc;
    }, {});

    console.log(fuelTrend)

    // Convert to array and sort by month
    const fuelTrendArray = Object.entries(fuelTrend).map(([month, data]) => ({
      month,
      litres: parseFloat(data.litres.toFixed(2)),
      cost: parseFloat(data.cost.toFixed(2)),
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
    console.log(fuelTrendArray)

    res.json({
      totalFuelCost,
      totalServiceCost,
      totalKmDriven: overallDistanceDriven,
      averageFuelCostPerLitre,
      fuelTrend,
      fuelTrendArray,
      latestOilChange,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load dashboard stats" });
  }
};

module.exports = { getDashboardStats, getUserDashboardStats };
