const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/userRoutes");
const blogRouter = require("./Routes/blogRoutes");
const { Server } = require("socket.io");
const http = require("http");

const PORT = 5002;
const JWT_SECRET = "mysecretkey";

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost:27017/blogdb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const User = require("./modals/userschema");
const Blog = require("./modals/blogschema");

app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

app.get("/", (req, res) => {
  res.send("Server running");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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
    console.log("Chat user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
