const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const product = require("./routes/product.js");

const productRoutes = product.router;
const initializeFirebase = product.initializeFirebase;

const express = require("express");
const app = express();
const cors = require("cors");
initializeFirebase();
//initializeStorage();

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use("/product", productRoutes);

app.get("/", (req, res) => {
  res.status(201).json({
    message: "Hello World",
  });
});

app.listen(3000);
