const express = require("express");
const router = express.Router();
const db = require("../components/db");

router.get("/users", (req, res) => {
  db.query("SELECT * FROM studij_users", (error, results) => {
    if (error) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

router.put("/usersUpdate", (req, res) => {
  const id = req.body.id;
  const ime = req.body.ime;
  const prezime = req.body.prezime;
  const telefon = req.body.telefon;
  const pol = req.body.pol;
  const email = req.body.email;
  const jmbg = req.body.jmbg;

  db.query(
    "UPDATE studij_users SET ime=?, prezime=?, kontakt_telefon=?, pol=?, email=?, jmbg=? WHERE id=? ",
    [ime, prezime, telefon, pol, email, jmbg, id],

    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

router.put("/updateUserPassword", (req, res) => {
  const id = req.body.id_korisnika;
  const newPassword = req.body.newPassword;

  bcrypt.hash(newPassword, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(
      "UPDATE studij_users SET password=? WHERE id=? ",
      [hash, id],

      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });
});

router.put("/updateUserData", (req, res) => {
  const id = req.body.id_korisnika;
  const ime = req.body.ime;
  const prezime = req.body.prezime;

  db.query(
    "UPDATE studij_users SET ime=?, prezime=? WHERE id=? ",
    [ime, prezime, id],

    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = router;
