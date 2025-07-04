const mongoose = require("mongoose");

console.log("ServiceLog model loaded");

const serviceLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    title: { type: String, required: true }, // e.g., Oil Change
    description: { type: String },
    serviceDate: { type: Date, required: true },
    cost: { type: Number },
    odometer: { type: Number },
    image: { type: String }, // Receipt or photo (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceLog", serviceLogSchema);
