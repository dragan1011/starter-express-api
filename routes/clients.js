const express = require("express");
const router = express.Router();
const db = require("../components/db");

router.post("/clients/persons/add", (req, res) => {
  const firstName = req.body.firstName;
  const surname = req.body.surname;
  const birthDate = req.body.birthDate;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const drivingLicenceNumber = req.body.drivingLicenceNumber;
  const drivingLicenceNumberExpDate = req.body.drivingLicenceNumberExpDate;
  const cityName = req.body.cityName;
  const streetName = req.body.streetName;
  const streetNumber = req.body.streetNumber;

  db.query(
    "INSERT INTO persons (first_name, surname, birth_date, phone_number, email, driving_licence_number, driving_licence_exp_date, city_name, street_name, street_number) VALUES (?, ?, STR_TO_DATE(?, '%d.%m.%Y.'), ?, ?, ?, STR_TO_DATE(?, '%d.%m.%Y.'), ?, ?, ?);",
    [
      firstName,
      surname,
      birthDate,
      phoneNumber,
      email,
      drivingLicenceNumber,
      drivingLicenceNumberExpDate,
      cityName,
      streetName,
      streetNumber,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/clients/updatePersons/list", (req, res) => {
  const id = req.body.id;
  const firstName = req.body.firstName;
  const surname = req.body.surname;
  const birthDate = req.body.birthDate;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const drivingLicenceNumber = req.body.drivingLicenceNumber;
  const drivingLicenceNumberExpDate = req.body.drivingLicenceNumberExpDate;
  const cityName = req.body.selectedProduceYear;
  const streetName = req.body.vinNumber;
  const streetNumber = req.body.kilometerNumber;
  db.query(
    "UPDATE vehicle SET first_name = ?, surname = ?, birth_date = ?, phone_number = ?, email = ?, driving_licence_number = ?, driving_licence_exp_date = ?, city_name = ?, street_name = ?, street_number = ? WHERE id = ?",
    [
      firstName,
      surname,
      birthDate,
      phoneNumber,
      email,
      drivingLicenceNumber,
      drivingLicenceNumberExpDate,
      cityName,
      streetName,
      streetNumber,
      id,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

router.get("/clients/persons/list", (req, res) => {
  db.query("SELECT * FROM persons", (error, results) => {
    if (error) {
      console.log(err);
    } else {
      results = results.map((result) => ({
        id: result.id,
        name: result.first_name + " " + result.surname,
        birthDate: result.birth_date,
        email: result.email,
        drivingLicenceNumber: result.driving_licence_number,
        drivingLicenceNumberExpDate: result.driving_licence_exp_date,
        address:
          result.city_name +
          ", " +
          result.street_name +
          " " +
          result.street_number,
      }));

      res.send(results);
    }
  });
});

router.post("/clients/persons/get", (req, res) => {
  const id = req.body.id;

  db.query("SELECT * FROM persons WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      results = {
        id: results[0].id,
        firstName: results[0].first_name,
        surname: results[0].surname,
        birthDate: results[0].birth_date + "T00:00:00",
        phoneNumber: results[0].phone_number,
        email: results[0].email,
        drivingLicenceNumber: results[0].driving_licence_number,
        drivingLicenceNumberExpDate:
          results[0].driving_licence_exp_date + "T00:00:00",
        cityName: results[0].city_name,
        streetName: results[0].street_name,
        streetNumber: results[0].street_number,
      };
      res.send(results);
    }
  });
});

router.post("/clients/persons/update", (req, res) => {
  const id = req.body.id;
  const firstName = req.body.firstName;
  const surname = req.body.surname;
  const birthDate = req.body.birthDate;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const drivingLicenceNumber = req.body.drivingLicenceNumber;
  const drivingLicenceNumberExpDate = req.body.drivingLicenceNumberExpDate;
  const cityName = req.body.cityName;
  const streetName = req.body.streetName;
  const streetNumber = req.body.streetNumber;
  console.log(req.body);
  db.query(
    "UPDATE persons SET first_name = ?, surname = ?, birth_date = STR_TO_DATE(?, '%d.%m.%Y.'), phone_number = ?, email = ?, driving_licence_number = ?, driving_licence_exp_date = STR_TO_DATE(?, '%d.%m.%Y.'), city_name = ?, street_name = ?, street_number = ? WHERE id = ?",
    [
      firstName,
      surname,
      birthDate,
      phoneNumber,
      email,
      drivingLicenceNumber,
      drivingLicenceNumberExpDate,
      cityName,
      streetName,
      streetNumber,
      id,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ message: "Uspješno izmijenjeno!" });
      }
    }
  );
});

router.get("/clients/persons/list/lookup", (req, res) => {
  db.query("SELECT * FROM persons", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      results = results.map(
        (result) => `${result.id} - ${result.first_name} ${result.surname}`
      );

      res.send(results);
    }
  });
});

router.post("/clients/persons/delete", (req, res) => {
  const id = req.body.id;

  db.query(
    "SELECT * FROM vehicle_rent WHERE customer_id = ?;",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        res.send({
          errorMessage: "Greška pri provjeri iznajmljivanje vozila.",
        });
      } else if (results.length > 0) {
        res.send({
          errorMessage:
            "Klijent ima akitvno iznajmljivanje vozila i ne može biti obrisan.",
        });
      } else {
        db.query(
          "DELETE FROM persons WHERE id = ?;",
          [id],
          (deleteError, deleteResults) => {
            if (deleteError) {
              console.log(deleteError);
              res.send({ errorMessage: "Greška pri brisanju klijenta." });
            } else {
              console.log(deleteResults);
              res.send({ message: "Uspješno obrisano!" });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
