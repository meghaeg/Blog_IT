const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../modals/userschema'); 
const Blog = require('../modals/blogschema');

const JWT_SECRET = "mysecretkey";

const register = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 3600000,
  });

  res.json({ message: "Login successful" });
};

const isLoggedIn = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ loggedIn: false });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("name"); 
    if (!user) {
      return res.status(401).json({ loggedIn: false });
    }
    res.status(200).json({
      loggedIn: true,
      userId: decoded.id,
      name: user.name
    });
  } catch {
    res.status(401).json({ loggedIn: false });
  }
};

const saveBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user.savedBlogs.includes(blogId)) {
      return res.status(400).json({ message: "Already Saved" });
    }
    user.savedBlogs.push(blogId);
    await user.save();
    res.json({ message: "Saved Blog" });
  } catch (err) {
    console.error("CANNOT SAVE", err);
    res.status(500).json({ message: "Save failed" });
  }
};

const unsaveBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    await User.findByIdAndUpdate(
      userId,
      { $pull: { savedBlogs: blogId } } 
    );
    res.json({ message: "Blog unsaved successfully" });
  } catch (err) {
    console.error("CANNOT UNSAVE", err);
    res.status(500).json({ message: "Unsave failed" });
  }
};

const getSavedBlogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("savedBlogs"); 
    res.json(user.savedBlogs);
  } catch (err) {
    console.error("FETCH SAVED BLOGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch saved blogs" });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogs = await Blog.find({ authorId: userId }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error("FETCH MY BLOGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch your blogs" });
  }
};

module.exports = { register, login, isLoggedIn, saveBlogById, getSavedBlogs, unsaveBlogById, getMyBlogs}

