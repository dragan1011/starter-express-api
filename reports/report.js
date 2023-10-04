const express = require("express");
const router = express.Router();
const db = require("../components/db");

const PDFDocument = require("pdfkit");
const fs = require("fs");

const doc = new PDFDocument();
const output = fs.createWriteStream("report.pdf");

doc.pipe(output);
doc.text("Hello, World!");
doc.end();

router.get("/download-report", (req, res) => {
  res.download("report.pdf");
});

module.exports = router;
