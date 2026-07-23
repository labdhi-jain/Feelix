import React, { useState } from "react";
import { motion } from "framer-motion";
import { Disc, Save, Check } from "lucide-react";

const defaultMappings = {
  happy: "37i9dQZF1DXdPec7aLTmlC",
  sad: "37i9dQZF1DX7qK8ma5wgG1",
  angry: "37i9dQZF1DWYxwmBaMqxsl",
  neutral: "37i9dQZF1DX4WYpdgoIcn6",
  surprise: "37i9dQZF1DX0UrEwaHN1xM",
  fear: "37i9dQZF1DWZtZ8vUCzXyF"
};

function PlaylistMapper() {
  const [mappings, setMappings] = useState(() => {
    const saved = localStorage.getItem("custom_playlist_mappings");
    return saved ? JSON.parse(saved) : defaultMappings;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (emotion, val) => {
    setMappings(prev => ({ ...prev, [emotion]: val }));
  };

  const saveMappings = (e) => {
    e.preventDefault();
    localStorage.setItem("custom_playlist_mappings", JSON.stringify(mappings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}
    >
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ fontSize: "1.8rem", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
          <Disc color="var(--accent-primary)" />
          Spotify Playlist Mapping Studio
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: "4px 0 0 0", fontSize: "0.95rem" }}>
          Customize which Spotify Playlist ID or URI triggers for each facial emotion
        </p>
      </div>

      <form onSubmit={saveMappings} className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {Object.entries(mappings).map(([emotion, playlistId]) => (
          <div key={emotion} style={{ display: "grid", gridTemplateColumns: "140px 1fr", alignItems: "center", gap: "15px" }}>
            <label style={{ textTransform: "capitalize", fontWeight: "600", color: "var(--text-primary)", fontSize: "0.95rem" }}>
              {emotion} Playlist:
            </label>
            <input
              className="input-glass"
              value={playlistId}
              onChange={(e) => handleChange(emotion, e.target.value)}
              placeholder="Spotify Playlist ID (e.g. 37i9dQZF1DXdPec7aLTmlC)"
              required
            />
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
          <button className="btn-primary" type="submit" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {savedSuccess ? <Check size={18} /> : <Save size={18} />}
            {savedSuccess ? "Mappings Saved!" : "Save Playlists"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default PlaylistMapper;
