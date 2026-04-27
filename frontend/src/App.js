import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Component/Home";
import Login from "./Component/Login";
import Signup from "./Component/Signup";
import CreateBlog from "./Component/CreateBlog";
import ViewBlogs from "./Component/ViewBlogs";
import BlogDetail from "./Component/BlogDetail";
import SavedBlogs from "./Component/SavedBlogs";
import Chat from "./Component/Chat";
import MyBlogs from "./Component/MyBlogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<ViewBlogs />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/savedBlogs" element={<SavedBlogs />} />
        <Route path="/myBlogs" element={<MyBlogs />} />
        <Route path="/chat" element={<Chat/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
