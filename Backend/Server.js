require("dotenv").config();

const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/userRoutes");
const blogRouter = require("./Routes/blogRoutes");
const { Server } = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5002;

const app = express();
const server = http.createServer(app);

// ✅ TRUST PROXY (IMPORTANT)
app.set("trust proxy", 1);

// ✅ CORS FIX
app.use(cors({
  origin: "https://splendid-elf-33bf32.netlify.app",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

app.get("/", (req, res) => {
  res.send("Server running");
});

// ✅ SOCKET FIX
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Chat user connected:", socket.id);

  socket.on("join", ({ username, room }) => {
    socket.username = username;
    socket.room = room;
    socket.join(room);

    socket.to(room).emit("message", {
      user: "system",
      text: `${username} joined the chat`,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("send_message", ({ text }) => {
    if (!socket.room) return;

    io.to(socket.room).emit("message", {
      user: socket.username,
      text,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnect", () => {
    if (socket.username && socket.room) {
      socket.to(socket.room).emit("message", {
        user: "system",
        text: `${socket.username} left the chat`,
        time: new Date().toLocaleTimeString()
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});