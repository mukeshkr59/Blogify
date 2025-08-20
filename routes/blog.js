const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  console.log("blog", blog);
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

// Edit blog GET route
router.get("/edit/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).send("Blog not found");
  if (!req.user || String(blog.createdBy) !== String(req.user._id)) {
    return res.status(403).send("Unauthorized");
  }
  return res.render("editBlog", { user: req.user, blog });
});

// Edit blog POST route
router.post("/edit/:id", upload.single("coverImage"), async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).send("Blog not found");
  if (!req.user || String(blog.createdBy) !== String(req.user._id)) {
    return res.status(403).send("Unauthorized");
  }
  blog.title = req.body.title;
  blog.body = req.body.body;
  if (req.file) {
    blog.coverImageURL = `/uploads/${req.file.filename}`;
  }
  await blog.save();
  return res.redirect(`/blog/${blog._id}`);
});

// Delete blog POST route
router.post("/delete/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).send("Blog not found");
  if (!req.user || String(blog.createdBy) !== String(req.user._id)) {
    return res.status(403).send("Unauthorized");
  }
  // Delete all comments for this blog
  await Comment.deleteMany({ blogId: blog._id });
  // Delete the blog
  await blog.deleteOne();
  return res.redirect("/");
});

module.exports = router;
