const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    make: { type: String, required: true },      // e.g., Toyota
    model: { type: String, required: true },     // e.g., Corolla
    year: { type: Number, required: true },      // e.g., 2015
    vin: { type: String },                       // Optional: VIN
    licensePlate: { type: String },              // Optional
    image: { type: String },                     // Optional: photo URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
