import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedBlogs.css";

function SavedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://blog-it-67ma.onrender.com/api/users/savedBlogs", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setBlogs)
      .catch((err) => console.error("Error fetching saved blogs:", err));
  }, []);

  const likeBlog = async (id) => {
    const res = await fetch("https://blog-it-67ma.onrender.com/api/users/isLoggedIn", {
      credentials: "include",
    });
    if (res.status !== 200) {
      navigate("/login");
      return;
    }
    await fetch(`https://blog-it-67ma.onrender.com/api/blogs/like/${id}`, {
      method: "POST",
      credentials: "include",
    });
    setBlogs((prev) =>
      prev.map((b) => (b._id === id ? { ...b, likes: [...b.likes, "liked"] } : b))
    );
  };

  const unsaveBlog = async (id) => {
    const res = await fetch("https://blog-it-67ma.onrender.com/api/users/isLoggedIn", {
      credentials: "include",
    });
    if (res.status !== 200) {
      navigate("/login");
      return;
    }

    await fetch(`https://blog-it-67ma.onrender.com/api/users/unsavePost/${id}`, {
      method: "POST",
      credentials: "include",
    });

    // Remove the blog from saved list locally
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="saved-blogs-page">
      <h1 className="saved-blogs-heading">Your Saved Blogs</h1>
      <div className="saved-blogs-container">
        {blogs.length === 0 ? (
          <p className="saved-blogs-empty">You have no saved blogs.</p>
        ) : (
          blogs.map((b) => (
            <div className="saved-blog-card" key={b._id}>
              <div className="saved-blog-content-wrapper">
                <h3 className="saved-blog-title">{b.title}</h3>
                <p className="saved-blog-content">{b.content.slice(0, 120)}...</p>

                <div className="saved-blog-footer">
                  <button
                    className="saved-read-more-btn"
                    onClick={() => navigate(`/blog/${b._id}`)}
                  >
                    Read More →
                  </button>
                  <button
                    className="saved-like-btn"
                    onClick={() => likeBlog(b._id)}
                  >
                    ❤️ {b.likes.length}
                  </button>
                  <button
                    className="unsave-btn"
                    onClick={() => unsaveBlog(b._id)}
                  >
                    Unsave
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedBlogs;
