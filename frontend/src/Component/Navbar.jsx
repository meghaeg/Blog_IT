import React from "react";
import "./Navbar.css";

export default function Navbar({ onUserClick }) {
  return (
    <nav className="navbar">
      <h2 className="logo">CoffeeBlog</h2>

      <div className="user-icon" onClick={onUserClick}>
        👤
      </div>
    </nav>
  );
}
