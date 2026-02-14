const express=require('express');
const router=express.Router();
const userController=require('../Controllers/userController');
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/isLoggedIn", userController.isLoggedIn);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  res.json({ message: "Logged out" });
});
router.post("/savePost/:id",authMiddleware, userController.saveBlogById);
router.post("/unsavePost/:id", authMiddleware, userController.unsaveBlogById);
router.get("/savedBlogs", authMiddleware, userController.getSavedBlogs);
router.get("/myBlogs", authMiddleware, userController.getMyBlogs);

module.exports = router;


/*
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
    });
    res.send({ message: "Login successful" });
});

module.exports = router;
*/
