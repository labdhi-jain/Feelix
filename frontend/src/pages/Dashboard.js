import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Analytics from "./Analytics"; // Fix path if necessary
import { motion } from "framer-motion";
import { Camera, Music, Activity, Headphones } from "lucide-react";

const emotionMusic = {
  happy: { song: "Happy", artist: "Pharrell Williams", url: "https://www.youtube.com/embed/y6Sxv-sUYtM" },
  sad: { song: "Let Her Go", artist: "Passenger", url: "https://www.youtube.com/embed/Ho32Oh6b4jc" },
  angry: { song: "Relaxing Music", artist: "Ambient", url: "https://www.youtube.com/embed/2OEL4P1Rz04" },
  neutral: { song: "Chill Lofi", artist: "Lofi Beats", url: "https://www.youtube.com/embed/jfKfPfyJRdk" },
  surprise: { song: "Counting Stars", artist: "OneRepublic", url: "https://www.youtube.com/embed/hT_nvWreIhg" },
  fear: { song: "Fix You", artist: "Coldplay", url: "https://www.youtube.com/embed/k4V3Mo61fJM" }
};

function Dashboard() {
  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const [song, setSong] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);

  const connectSpotify = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/spotify/login");
      window.location.href = res.data.url;
    } catch (err) {
      console.log("Spotify login error:", err);
    }
  };

  const capture = async () => {
    try {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const user_id = localStorage.getItem("user_id") || 1; // Fallback to 1 if not logged in just for testing

      const res = await axios.post("http://127.0.0.1:5000/detect", {
        image: imageSrc,
        user_id: parseInt(user_id)
      });

      const detectedEmotion = res.data.emotion;
      setEmotion(detectedEmotion);

      if (emotionMusic[detectedEmotion]) {
        setSong(emotionMusic[detectedEmotion]);
      }

      const token = localStorage.getItem("spotify_token");
      if (token) {
        await axios.post("http://127.0.0.1:5000/spotify/play", {
          emotion: detectedEmotion,
          token
        });
      }
    } catch (err) {
      console.log("Error detecting emotion:", err);
    }
  };

  useEffect(() => {
    let interval;
    if (isDetecting) {
      interval = setInterval(() => {
        capture();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isDetecting]);

  return (
    <div style={{ width: "100%", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1200px", marginBottom: "40px" }}
      >
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>
          <span className="text-gradient">Feelix</span> AI
        </h1>
        <button className="btn-secondary" onClick={connectSpotify} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Headphones size={20} />
          Connect Spotify
        </button>
      </motion.div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px", width: "100%", maxWidth: "1200px" }}>
        
        {/* Camera Section */}
        <motion.div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column" }} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Camera color="var(--accent-primary)" />
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Live Analysis</h2>
          </div>
          
          <div style={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden", background: "#000", flex: 1, minHeight: "300px" }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Scanning Overlay Animation */}
            <motion.div 
              animate={{ y: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2px", background: "var(--accent-primary)", boxShadow: "0 0 10px var(--accent-primary)" }}
            />
          </div>
          
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>Scanning every 3s...</p>
            <button 
              className="btn-secondary" 
              style={{ padding: "8px 16px", fontSize: "0.9rem" }}
              onClick={() => setIsDetecting(!isDetecting)}
            >
              {isDetecting ? "Pause" : "Resume"}
            </button>
          </div>
        </motion.div>

        {/* Emotion & Music Section */}
        <motion.div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "30px" }} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          
          {/* Emotion State */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Activity color="var(--accent-secondary)" />
              <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Detected Emotion</h2>
            </div>
            
            <motion.div 
              className="glass-panel-interactive"
              key={emotion} // Triggers re-animation on change
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ padding: "30px", textAlign: "center", background: "rgba(255, 255, 255, 0.02)" }}
            >
              {emotion ? (
                <h3 className="text-gradient" style={{ fontSize: "3rem", margin: 0, textTransform: "capitalize" }}>
                  {emotion}
                </h3>
              ) : (
                <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", margin: 0 }}>Waiting for face...</p>
              )}
            </motion.div>
          </div>

          {/* Music Player */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Music color="#1DB954" />
              <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Now Playing</h2>
            </div>

            {song ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ margin: "0 0 15px 0", color: "var(--text-primary)", fontWeight: "600", fontSize: "1.1rem" }}>
                  {song.song} <span style={{ color: "var(--text-secondary)", fontWeight: "400" }}>by {song.artist}</span>
                </p>
                <iframe
                  style={{ width: "100%", flex: 1, border: "none", borderRadius: "12px", background: "rgba(0,0,0,0.5)" }}
                  src={song.url}
                  title="Music"
                  allow="autoplay"
                ></iframe>
              </motion.div>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px" }}>
                <p style={{ color: "var(--text-secondary)", margin: 0 }}>Detect an emotion to play music</p>
              </div>
            )}
          </div>

        </motion.div>
      </div>

      {/* Analytics Section */}
      <Analytics />

    </div>
  );
}

export default Dashboard;