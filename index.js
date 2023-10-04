const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const logoutRouter = require("./routes/logout");
const vehicleRouter = require("./routes/vehicle");
const vehicleRentRouter = require("./routes/vehicleRent");
const clientRoutes = require("./routes/clients");
const dashboardRouter = require("./routes/dashboard");

const report = require("./reports/report");

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "sistem",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.use("/", authRouter.router);
app.use("/", usersRouter);
app.use("/", logoutRouter);
app.use("/", clientRoutes);
app.use("/", vehicleRouter);
app.use("/", vehicleRentRouter);
app.use("/", dashboardRouter);
app.use("/", report);

app.listen(3000, () => {
  console.log("Server je pokrenut");
});
