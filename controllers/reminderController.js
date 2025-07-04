const Reminder = require("../models/Reminder");

console.log("Reminder controller loaded");
const addReminder = async (req, res) => {
  try {
    const { vehicle, title, note, dueDate, repeatInterval } = req.body;

    const reminder = await Reminder.create({
      user: req.user,
      vehicle,
      title,
      note,
      dueDate,
      repeatInterval,
    });

    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user }).sort({ dueDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const updateReminder = async (req, res) => {
  try {
    const updated = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Reminder not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const deleted = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!deleted) return res.status(404).json({ msg: "Reminder not found" });
    res.json({ msg: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
};
