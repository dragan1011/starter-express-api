const express = require("express");
const router = express.Router();
const db = require("../components/db");

router.get("/vehicle/allvehicle/count", (req, res) => {
  db.query("SELECT COUNT(*) as vehicle_count FROM vehicle;", (error, results) => {
    if (error) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

router.get("/vehicle/allvehicle/rented", (req, res) => {
	db.query("SELECT COUNT(*) AS vehicle_rented FROM vehicle WHERE rented = 1;", (error, results) => {
	  if (error) {
		console.log(err);
	  } else {
		res.send(results);
	  }
	});
});

router.get("/vehicle/allvehicle/free", (req, res) => {
	db.query("SELECT COUNT(*) AS vehicle_free FROM vehicle WHERE rented = 0;", (error, results) => {
	  if (error) {
		console.log(err);
	  } else {
		res.send(results);
	  }
	});
});

router.get("/vehicle/allvehicle/allstatuses", (req, res) => {
	db.query("SELECT  (SELECT COUNT(*) FROM vehicle) AS vehicle_count, (SELECT COUNT(*) FROM vehicle WHERE rented = 1) AS vehicle_rented, (SELECT COUNT(*) FROM vehicle WHERE rented = 0) AS vehicle_free;", (error, results) => {
	  if (error) {
		console.log(err);
	  } else {
		res.send(results);
	  }
	});
});

module.exports = router;