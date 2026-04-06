import { useEffect } from "react";
import axios from "axios";

function Callback() {

  useEffect(() => {

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      console.log("No code found");
      return;
    }

    // Send code to backend to get token
    axios.get(`http://127.0.0.1:5000/spotify/callback?code=${code}`)
      .then(res => {

        console.log("Spotify token received:", res.data);

        // Save access token
        localStorage.setItem("spotify_token", res.data.access_token);

        // Redirect back to dashboard
        window.location.href = "/dashboard";
      })
      .catch(err => {
        console.log("Error getting token:", err);
      });

  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Connecting to Spotify... 🎧</h2>
      <p>Please wait</p>
    </div>
  );
}

export default Callback;