import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Login.css";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      setTimeout(() => {
        formRef.current.style.opacity = '1';
        formRef.current.style.transform = 'translateY(0)';
      }, 100);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("https://blog-it-67ma.onrender.com/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
      });
      
      if (res.ok) {
        setTimeout(() => navigate("/"), 500);
      } else {
        setIsLoading(false);
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setIsLoading(false);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
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
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80" 
              alt="Login illustration" 
            />
            <div className="image-overlay">
              <h2>Welcome Back!</h2>
              <p>Continue your blogging journey</p>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <form 
            className="login-form" 
            onSubmit={submit}
            ref={formRef}
          >
            <div className="form-header">
              <h2 className="form-title">Sign In</h2>
              <p className="form-subtitle">Enter your credentials to access your account</p>
            </div>

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner-small"></span>
              ) : (
                "Sign In →"
              )}
            </button>

            <div className="form-footer">
              <p>Don't have an account? <span className="link" onClick={() => navigate("/signup")}>Sign Up</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;