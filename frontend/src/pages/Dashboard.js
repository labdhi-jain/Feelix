import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Analytics from "../Analytics";

const emotionMusic = {
  happy: {
    song: "Happy",
    artist: "Pharrell Williams",
    url: "https://www.youtube.com/embed/y6Sxv-sUYtM"
  },
  sad: {
    song: "Let Her Go",
    artist: "Passenger",
    url: "https://www.youtube.com/embed/Ho32Oh6b4jc"
  },
  angry: {
    song: "Relaxing Music",
    artist: "Ambient",
    url: "https://www.youtube.com/embed/2OEL4P1Rz04"
  },
  neutral: {
    song: "Chill Lofi",
    artist: "Lofi Beats",
    url: "https://www.youtube.com/embed/jfKfPfyJRdk"
  },
  surprise: {
    song: "Counting Stars",
    artist: "OneRepublic",
    url: "https://www.youtube.com/embed/hT_nvWreIhg"
  },
  fear: {
    song: "Fix You",
    artist: "Coldplay",
    url: "https://www.youtube.com/embed/k4V3Mo61fJM"
  }
};

function Dashboard() {

  const webcamRef = useRef(null);

  const [emotion, setEmotion] = useState("");
  const [song, setSong] = useState(null);

  // 🎧 Spotify Login
  const connectSpotify = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/spotify/login");
      window.location.href = res.data.url;
    } catch (err) {
      console.log("Spotify login error:", err);
    }
  };

  // 🧠 Emotion Detection
  const capture = async () => {
    try {
      if (!webcamRef.current) return;

      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const user_id = localStorage.getItem("user_id");

      const res = await axios.post("http://127.0.0.1:5000/detect", {
        image: imageSrc,
        user_id
      });

      const detectedEmotion = res.data.emotion;
      setEmotion(detectedEmotion);

      // 🎵 YouTube fallback
      if (emotionMusic[detectedEmotion]) {
        setSong(emotionMusic[detectedEmotion]);
      }

      // 🎧 Spotify playback
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

  // 🔥 Real-time detection every 3 sec
  useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  const styles = {

  container: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    minHeight: "100vh",
    color: "white",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial"
  },

  title: {
    fontSize: "36px",
    marginBottom: "20px"
  },

  spotifyBtn: {
    background: "#1DB954",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    color: "white",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "16px"
  },

  mainGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap"
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "20px",
    width: "350px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
  },

  webcam: {
    width: "100%",
    borderRadius: "10px"
  },

  emotionText: {
    fontSize: "28px",
    color: "#38bdf8"
  },

  player: {
    width: "100%",
    height: "200px",
    borderRadius: "10px"
  },

  analyticsCard: {
    marginTop: "30px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
  }

};
  
  return (
  <div style={styles.container}>

    <h1 style={styles.title}>Feelix 🎵</h1>

    {/* Spotify Connect */}
    <button style={styles.spotifyBtn} onClick={connectSpotify}>
      Connect Spotify 🎧
    </button>

    <div style={styles.mainGrid}>

      {/* LEFT - CAMERA */}
      <div style={styles.card}>
        <h2>Live Camera</h2>

        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={styles.webcam}
        />
      </div>

      {/* RIGHT - EMOTION + MUSIC */}
      <div style={styles.card}>

        <h2>Emotion AI</h2>

        {emotion ? (
          <h3 style={styles.emotionText}>
            {emotion.toUpperCase()}
          </h3>
        ) : (
          <p>Detecting...</p>
        )}

        {song && (
          <div style={{ marginTop: "20px" }}>
            <h3>Now Playing 🎵</h3>
            <p>{song.song} - {song.artist}</p>

            <iframe
              style={styles.player}
              src={song.url}
              title="Music"
              allow="autoplay"
            ></iframe>
          </div>
        )}

      </div>

    </div>

    {/* ANALYTICS */}
    <div style={styles.analyticsCard}>
      <h2>Emotion Analytics 📊</h2>
      <Analytics />
    </div>

  </div>
);
  
}

export default Dashboard;