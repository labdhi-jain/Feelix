import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

// Components
import Navbar from "../components/Navbar";
import EmotionBreakdown from "../components/EmotionBreakdown";
import SessionHistory from "../components/SessionHistory";
import AudioVisualizer from "../components/AudioVisualizer";
import GenreSelector from "../components/GenreSelector";
import SnapshotGallery from "../components/SnapshotGallery";
import PlaylistMapper from "../components/PlaylistMapper";
import SettingsModal from "../components/SettingsModal";
import Analytics from "../Analytics";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, Music, Activity, ShieldCheck, Zap } from "lucide-react";

const emotionGlows = {
  happy: "rgba(255, 180, 0, 0.45)",
  sad: "rgba(58, 134, 255, 0.45)",
  angry: "rgba(255, 0, 84, 0.45)",
  neutral: "rgba(0, 245, 212, 0.35)",
  surprise: "rgba(157, 78, 221, 0.45)",
  fear: "rgba(112, 224, 0, 0.45)",
  disgust: "rgba(251, 86, 7, 0.45)"
};

const emotionMusicPresets = {
  pop: {
    happy: { song: "Happy Hits", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC?utm_source=generator&theme=0" },
    sad: { song: "Life Sucks / Sad Vibes", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX7qK8ma5wgG1?utm_source=generator&theme=0" },
    angry: { song: "Rock Hard / Rage", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DWYxwmBaMqxsl?utm_source=generator&theme=0" },
    neutral: { song: "Chill Hits", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator&theme=0" },
    surprise: { song: "Bangers & Hits", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX0UrEwaHN1xM?utm_source=generator&theme=0" },
    fear: { song: "Deep Focus & Chill", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZtZ8vUCzXyF?utm_source=generator&theme=0" }
  },
  lofi: {
    happy: { song: "Lofi Beats", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdLENyoTwsSZ?utm_source=generator&theme=0" },
    sad: { song: "Sad Lofi", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX7gIoKjK5G8e?utm_source=generator&theme=0" },
    angry: { song: "Chill Lofi", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb90mS7e0?utm_source=generator&theme=0" },
    neutral: { song: "Lofi Sleep & Study", artist: "Spotify Editorial", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwaw0UeB1?utm_source=generator&theme=0" }
  }
};

function Dashboard() {
  const webcamRef = useRef(null);
  
  // Navigation & Settings State
  const [activeTab, setActiveTab] = useState("studio");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // App & Emotion State
  const [emotion, setEmotion] = useState("");
  const [scores, setScores] = useState({});
  const [song, setSong] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("pop");
  const [sessionHistory, setSessionHistory] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem("spotify_token"));

  // Ambient Lighting Dynamic Sync
  useEffect(() => {
    if (emotion && emotionGlows[emotion.toLowerCase()]) {
      document.documentElement.style.setProperty("--mood-glow", emotionGlows[emotion.toLowerCase()]);
    }
  }, [emotion]);

  const connectSpotify = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/spotify/login");
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Failed to retrieve Spotify login URL.");
      }
    } catch (err) {
      console.error("Spotify login error:", err);
      alert("Could not connect to Spotify backend at http://127.0.0.1:5000.");
    }
  };

  const takeSnapshot = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newSnapshot = {
      id: Date.now(),
      image: imageSrc,
      emotion: emotion || "neutral",
      song: song,
      time: time
    };

    setSnapshots(prev => [newSnapshot, ...prev]);
    alert("Mood Snapshot Captured! Check the Gallery tab.");
  };

  const deleteSnapshot = (id) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
  };

  const capture = async () => {
    try {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      const user_id = localStorage.getItem("user_id") || 1;

      const res = await axios.post("http://127.0.0.1:5000/detect", {
        image: imageSrc,
        user_id: parseInt(user_id)
      });

      const detectedEmotion = res.data.emotion;
      const emotionScores = res.data.scores || {};

      setEmotion(detectedEmotion);
      setScores(emotionScores);

      const presetGroup = emotionMusicPresets[selectedGenre] || emotionMusicPresets.pop;
      const matchedSong = presetGroup[detectedEmotion.toLowerCase()] || presetGroup.neutral || presetGroup.happy;
      setSong(matchedSong);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSessionHistory(prev => [
        { id: Date.now(), emotion: detectedEmotion, song: matchedSong, time: timestamp },
        ...prev
      ]);

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
    if (isDetecting && activeTab === "studio") {
      interval = setInterval(() => {
        capture();
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isDetecting, selectedGenre, activeTab]);

  return (
    <div style={{ width: "100%", padding: "20px 20px 60px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* Menu Bar / Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isConnected={isConnected}
        onConnectSpotify={connectSpotify}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Tab Switcher Content */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: STUDIO (Main Dashboard) */}
        {activeTab === "studio" && (
          <motion.div
            key="studio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ width: "100%", maxWidth: "1250px" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "25px", width: "100%" }}>
              
              {/* COLUMN 1: Camera Feed */}
              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Camera color="var(--accent-primary)" size={22} />
                    <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Live Vision Feed</h2>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: isDetecting ? "#00f5d4" : "#a1a1aa" }}>
                    <ShieldCheck size={14} />
                    {isDetecting ? "Active Scan" : "Paused"}
                  </div>
                </div>
                
                <div style={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden", background: "#000", flex: 1, minHeight: "280px" }}>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {isDetecting && (
                    <motion.div 
                      animate={{ y: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "3px", background: "var(--mood-glow)", boxShadow: "0 0 15px var(--mood-glow)" }}
                    />
                  )}
                </div>
                
                <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }} onClick={takeSnapshot}>
                    <Camera size={16} />
                    Capture Mood Card
                  </button>

                  <button 
                    className="btn-secondary" 
                    style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                    onClick={() => setIsDetecting(!isDetecting)}
                  >
                    {isDetecting ? "Pause Scan" : "Resume Scan"}
                  </button>
                </div>
              </div>

              {/* COLUMN 2: Emotion AI & Breakdown */}
              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Activity color="var(--accent-secondary)" size={22} />
                  <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Mood Analysis</h2>
                </div>

                <div 
                  className="glass-panel-interactive"
                  key={emotion}
                  style={{ padding: "20px", textAlign: "center", background: "rgba(255, 255, 255, 0.02)" }}
                >
                  {emotion ? (
                    <div>
                      <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)" }}>Dominant Emotion</span>
                      <h3 className="text-gradient" style={{ fontSize: "2.8rem", margin: "4px 0 0 0", textTransform: "capitalize" }}>
                        {emotion}
                      </h3>
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", margin: 0 }}>Detecting face...</p>
                  )}
                </div>

                <EmotionBreakdown scores={scores} />
              </div>

              {/* COLUMN 3: Now Playing */}
              <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Music color="#1DB954" size={22} />
                    <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Now Playing</h2>
                  </div>
                  {song && <AudioVisualizer />}
                </div>

                <GenreSelector selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />

                {song ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ marginBottom: "12px", background: "rgba(255, 255, 255, 0.03)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <p style={{ margin: 0, color: "var(--text-primary)", fontWeight: "600", fontSize: "0.95rem" }}>
                        {song.song}
                      </p>
                      <p style={{ margin: "2px 0 0 0", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        Artist: {song.artist}
                      </p>
                    </div>

                    <iframe
                      style={{ width: "100%", flex: 1, border: "none", borderRadius: "12px", minHeight: "180px", background: "rgba(0,0,0,0.5)" }}
                      src={song.url}
                      title="Spotify Web Player"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", minHeight: "180px" }}>
                    <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>Detecting mood to select music...</p>
                  </div>
                )}
              </div>

            </div>

            {/* LOWER ROW: Session History */}
            <div style={{ width: "100%", marginTop: "25px" }}>
              <div className="glass-panel" style={{ padding: "24px" }}>
                <SessionHistory history={sessionHistory} />
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SNAPSHOT GALLERY */}
        {activeTab === "gallery" && (
          <SnapshotGallery snapshots={snapshots} onDeleteSnapshot={deleteSnapshot} />
        )}

        {/* TAB 3: INSIGHTS & ANALYTICS */}
        {activeTab === "insights" && (
          <motion.div key="insights" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: "1250px" }}>
            <Analytics />
          </motion.div>
        )}

        {/* TAB 4: PLAYLIST MAPPER */}
        {activeTab === "playlists" && (
          <PlaylistMapper />
        )}

      </AnimatePresence>

    </div>
  );
}

export default Dashboard;