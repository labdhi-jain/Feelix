import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password
      });
      localStorage.setItem("user_id", res.data.user_id);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <motion.div 
      className="glass-panel"
      style={{ padding: "40px", width: "100%", maxWidth: "400px", textAlign: "center" }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 style={{ marginBottom: "30px", fontSize: "2rem" }}>
        Welcome to <span className="text-gradient">Feelix</span>
      </h2>

      <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <input
          className="input-glass"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          className="input-glass"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "#ff4d4d", fontSize: "0.9rem", margin: 0 }}>{error}</p>}

        <button className="btn-primary" type="submit" style={{ marginTop: "10px" }}>
          Login
        </button>
      </form>

      <p style={{ marginTop: "30px", color: "var(--text-secondary)" }}>
        New user? <Link to="/register" style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: "600" }}>Register here</Link>
      </p>
    </motion.div>
  );
}

export default Login;