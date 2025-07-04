const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");

console.log("Reminder routes loaded");
router.use(auth);

router.post("/", addReminder);
router.get("/", getReminders);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);

module.exports = router;
