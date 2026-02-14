const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");

// ✅ Single destructured import
const {
  createBlog,
  getBlog,
  getBlogById,
  likeBlog,
  addComment,
  editBlogById,
  deleteBlogById
} = require("../Controllers/blogController");

// Routes
router.post("/createBlog", authMiddleware, createBlog);
router.get("/getBlog", getBlog);
router.get("/getBlog/:id", getBlogById);

router.post("/like/:id", authMiddleware, likeBlog);
router.post("/comment/:id", authMiddleware, addComment);

// ✅ AUTHOR ONLY
router.put("/blogs/:id", authMiddleware, editBlogById);
router.delete("/blogs/:id", authMiddleware, deleteBlogById);

module.exports = router;
