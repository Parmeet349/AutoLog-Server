const ServiceLog = require("../models/ServiceLog");

console.log("ServiceLog controller loaded");

// Add service log
const addService = async (req, res) => {
  const { vehicle, title, description, serviceDate, cost, odometer, image } = req.body;

  try {
    const service = await ServiceLog.create({
      user: req.user,
      vehicle,
      title,
      description,
      serviceDate,
      cost,
      odometer,
      image,
    });

    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all logs for user (optionally filtered by vehicle)
const getServices = async (req, res) => {
  try {
    const query = { user: req.user };
    if (req.query.vehicle) {
      query.vehicle = req.query.vehicle;
    }

    const services = await ServiceLog.find(query).sort({ serviceDate: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get services by vehicle ID
const getVehicleServices = async (req, res) => {
  try {
    const services = await ServiceLog.find({ user: req.user, vehicle: req.params.id }).sort({ serviceDate: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update a service
const updateService = async (req, res) => {
  try {
    const service = await ServiceLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!service) return res.status(404).json({ msg: "Service not found" });

    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a service
const deleteService = async (req, res) => {
  try {
    const service = await ServiceLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!service) return res.status(404).json({ msg: "Service not found" });

    res.json({ msg: "Service deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  addService,
  getServices,
  getVehicleServices,
  updateService,
  deleteService,
};
