const express = require("express");
const router = express.Router();
const db = require("../components/db");

router.post("/vehicles/rent/add", (req, res) => {
  const vehicleId = req.body.vehicleId;
  const customerId = req.body.customerId;
  const dateFrom = req.body.dateFrom;
  const kilometerNumber = req.body.kilometerNumber;
  const price = req.body.price;
  const discount = req.body.discount;

  db.query(
    "SELECT kilometer_number FROM vehicle WHERE id = ?",
    [vehicleId],
    (err1, results) => {
      if (err1) {
        console.log(err1);
        res.send({
          errorMessage:
            "Greška prilikom provjere trenutnog broja kilometara za vozilo.",
        });
      } else {
        if (results.length === 0) {
          res.send({ errorMessage: "Vozilo nije pronađeno." });
        } else {
          const currentKilometerNumber = results[0].kilometer_number;

          if (Number(kilometerNumber) >= Number(currentKilometerNumber)) {
            db.query(
              "INSERT INTO vehicle_rent (vehicle_id, customer_id, start_kilometer, start_date, price, discount) VALUES (?, ?, ?, STR_TO_DATE(?, '%d.%m.%Y.'), ?, ?)",
              [
                vehicleId,
                customerId,
                kilometerNumber,
                dateFrom,
                price,
                discount,
              ],
              (err2) => {
                if (err2) {
                  console.log(err2);
                } else {
                  db.query(
                    "UPDATE vehicle SET rented = 1, kilometer_number = ? WHERE id = ?",
                    [kilometerNumber, vehicleId],
                    (err3, results) => {
                      if (err3) {
                        console.log(err3);
                      } else {
                        res.send(results);
                      }
                    }
                  );
                }
              }
            );
          } else {
            res.send({
              errorMessage:
                "Broj kilometara koji želite unijeti je manji od trenutnog broja kilometara na vozilu.",
            });
          }
        }
      }
    }
  );
});

router.post("/vehicles/rent/close", (req, res) => {
  const rentId = req.body.id;
  const vehicleId = req.body.vehicleId;
  const dateTo = req.body.dateTo;
  const kilometerNumber = req.body.kilometerNumber;

  db.query(
    "SELECT start_kilometer, start_date FROM vehicle_rent WHERE id = ?",
    [rentId],
    (err0, rentalData) => {
      if (err0) {
        console.log(err0);
        return res.send({
          errorMessage: "Greška prilikom dobijanja podataka.",
        });
      }

      if (rentalData.length === 0) {
        return res.send({
          errorMessage: "Podaci o iznajmljivanju nisu pronađeni.",
        });
      }

      const startKilometer = rentalData[0].start_kilometer;
      const startDate = rentalData[0].start_date;

      if (!kilometerNumber) {
        return res.send({
          errorMessage:
            "Da biste zaključili iznajmljivanje vozila potrebno je da popunite sve podatke.",
        });
      }

      if (Number(kilometerNumber) < Number(startKilometer)) {
        return res.send({
          errorMessage:
            "Krajnja kilometraža ne može biti manja od početne kilometraže.",
        });
      }

      if (!dateTo) {
        return res.send({
          errorMessage:
            "Da biste zaključili iznajmljivanje vozila potrebno je da popunite sve podatke.",
        });
      }

      const parts = dateTo?.split(".");
      const formattedEndDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

      if (formattedEndDate < startDate) {
        return res.send({
          errorMessage:
            "Datum završetka ne može biti manji od datuma početka iznajmljivanja vozila.",
        });
      }
      db.query(
        "UPDATE vehicle_rent SET end_date = STR_TO_DATE(?, '%d.%m.%Y.'), end_kilometer = ? WHERE id = ?",
        [dateTo, kilometerNumber, rentId],
        (err1) => {
          if (err1) {
            console.log(err1);
            return res.send({
              errorMessage: "Greška prilikom ažuriranja podataka.",
            });
          }

          db.query(
            "UPDATE vehicle_rent vr JOIN vehicle v ON vr.vehicle_id = v.id SET vr.rented_days = CASE WHEN Datediff(vr.end_date, vr.start_date) = 0 THEN 1 ELSE Datediff(vr.end_date, vr.start_date) END, vr.amount = CASE WHEN Datediff(vr.end_date, vr.start_date) = 0 THEN vr.price ELSE vr.price * Datediff(vr.end_date, vr.start_date) END, vr.closed = 1, vr.total_kilometer = vr.end_kilometer - vr.start_kilometer WHERE vr.id = ?;",
            [rentId],
            (err2) => {
              if (err2) {
                console.log(err2);
                return res.send({
                  errorMessage: "Greška prilikom ažuriranja podataka.",
                });
              }

              db.query(
                "UPDATE vehicle SET rented = 0, kilometer_number = ? WHERE id = ?",
                [kilometerNumber, vehicleId],
                (err3, results) => {
                  if (err3) {
                    console.log(err3);
                    return res.send({
                      errorMessage: "Greška prilikom ažuriranja podataka.",
                    });
                  }

                  res.send({
                    results,
                    message: "Uspješno ste zaključili iznajmljivanje vozila!",
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

router.get("/vehicles/rent/list", (req, res) => {
  db.query(
    "SELECT r.id, r.vehicle_id, CONCAT(v.mark, ' ', v.model) AS vehicle, r.customer_id, CONCAT(p.first_name, ' ', p.surname) AS customer, r.start_kilometer, r.end_kilometer, r.total_kilometer, r.start_date, r.end_date, r.rented_days, r.amount FROM vehicle_rent r INNER JOIN vehicle v ON r.vehicle_id = v.id INNER JOIN persons p ON r.customer_id = p.id;",
    (error, results) => {
      if (error) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/vehicles/rent/listByVehicle", (req, res) => {
  const id = req.body.id;

  db.query(
    "SELECT vehicle_rent.id, vehicle_rent.vehicle_id, vehicle_rent.customer_id, CONCAT(persons.first_name, ' ', persons.surname) AS customer_name,vehicle_rent.start_kilometer, vehicle_rent.end_kilometer, total_kilometer, vehicle_rent.start_date, vehicle_rent.end_date, vehicle_rent.rented_days, vehicle_rent.amount FROM vehicle_rent JOIN persons ON vehicle_rent.customer_id = persons.id WHERE vehicle_rent.vehicle_id = ?;",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
        results = results.map((result) => ({
          id: result.id,
          customerId: result.customer_id,
          customerName: result.customer_name,
          startKilometer: result.start_kilometer,
          endKilometer: result.end_kilometer,
          totalKilometer: result.total_kilometer,
          startDate: result.start_date,
          endDate: result.end_date,
          rentedDays: result.rented_days,
          amount: result.amount,
        }));
        res.send(results);
      }
    }
  );
});

router.post("/vehicles/rent/get", (req, res) => {
  const id = req.body.id;

  db.query(
    "SELECT r.id, r.vehicle_id, CONCAT(v.mark, ' ', v.model) AS vehicle, r.customer_id, CONCAT(p.first_name, ' ', p.surname) AS customer, start_kilometer, end_kilometer, r.start_date, r.end_date, r.rented_days, r.amount FROM vehicle_rent r INNER JOIN vehicle v ON r.vehicle_id = v.id INNER JOIN persons p ON r.customer_id = p.id where r.id = ?;",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        results = results.map((result) => ({
          id: result.id,
          vehicle: result.vehicle_id + " - " + result.vehicle,
          customer: result.customer_id + " - " + result.customer,
          startKilometer: result.start_kilometer,
          endKilometer: result.end_kilometer,
          startDate: result.start_date,
          endDate: result.end_date,
          rentedDays: result.rented_days,
          amount: result.amount,
        }));
        res.send(results[0]);
      }
    }
  );
});

router.post("/vehicles/vehicle/rent/get", (req, res) => {
  const id = req.body.id;
  console.log(typeof id);
  db.query("SELECT * FROM vehicle WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      results = results.map((result) => ({
        id: result.id,
        price: result.price,
      }));
      res.send(results[0]);
    }
  });
});

router.post("/vehicles/rent/delete", (req, res) => {
  const id = req.body.id;
  db.query(
    "SELECT * FROM vehicle_rent WHERE id = ?;",
    [id],
    (selectError, selectResults) => {
      if (selectError) {
        console.log(selectError);
      } else {
        const selectedData = selectResults[0];
        const vehicleId = selectedData.vehicle_id;
        db.query(
          "UPDATE vehicle SET rented = 0 WHERE id = ?;",
          [vehicleId],
          (updateError, updateResults) => {
            if (updateError) {
              console.log(updateError);
            } else {
              // Step 3: Delete from vehicle_rent
              db.query(
                "DELETE FROM vehicle_rent WHERE id = ?;",
                [id],
                (deleteError, deleteResults) => {
                  if (deleteError) {
                    console.log(deleteError);
                  } else {
                    console.log(deleteResults);
                    res.send({ message: "Uspješno obrisano!" });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post("/vehicles/rent/update", (req, res) => {
  const rentId = req.body.id;
  const dateFrom = req.body.startDate;
  const kilometerNumber = req.body.startKilometer;

  db.query(
    "SELECT start_kilometer, start_date FROM vehicle_rent WHERE id = ?",
    [rentId],
    (err0, rentalData) => {
      if (err0) {
        console.log(err0);
        return res.send({
          errorMessage: "Greška prilikom dobijanja podataka.",
        });
      }

      if (rentalData.length === 0) {
        return res.send({
          errorMessage: "Podaci o iznajmljivanju nisu pronađeni.",
        });
      }

      const startKilometer = rentalData[0].start_kilometer;
      const startDate = rentalData[0].start_date;

      if (!kilometerNumber) {
        return res.send({
          errorMessage:
            "Da biste zaključili iznajmljivanje vozila potrebno je da popunite sve podatke.",
        });
      }

      if (Number(kilometerNumber) < Number(startKilometer)) {
        return res.send({
          errorMessage: "Nova kilometraža ne može biti manja od postojeće.",
        });
      }

      if (!dateFrom) {
        return res.send({
          errorMessage:
            "Da biste uradili podatke o vozilu potrebno je da popunite sva polja.",
        });
      }

      const parts = dateFrom?.split(".");
      const formattedEndDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

      if (formattedEndDate < startDate) {
        return res.send({
          errorMessage:
            "Novi datum ne može biti manji od datuma koji je prethodno unesen.",
        });
      }
      db.query(
        "UPDATE vehicle_rent SET start_date = STR_TO_DATE(?, '%d.%m.%Y.'), start_kilometer = ? WHERE id = ?",
        [dateFrom, kilometerNumber, rentId],
        (err1) => {
          if (err1) {
            console.log(err1);
            return res.send({
              errorMessage: "Greška prilikom ažuriranja podataka.",
            });
          } else {
            res.send({
              message: "Uspješno izmijenjeno!",
            });
          }
        }
      );
    }
  );
});

module.exports = router;
