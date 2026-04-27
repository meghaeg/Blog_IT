import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      setTimeout(() => {
        formRef.current.style.opacity = "1";
        formRef.current.style.transform = "translateY(0)";
      }, 100);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("https://blog-it-67ma.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        alert(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <button className="back-home-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div className="login-content">
        <div className="login-image-section">
          <div className="image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="Signup illustration"
            />
            <div className="image-overlay">
              <h2>Join Us Today!</h2>
              <p>Create your account and start blogging</p>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <form className="login-form" onSubmit={submit} ref={formRef}>
            <div className="form-header">
              <h2 className="form-title">Sign Up</h2>
              <p className="form-subtitle">Create an account to get started</p>
            </div>

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <span className="loading-spinner-small"></span> : "Create Account →"}
            </button>

            <div className="form-footer">
              <p>
                Already have an account?{" "}
                <span className="link" onClick={() => navigate("/login")}>
                  Sign In
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
