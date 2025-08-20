const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve(`./public/images/`));
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${Date.now()}-${file.originalname}`;
//     cb(null, fileName);
//   },
// });
// const upload = multer({ storage: storage });
// // Profile page
// router.get("/profile", async (req, res) => {
//   if (!req.user) return res.redirect("/user/signin");
//   const blogs = await Blog.find({ createdBy: req.user._id });
//   const comments = await Comment.find({ createdBy: req.user._id });
//   return res.render("profile", {
//     user: req.user,
//     blogs,
//     comments,
//   });
// });

// // Profile image update
// router.post(
//   "/profile-image",
//   upload.single("profileImage"),
//   async (req, res) => {
//     if (!req.user) return res.redirect("/user/signin");
//     if (req.file) {
//       await User.findByIdAndUpdate(req.user._id, {
//         prifileImageURL: `/images/${req.file.filename}`,
//       });
//     }
//     return res.redirect("/user/profile");
//   }
// );
const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin", {
    user: req.user,
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    console.log("Token :", token);
    // return res.cookie("token", token).redirect("/");
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email/Password",
    });
    // console.error(err.message);
    // return res.status(400).send(err.message);
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/images/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });
// Profile page
router.get("/profile", async (req, res) => {
  if (!req.user) return res.redirect("/user/signin");
  const blogs = await Blog.find({ createdBy: req.user._id });
  const comments = await Comment.find({ createdBy: req.user._id });
  return res.render("profile", {
    user: req.user,
    blogs,
    comments,
  });
});

// Profile image update
router.post(
  "/profile-image",
  upload.single("profileImage"),
  async (req, res) => {
    if (!req.user) return res.redirect("/user/signin");
    if (req.file) {
      await User.findByIdAndUpdate(req.user._id, {
        prifileImageURL: `/images/${req.file.filename}`,
      });
    }
    return res.redirect("/user/profile");
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
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
