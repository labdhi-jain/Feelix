import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      console.log("No code found");
      navigate("/dashboard");
      return;
    }

    // Send code to backend to get token
    // Note: The FastAPI backend returns a string token directly or JSON. We handle accordingly.
    axios.get(`http://127.0.0.1:5000/spotify/callback?code=${code}`)
      .then(res => {
        // FastAPI returns the token as the response body
        const token = typeof res.data === 'string' ? res.data : res.data.access_token || res.data;
        console.log("Spotify token received");
        localStorage.setItem("spotify_token", token);
        navigate("/dashboard");
      })
      .catch(err => {
        console.log("Error getting token:", err);
        navigate("/dashboard");
      });

  }, [navigate]);

  return (
    <motion.div 
      className="glass-panel"
      style={{ padding: "60px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Headphones size={64} color="#1DB954" />
      </motion.div>
      <h2 style={{ margin: 0, fontSize: "1.8rem" }}>Connecting to Spotify...</h2>
      <p style={{ color: "var(--text-secondary)", margin: 0 }}>Securing your playback credentials</p>
    </motion.div>
  );
}

export default Callback;