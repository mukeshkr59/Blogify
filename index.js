const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const userRoute = require("./routes/user");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then((e) => console.log("MongoDB Connected"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  return res.render("home");
});

app.use("/user", userRoute);

app.listen(PORT, () =>
  console.log(`Server Started at http://localhost:${PORT}`)
);
