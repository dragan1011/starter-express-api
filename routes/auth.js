const express = require("express");
const router = express.Router();
const db = require("../components/db");

router.post("/register", (req, res) => {
  const first_name = "Admin";
  const last_name = "Admin";
  const username = "admin";
  const password = "admin";
  const gender = "M";
  const email = "test@test.com";
  const birth_date = "2001-11-10";
  const phone_number = "066-139/450";

  db.query(
    "INSERT INTO users (username, password, first_name, last_name, gender, email, phone_number, birth_date) values (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      username,
      password,
      first_name,
      last_name,
      gender,
      email,
      phone_number,
      birth_date,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

let userData = null;

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?;",
    [username, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        req.session.user = result[0];
        userData = req.session.user;
        res.send({
          loggedIn: true,
          user: {
            username: result[0].username,
            first_name: result[0].first_name,
            last_name: result[0].last_name,
            gender: result[0].gender,
            email: result[0].email,
            phone_number: result[0].phone_number,
            birth_date: result[0].birth_date,
          },
          message: "Prijavljen si",
        });
      } else {
        res.send({
          message: "Pogrešna kombinacija korisničkog imena i lozinke!",
        });
      }
    }
  );
});
module.exports = { router, userData };
