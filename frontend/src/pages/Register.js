import React, { useState } from "react";
import axios from "axios";

function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {

    await axios.post("http://localhost:5000/register", {
      username,
      password
    });

    alert("User registered!");

    window.location.href = "/";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Create Feelix Account</h2>

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

      <button onClick={register}>Register</button>

      <p>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default Register;