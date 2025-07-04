const FuelLog = require("../models/FuelLog");


console.log("FuelLog controller loaded");
const addFuelLog = async (req, res) => {
  const { vehicle, fuelDate, litres, pricePerLitre, odometer, station, note } = req.body;

  try {
    const totalCost = litres * pricePerLitre;

    const fuelLog = await FuelLog.create({
      user: req.user,
      vehicle,
      fuelDate,
      litres,
      pricePerLitre,
      odometer,
      station,
      note,
      totalCost,
    });

    res.status(201).json(fuelLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getFuelLogs = async (req, res) => {
  try {
    const query = { user: req.user };
    if (req.query.vehicle) query.vehicle = req.query.vehicle;

    const logs = await FuelLog.find(query).sort({ fuelDate: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const updateFuelLog = async (req, res) => {
  try {
    const updated = await FuelLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Fuel log not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const deleteFuelLog = async (req, res) => {
  try {
    const deleted = await FuelLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!deleted) return res.status(404).json({ msg: "Fuel log not found" });

    res.json({ msg: "Fuel log deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  addFuelLog,
  getFuelLogs,
  updateFuelLog,
  deleteFuelLog,
};
