import React, { useEffect, useState } from "react";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [commentText, setCommentText] = useState({});

  const fetchBlogs = () => {
    fetch("https://blog-it-67ma.onrender.com/api/blogs/getBlog", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch(() => alert("Failed to fetch blogs"));
  };useEffect(() => { fetchBlogs(); }, []);

  const likeBlog = (id) => {
    fetch(`https://blog-it-67ma.onrender.com/api/blogs/like/${id}`, {
      method: "POST",
      credentials: "include", 
    })
      .then(() => fetchBlogs())
      .catch(() => alert("Like failed"));
  };

  const addComment = (id) => {
    fetch(`https://blog-it-67ma.onrender.com/api/blogs/comment/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: commentText[id] }),
    })
      .then(() => {
        setCommentText({ ...commentText, [id]: "" });
        fetchBlogs();
      })
      .catch(() => alert("Comment failed"));
  };

  return (
    <div>
      <h2>All Blogs</h2>

      {blogs.map((blog) => (
        <div key={blog._id} style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
          <p><b>Category:</b> {blog.category}</p>

          <button onClick={() => likeBlog(blog._id)}>
            Like ({blog.likes.length})
          </button>

          <div>
            <input
              placeholder="Add comment"
              value={commentText[blog._id] || ""}
              onChange={(e) =>
                setCommentText({ ...commentText, [blog._id]: e.target.value })
              }
            />
            <button onClick={() => addComment(blog._id)}>Comment</button>
          </div>

          <ul>
            {blog.comments.map((c, i) => (
              <li key={i}>{c.text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default BlogList;
