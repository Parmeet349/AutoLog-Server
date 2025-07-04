const Vehicle = require("../models/Vehicle");

// @desc    Add a vehicle
const addVehicle = async (req, res) => {
  const { make, model, year, vin, licensePlate, image } = req.body;

  try {
    const vehicle = await Vehicle.create({
      user: req.user,
      make,
      model,
      year,
      vin,
      licensePlate,
      image,
    });

    // res.status(201).json(vehicle);
    res.status(201).json({
      success: true,
      vehicle: {
        id: vehicle._id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
        licensePlate: vehicle.licensePlate,
        image: vehicle.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Get all vehicles for user
const getVehicles = async (req, res) => {
  try {
    console.log("Fetching vehicles for user:", req.user);
    const vehicles = await Vehicle.find({ user: req.user });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Update vehicle
const updateVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, user: req.user },
      req.body,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ msg: "Vehicle not found" });
    }

    res.status(201).json({
      success: true,
      vehicle: {
        id: vehicle._id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
        licensePlate: vehicle.licensePlate,
        image: vehicle.image,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Delete vehicle
const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: id, user: req.user });

    if (!vehicle) {
      return res.status(404).json({ msg: "Vehicle not found" });
    }

    res.status(200).json({ 
      success: true,
      msg: "Vehicle deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
};
