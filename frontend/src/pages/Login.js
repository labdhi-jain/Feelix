import React, { useState } from "react";
import axios from "axios";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {

      const res = await axios.post("http://localhost:5000/login", {
        username,
        password
      });

      localStorage.setItem("user_id", res.data.user_id);

      window.location.href = "/dashboard";

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login to Feelix</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Login</button>

      <p>
        New user? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;