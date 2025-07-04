const mongoose = require("mongoose");

console.log("Reminder model loaded");
const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    title: { type: String, required: true },           // "Insurance Renewal"
    note: { type: String },
    dueDate: { type: Date, required: true },           // When it should notify
    repeatInterval: { type: String, enum: ["none", "weekly", "monthly", "yearly"], default: "none" }, // Optional recurring
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
