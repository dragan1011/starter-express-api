const express = require("express");
const router = express.Router();
const db = require("../components/db");

router.post("/addVehicle", (req, res) => {
  const selectedCarType = req.body.selectedCarType;
  const selectedCarMark = req.body.selectedCarMark;
  const selectedCarModel = req.body.selectedCarModel;
  const selectedFuelType = req.body.selectedFuelType;
  const selectedTransmission = req.body.selectedTransmission;
  const selectedColor = req.body.selectedColor;
  const selectedLightType = req.body.selectedLightType;
  const selectedProduceYear = req.body.selectedProduceYear;
  const vinNumber = req.body.vinNumber;
  const kilometerNumber = req.body.kilometerNumber;
  const selectedParkingCameraType = req.body.selectedParkingCameraType;
  const selectedParkingSensorType = req.body.selectedParkingSensorType;
  const selectedACType = req.body.selectedACType;
  const selectedWheelDrive = req.body.selectedWheelDrive;
  const selectedDoorNumber = req.body.selectedDoorNumber;
  const price = req.body.price;
  db.query(
    "INSERT INTO vehicle ( type, mark, model, fuel_type, transmission, color, light_type, produce_year, vin_number, kilometer_number, parking_camera, parking_sensor, ac, wheel_drive, door_number, rented, price) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      selectedCarType,
      selectedCarMark,
      selectedCarModel,
      selectedFuelType,
      selectedTransmission,
      selectedColor,
      selectedLightType,
      selectedProduceYear,
      vinNumber,
      kilometerNumber,
      selectedParkingCameraType,
      selectedParkingSensorType,
      selectedACType,
      selectedWheelDrive,
      selectedDoorNumber,
      0,
      price,
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

router.post("/updateVehicle", (req, res) => {
  const id = req.body.id;
  const selectedFuelType = req.body.selectedFuelType;
  const selectedTransmission = req.body.selectedTransmission;
  const selectedColor = req.body.selectedColor;
  const selectedLightType = req.body.selectedLightType;
  const selectedProduceYear = req.body.selectedProduceYear;
  const vinNumber = req.body.vinNumber;
  const kilometerNumber = req.body.kilometerNumber;
  const selectedParkingCameraType = req.body.selectedParkingCameraType;
  const selectedParkingSensorType = req.body.selectedParkingSensorType;
  const selectedACType = req.body.selectedACType;
  const selectedWheelDrive = req.body.selectedWheelDrive;
  const selectedDoorNumber = req.body.selectedDoorNumber;
  const price = req.body.price;

  db.query(
    "SELECT kilometer_number FROM vehicle WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const currentKilometerNumber = results[0].kilometer_number;

        if (Number(kilometerNumber) >= Number(currentKilometerNumber)) {
          db.query(
            "UPDATE vehicle SET fuel_type = ?, transmission = ?, color = ?, light_type = ?, produce_year = ?, vin_number = ?, kilometer_number = ?, parking_camera = ?, parking_sensor = ?, ac = ?, wheel_drive = ?, door_number = ?, price = ? WHERE id = ?",
            [
              selectedFuelType,
              selectedTransmission,
              selectedColor,
              selectedLightType,
              selectedProduceYear,
              vinNumber,
              kilometerNumber,
              selectedParkingCameraType,
              selectedParkingSensorType,
              selectedACType,
              selectedWheelDrive,
              selectedDoorNumber,
              price,
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
        } else {
          res.send({
            errorMessage:
              "Broj kilometara koji želite unijeti ne može biti manji od trenutnog broja kilometara.",
          });
        }
      }
    }
  );
});

router.get("/vehicle/list", (req, res) => {
  db.query("SELECT * FROM vehicle", (error, results) => {
    if (error) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

router.post("/vehicle/get", (req, res) => {
  const id = req.body.id;

  db.query("SELECT * FROM vehicle WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      results = {
        id: results[0].id,
        selectedCarType: results[0].type,
        selectedCarMark: results[0].mark,
        selectedCarModel: results[0].model,
        selectedFuelType: results[0].fuel_type,
        selectedTransmission: results[0].transmission,
        selectedColor: results[0].color,
        selectedLightType: results[0].light_type,
        selectedProduceYear: results[0].produce_year,
        vinNumber: results[0].vin_number,
        kilometerNumber: results[0].kilometer_number,
        selectedParkingCameraType: results[0].parking_camera,
        selectedParkingSensorType: results[0].parking_sensor,
        selectedACType: results[0].ac,
        selectedWheelDrive: results[0].wheel_drive,
        selectedDoorNumber: results[0].door_number,
        price: results[0].price,
        rented: results[0].rented,
      };
      res.send(results);
    }
  });
});

router.post("/vehicles/notes/add", (req, res) => {
  const noteTitle = req.body.noteTitle;
  const note = req.body.note;
  const vehicleId = req.body.vehicleId;
  console.log(noteTitle, note, vehicleId);
  db.query(
    "INSERT INTO vehicle_note (note_title, note, vehicle_id) values (?, ?, ?)",
    [noteTitle, note, vehicleId],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send(results);
      }
    }
  );
});

router.post("/vehicles/notes/list", (req, res) => {
  const id = req.body.id;

  db.query(
    "SELECT * FROM vehicle_note WHERE vehicle_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
        results = results.map((result) => ({
          id: result.id,
          noteTitle: result.note_title,
          note: result.note,
          createdAt: result.createdAt,
        }));
        res.send(results);
      }
    }
  );
});

router.get("/vehicles/list/lookup", (req, res) => {
  db.query("SELECT * FROM vehicle WHERE rented = 0", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      results = results.map(
        (result) => `${result.id} - ${result.mark} ${result.model}`
      );

      res.send(results);
    }
  });
});

router.post("/vehicles/delete", (req, res) => {
  const id = req.body.id;

  db.query(
    "SELECT * FROM vehicle_rent WHERE vehicle_id = ?;",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        res.send({
          errorMessage: "Greška pri provjeri iznajmljivanja vozila.",
        });
      } else if (results.length > 0) {
        res.send({
          errorMessage: "Vozilo je iznajmljeno i ne može biti obrisano.",
        });
      } else {
        db.query(
          "DELETE FROM vehicle WHERE id = ?;",
          [id],
          (deleteError, deleteResults) => {
            if (deleteError) {
              console.log(deleteError);
              res.send({ errorMessage: "Greška pri brisanju vozila." });
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
