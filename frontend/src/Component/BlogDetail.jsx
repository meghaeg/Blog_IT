import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './BlogDetail.css';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://blog-it-67ma.onrender.com/api/blogs/getBlog/${id}`)
      .then(res => res.json())
      .then(setBlog)
      .catch(() => navigate("/"));
  }, [id, navigate]);

  const checkAuth = async () => {
    const res = await fetch("https://blog-it-67ma.onrender.com/api/users/isLoggedIn", {
      credentials: "include"
    });
    return res.status === 200;
  };

  const like = async () => {
    const loggedIn = await checkAuth();
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    await fetch(`https://blog-it-67ma.onrender.com/api/blogs/like/${id}`, {
      method: "POST",
      credentials: "include"
    });
    setBlog(prev => ({ ...prev, likes: [...prev.likes, "liked"] }));
  };

  const addComment = async () => {
    const loggedIn = await checkAuth();
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    if (!comment) return;

    await fetch(`https://blog-it-67ma.onrender.com/api/blogs/comment/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment })
    });

    setBlog(prev => ({
      ...prev,
      comments: [...prev.comments, { text: comment }]
    }));
    setComment("");
  };

  if (!blog) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="blog-detail-wrapper">
      <nav className="detail-navbar">
        <h1 className="logo" onClick={() => navigate("/")}>BLOG IT</h1>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </nav>

      <div className="blog-detail">
        <div className="blog-header">
          <span className="blog-category-badge">{blog.category}</span>
          <h1 className="blog-detail-title">{blog.title}</h1>
          <div className="blog-meta">
            <button className="like-btn-detail" onClick={like}>
              ❤️ {blog.likes.length} Likes
            </button>
          </div>
        </div>

       <div className="blog-content-detail">
          <p>{blog.content}</p>
        </div>

        <div className="comments-section">
          <h3 className="comments-title">
            💬 Comments ({blog.comments.length})
          </h3>
          
          <div className="add-comment">
            <input
              className="comment-input"
              placeholder="Share your thoughts..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button className="add-comment-btn" onClick={addComment}>
              Post Comment
            </button>
          </div>

          <div className="comments-list">
            {blog.comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              blog.comments.map((c, i) => (
                <div key={i} className="comment-item">
                  <div className="comment-avatar"></div>
                  <div className="comment-content">
                    <p>{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;