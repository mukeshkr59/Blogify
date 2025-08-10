const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)

  try {
    const user = await User.matchPassword(email, password);

    console.log("User", user);
    return res.redirect("/");
  } catch (err) {
    console.error(err.message);
    return res.status(400).send(err.message);
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body);
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

module.exports = router;
