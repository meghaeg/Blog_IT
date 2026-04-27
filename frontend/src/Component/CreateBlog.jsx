import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CreateBlog.css";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://blog-it-67ma.onrender.com/api/users/isLoggedIn", {
      credentials: "include"
    }).then(res => {
      if (res.status === 401) {
        navigate("/login");
      }
    });
  }, [navigate]);

  const submit = (e) => {
    e.preventDefault();
    fetch("https://blog-it-67ma.onrender.com/api/blogs/createBlog", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category })
    }).then(res => {
      if (res.status === 401) {
        navigate("/login");
      } else {
        navigate("/");
      }
    });
  };

  return (
    <div className="create-blog-wrapper">
      <form className="create-blog-form" onSubmit={submit}>
        <h2>Create Blog</h2>
        <input
          placeholder="Blog Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your content..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option>Technology</option>
<option>Health</option>
<option>Education</option>
<option>Travel</option>
<option>Food</option>
<option>Lifestyle</option>
<option>Business</option>
<option>Finance</option>
<option>Fashion</option>
<option>Sports</option>
<option>Entertainment</option>
<option>Science</option>
<option>Personal Development</option>
<option>Photography</option>
<option>Fitness</option>
<option>Parenting</option>
<option>Art & Design</option>
<option>History</option>
<option>Environment</option>
<option>Gaming</option>

        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateBlog;