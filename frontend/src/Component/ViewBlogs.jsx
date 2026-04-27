import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewBlogs.css";

function ViewBlogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://blog-it-67ma.onrender.com/api/blogs/getBlog")
      .then(res => res.json())
      .then(setBlogs);
  }, []);

  const checkAuth = async () => {
    const res = await fetch("https://blog-it-67ma.onrender.com/api/users/isLoggedIn", {
      credentials: "include"
    });
    return res.status === 200;
  };

 const like = async (id) => {
  const loggedIn = await checkAuth();
  if (!loggedIn) {
    navigate("/login");
    return;
  }

  const res = await fetch(`https://blog-it-67ma.onrender.com/api/blogs/like/${id}`, {
    method: "POST",
    credentials: "include"
  });

  if (!res.ok) return; // already liked or error

  setBlogs(prev =>
    prev.map(b =>
      b._id === id
        ? { ...b, likes: [...b.likes, "self"] }
        : b
    )
  );
};


  const saveBlog = async (id) => {
    const loggedIn = await checkAuth();
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    await fetch(`https://blog-it-67ma.onrender.com/api/users/savePost/${id}`, {
      method: "POST",
      credentials: "include"
    });
    setBlogs(prev =>
      prev.map(b =>
        b._id === id ? { ...b, saved: true } : b
      )
    );
  };

  return (
    <div className="blogs-container">
      {blogs.map(b => (
        <div className="blog-card" key={b._id}>
          <div className="blog-content-wrapper">
            <h3 className="blog-title">{b.title}</h3>
            <p className="blog-content">
              {b.content.slice(0, 120)}...
            </p>

            <div className="blog-footer">
              <button
                className="read-more-btn"
                onClick={() => navigate(`/blog/${b._id}`)}
              >
                Read More →
              </button>
              <button
  className={`like-btn ${b.likes.includes("self") ? "liked" : ""}`}
  onClick={() => like(b._id)}
>
  ❤️ {b.likes.length}
</button>

              <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACUCAMAAAAqEXLeAAAAY1BMVEX///8aGhoXFxckJCTMzMwAAAAKCgr29vZkZGRnZ2cyMjISEhLm5ubp6ekqKiq8vLyFhYWrq6uMjIza2tofHx+hoaE9PT1dXV2WlpZ1dXXCwsLU1NRsbGy0tLRQUFB/f39JSUn24jhpAAADbklEQVR4nO2c7XKqMBBAJboJJiDfFNHavv9TlpDYgkWluAl35u754bSdshyWbBZt0s2GIAiCIAiCIAjiv0fEixDeBOMqrOVhEbLeV7F7Q5GEAKDYQlR3cJg4TmhxBmDBSzDg58KlY3ZVZGoR9mCAzJ1jYxQ5wFYuogTgRrNx5Zj3jhxks4sWsmtkr8kgd+P43jvCJXktTHKB3vIdx2pMIZV2TF+eQuJUWyrpono+dGicu5T3oT4wQo0pMAObC8ZP5bGLqxhSu4hZN3TgiBPsB8G6qsGb3rLukhnD7jytTqREiyp0FUKLFc7SgK5svHi6wtFndD0kMac2fb+xB6U4824MId6ethvjfI87KEXYSW53eAF3W5LEgSSxIEksSBILksSCJLEgSSxIEguSxIIksSBJLEgSC5LEgiSxIEksSBILksSCJLEgSSxIEguSxIIksSBJLEgSC5LEYl3JOM/nrHBaVTLhAHzGusA1JZtSBYEqny/4WU9SpGapKoP02elXk4xCuK4uhn30+HfXkiw+e0cwr5+PFx6uJJmUerGugjQFvWSVlw/LZx3JrFdTqtpsKtV/+XAh4xqSIh+m75rU/L7ECpLxxQzE2s7jcW2+v9yd1/1LFtYx/C5pW+hwuVc+3iXbkv+aHO2UCeWd5YyeJYUtmbIa/7wqbflMmniWTLnZbPArZa3ZQMAnF9l6lexKpr+t9USHiWqzgWCqfHxKnmyXOU+WcXy23ee0puRua3J1vHM2cTR5njrSl2RlZnD2oLVkzMzrN1XlT/LDpEk9XDTdKpPsm10TniTjvXGcGHAjzLBlsB8NWz+SJ1u60yUz5Ho19fBqvEjupL2LM84j7LiQw+M9SJqSUXzmtpKMq5vycS8pcpua2Zsh3m3ivx/enEsKO0fLJyUz5CTtrC/8SEaBycrbn04h3kz2g8iHZGLv3NN3rbch7MObTNxLVmq6hczANij9Nsip5Hc6Fm3NaX9ugjvJkwit48LdfIW1DMXJlaTMbIcLF+8MjO1VfmbSjWQXm48nuyWBrruG9YsTyWBpyQxp+vIJXEqOGvAyTNt3KPn0wWwO9j2HI8muyzz5RG8ekek+TiQV3m7n/pM3bMkuKnu5ZIZUXDHMba894u1wQPwLie6Lh789ocwCPaK//4FCEARBEARBEATxL/EFqMc/Cpbzk0oAAAAASUVORK5CYII="
            alt="Save"
            className={`save-icon ${b.saved ? "saved" : ""}`}
            onClick={() => saveBlog(b._id)}
            />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewBlogs;
