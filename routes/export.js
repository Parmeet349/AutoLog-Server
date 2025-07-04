const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { exportPDF, exportCSV } = require("../controllers/exportController");

console.log("Export Routes Loaded");
router.use(auth);

router.get("/pdf", exportPDF);
router.get("/csv", exportCSV);

module.exports = router;
