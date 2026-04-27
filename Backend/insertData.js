const mongoose = require("mongoose");
const User = require("./modals/userschema");
const Blog = require("./modals/blogschema");

const MONGODB_URI = "mongodb+srv://meghaeg27_db_user:Megha2711@cluster0.hz2o1hb.mongodb.net/blogit?retryWrites=true&w=majority&appName=Cluster0";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for seeding");

    // Create a dummy user
    const newUser = new User({
      name: "Admin User",
      password: "securepassword",
      role: "admin"
    });
    
    const savedUser = await newUser.save();
    console.log("Dummy User created:", savedUser._id);

    // Create a few blogs
    const dummyBlogs = [
      {
        authorId: savedUser._id,
        title: "Getting Started with React",
        content: "React is a popular frontend library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.",
        category: "Technology"
      },
      {
        authorId: savedUser._id,
        title: "Mastering Node.js",
        content: "Node.js is a runtime environment that allows you to execute JavaScript on the server. With Node.js, you can build scalable backend applications.",
        category: "Technology"
      },
      {
        authorId: savedUser._id,
        title: "The benefits of meditation",
        content: "Meditation can give you a sense of calm, peace and balance that can benefit both your emotional well-being and your overall health.",
        category: "Health"
      }
    ];

    await Blog.insertMany(dummyBlogs);
    console.log("Dummy Blogs inserted successfully!");

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedDatabase();
