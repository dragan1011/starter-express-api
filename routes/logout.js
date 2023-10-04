const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  res.clearCookie(req.body.name, { path: "/" });
  res.send({ message: "Cookie cleared successfully" });
});

module.exports = router;
