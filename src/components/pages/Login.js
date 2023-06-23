import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Pages.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    return fetch(`http://localhost:8088/users?email=${email}`)
      .then((res) => res.json())
      .then((foundUsers) => {
        if (foundUsers.length === 1) {
          const user = foundUsers[0];
          localStorage.setItem(
            "gg_user",
            JSON.stringify({
              id: user.id,
              isStaff: user.isStaff,
            })
          );

          // Dispatch storage event to update the user state in the Header component
          window.dispatchEvent(new Event("storage"));

          navigate("/");
        } else {
          window.alert("Invalid login");
        }
      });
  };

  return (
    <div className="login-container">
      <h1 className="h1-header">Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="action-button" type="submit">Login</button>
      </form>
      <p className="centered-text">
        Don't have an account? <Link to="/register" className="logout-link">Register</Link>
      </p>
    </div>
  );
};
