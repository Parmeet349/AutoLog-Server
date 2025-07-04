const mongoose = require("mongoose");

console.log("FuelLog model loaded");
const fuelLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    fuelDate: { type: Date, required: true },
    litres: { type: Number, required: true },
    pricePerLitre: { type: Number, required: true },
    totalCost: { type: Number }, // optional but can be calculated
    odometer: { type: Number, required: true },
    station: { type: String }, // optional
    note: { type: String },    // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("FuelLog", fuelLogSchema);
