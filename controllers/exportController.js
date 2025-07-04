const ServiceLog = require("../models/ServiceLog");
const FuelLog = require("../models/FuelLog");
const Vehicle = require("../models/Vehicle");
const PDFDocument = require("pdfkit");
const { Parser } = require("json2csv");

console.log("Export Controller Loaded");
// PDF Export
const exportPDF = async (req, res) => {
  const { type, vehicleId } = req.query;

  try {
    let data;

    if (type === "services") {
      data = await ServiceLog.find({ user: req.user, vehicle: vehicleId }).lean();
    } else if (type === "fuel") {
      data = await FuelLog.find({ user: req.user, vehicle: vehicleId }).lean();
    } else if (type === "vehicle") {
      data = await Vehicle.findOne({ user: req.user, _id: vehicleId }).lean();
    } else {
      return res.status(400).json({ msg: "Invalid export type" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${type}_export.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(`${type.toUpperCase()} EXPORT`, { underline: true });
    doc.moveDown();

    if (Array.isArray(data)) {
      data.forEach((entry, i) => {
        doc.fontSize(12).text(`${i + 1}.`);
        Object.entries(entry).forEach(([key, val]) => {
          doc.text(`${key}: ${val}`);
        });
        doc.moveDown();
      });
    } else {
      Object.entries(data).forEach(([key, val]) => {
        doc.text(`${key}: ${val}`);
      });
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ msg: "PDF generation error" });
  }
};

// CSV Export
const exportCSV = async (req, res) => {
  const { type, vehicleId } = req.query;

  try {
    let data;

    if (type === "services") {
      data = await ServiceLog.find({ user: req.user, vehicle: vehicleId }).lean();
    } else if (type === "fuel") {
      data = await FuelLog.find({ user: req.user, vehicle: vehicleId }).lean();
    } else {
      return res.status(400).json({ msg: "Invalid export type" });
    }

    const fields = Object.keys(data[0] || {});
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`${type}_export.csv`);
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ msg: "CSV generation error" });
  }
};

module.exports = { exportPDF, exportCSV };
