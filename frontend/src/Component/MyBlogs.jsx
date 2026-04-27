import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedBlogs.css";

const MyBlogs = () => {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const res = await fetch("https://blog-it-67ma.onrender.com/api/users/myBlogs", {
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      setMyBlogs(data);
    } catch (err) {
      console.error("Failed to fetch my blogs", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`https://blog-it-67ma.onrender.com/api/blogs/blogs/${id}`, {
  method: "DELETE",
  credentials: "include"
});


      if (res.ok) {
        setMyBlogs((prev) => prev.filter((b) => b._id !== id));
      } else {
        console.error("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting blog", err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setEditTitle(blog.title);
    setEditContent(blog.content);
    setEditCategory(blog.category);
  };

  // ================= UPDATE =================
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`https://blog-it-67ma.onrender.com/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          category: editCategory,
        }),
      });

      if (!res.ok) {
        console.error("Update failed");
        return;
      }

      // Update UI instantly
      setMyBlogs((prev) =>
        prev.map((b) =>
          b._id === id
            ? {
                ...b,
                title: editTitle,
                content: editContent,
                category: editCategory,
              }
            : b
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error("Error updating blog", err);
    }
  };

  if (loading) {
    return (
      <div className="saved-blogs-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="saved-blogs-page">
      <h2 className="saved-blogs-heading">My Blogs</h2>

      {myBlogs.length === 0 ? (
        <p className="saved-blogs-empty">You haven’t created any blogs yet.</p>
      ) : (
        <div className="saved-blogs-container">
          {myBlogs.map((blog) => (
            <div className="saved-blog-card" key={blog._id}>
              {editingId === blog._id ? (
                /* ======= EDIT MODE ======= */
                <div className="edit-container">
                  <input
                    className="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Blog title"
                  />

                  <textarea
                    className="edit-content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Blog content"
                  />

                  <input
                    className="edit-category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Category"
                  />

                  <div className="edit-actions">
                    <button onClick={() => handleUpdate(blog._id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ======= VIEW MODE ======= */
                <>
                  <h3 className="saved-blog-title">{blog.title}</h3>
                  <p className="saved-blog-content">
                    {blog.content.length > 150
                      ? blog.content.substring(0, 150) + "..."
                      : blog.content}
                  </p>

                  <div className="saved-blog-footer">
                    <button
                      className="saved-edit-btn"
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </button>

                    <button
                      className="saved-delete-btn"
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </button>

                    <button className="saved-like-btn">
                      ❤️ {blog.likes?.length || 0}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
