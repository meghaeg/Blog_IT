const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Blog = require('../modals/blogschema'); 
const User = require("../modals/userschema");


const JWT_SECRET = "mysecretkey";

const createBlog = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { title, content, category } = req.body;
    const blog = new Blog({ authorId, title, content, category });
    await blog.save();
    res.json({ message: "Blog created" });
  } catch (err) {
    console.error("BLOG SAVE ERROR:", err);
    res.status(500).json({ message: "Blog not created" });
  }
};

const getBlog= async (req,res)=>{
    try{
    const blogs = await Blog.find();
    res.status(200).json(blogs);
    }
    catch(err){
        res.status(500).json({message: "Failed"});
    }
};


const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    await Blog.findByIdAndUpdate(
      blogId,
      { $push: { likes: userId } }
    );
    res.json({ message: "Blog liked" });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: "Like failed" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const addComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;
    await Blog.findByIdAndUpdate(
      blogId,
      { $push: { comments: { userId, text } } }
    );
    res.json({ message: "Comment added" });
  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: "Comment failed" });
  }
};

const editBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const { title, content, category } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.authorId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this blog" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (err) {
    console.error("EDIT BLOG ERROR:", err);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

const deleteBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Author check
    if (blog.authorId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(blogId);

    // Remove blog from all users' savedBlogs
    await User.updateMany(
      { savedBlogs: blogId },
      { $pull: { savedBlogs: blogId } }
    );

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("DELETE BLOG ERROR:", err);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};


module.exports = {createBlog,getBlog,likeBlog,addComment, getBlogById, editBlogById, deleteBlogById};
