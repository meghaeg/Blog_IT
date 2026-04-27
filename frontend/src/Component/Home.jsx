import { useNavigate } from "react-router-dom";
import ViewBlogs from "./ViewBlogs";
import "./Home.css";
import { useEffect, useRef, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [user, setUser] = useState(null);
  const logout = () => {
    fetch("https://blog-it-67ma.onrender.com/api/users/logout", {
      method: "POST",
      credentials: "include"
    }).then(() => {
      setUser(null);
      navigate("/");
    });
  };

  const openChat = async () => {
  try {
    const res = await fetch("https://blog-it-67ma.onrender.com/api/users/isLoggedIn", {
      credentials: "include",
    });
    const data = await res.json();

    if (data.loggedIn) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  } catch (err) {
    navigate("/login");
  }
};


  useEffect(() => {
    fetch("https://blog-it-67ma.onrender.com/api/users/isLoggedIn", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setUser({
            id: data.userId,
            name: data.name
          });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);


  useEffect(() => {
    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.hero-image, .hero-content, .hero-image-right');
      elements.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 200);
      });
    }
  }, []);

  return (
    <div className="home-wrapper">
      <nav className="navbar">
        <h1 className="logo">BLOG IT</h1>
        <div className="nav-links">
        {!user ? (
        <>
       <button className="nav-btn" onClick={() => navigate("/login")}>
         Login
        </button>
        <button className="nav-btn" onClick={() => navigate("/signup")}>
          Signup
         </button>
      </>
      ) : (
      <>
       <span className="username">Hi, {user.name}</span>
        <div className="nav-actions">
  <button
    className="nav-btn primary"
    onClick={() => navigate("/create")}
  >
    Create Blog
  </button>

  <button
    className="nav-btn outline"
    onClick={() => navigate("/myBlogs")}
  >
    My Blogs
  </button>

  <button
        className="nav-btn outline"
        onClick={() => navigate("/savedBlogs")}
      >
      Saved Blogs
      </button>
</div>
       <button className="nav-btn" onClick={logout}>
       Logout
       </button>
    </>
    )}
      </div>
      </nav>

      <section className="hero-section" ref={heroRef}>
        <div className="hero-image">
          <img src={require("../assets/home1.avif")} alt="Writing" />
        </div>

        <div className="hero-content">
          <h2 className="hero-title">
            Take the leap like<br />millions before you
          </h2>
          <button className="cta-button">
            Start Now →
          </button>
        </div>

        <div className="hero-image-right">
          <img src={require("../assets/home2.avif")} alt="Creator" />
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-image">
            <img src={require("../assets/home3.avif")} alt="Create" />
          </div>
          <div className="feature-content">
  <h3>Vacation Blogs</h3>
  <p>Share your travel adventures, favorite destinations, and holiday memories. Capture the essence of every trip and inspire others to explore the world.</p>
  <button className="feature-btn">Start Now →</button>
</div>

        </div>

        <div className="feature-card">
          <div className="feature-image">
            <img src={require("../assets/home4.avif")} alt="Launch" />
          </div>
          <div className="feature-content">
  <h3>Educational Blogs</h3>
  <p>Share knowledge, tutorials, and learning resources. Explain concepts clearly, help others grow, and make learning accessible to everyone.</p>
  <button className="feature-btn">Start Now →</button>
</div>
        </div>

        <div className="feature-card">
          <div className="feature-image">
            <img src={require("../assets/home5.avif")} alt="Grow" />
          </div>
          <div className="feature-content">
  <h3>Food Blogs</h3>
  <p>Showcase recipes, food reviews, and culinary experiences. From home cooking to street food and fine dining, let your taste stories come alive.</p>
  <button className="feature-btn">Start Now →</button>
</div>
        </div>
      </section>

      <section className="blogs-section">
        <h3 className="blogs-section-title">Latest Posts</h3>
        <ViewBlogs />
      </section>

      <div
  className="chatbot-icon"
  onClick={openChat}
  title="Chat with us"
>
  💬
</div>


    </div>
  );
}

export default Home;