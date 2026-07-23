import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Trash2, Download, Sparkles } from "lucide-react";

function SnapshotGallery({ snapshots = [], onDeleteSnapshot }) {
  const downloadSnapshot = (imgSrc, filename = "feelix-mood-memory.jpg") => {
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = filename;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: "100%", maxWidth: "1250px" }}
    >
      <div style={{ marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.8rem", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <Camera color="var(--accent-secondary)" />
            Mood Snapshot Gallery
          </h2>
          <p style={{ color: "var(--text-secondary)", margin: "4px 0 0 0", fontSize: "0.95rem" }}>
            Captured memory cards tagged with detected facial emotion & audio tracks
          </p>
        </div>
        <span style={{ background: "rgba(255,255,255,0.06)", padding: "6px 14px", borderRadius: "12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          {snapshots.length} Memories Saved
        </span>
      </div>

      {snapshots.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          <AnimatePresence>
            {snapshots.map((item) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass-panel-interactive"
                style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                {/* Image Container with Overlay */}
                <div style={{ position: "relative", width: "100%", height: "200px", background: "#000" }}>
                  <img src={item.image} alt="Mood Snapshot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: "600" }}>
                    <Sparkles size={12} color="var(--accent-secondary)" />
                    <span style={{ textTransform: "capitalize" }}>{item.emotion}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "2px 8px", borderRadius: "8px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {item.time}
                  </div>
                </div>

                {/* Info & Actions */}
                <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                      {item.song ? item.song.song : "Track Audio"}
                    </p>
                    <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {item.song ? item.song.artist : "Feelix AI"}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => downloadSnapshot(item.image, `feelix-snapshot-${item.emotion}.jpg`)}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "6px", borderRadius: "8px", cursor: "pointer" }}
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteSnapshot && onDeleteSnapshot(item.id)}
                      style={{ background: "rgba(255,0,84,0.15)", border: "1px solid rgba(255,0,84,0.3)", color: "#ff0054", padding: "6px", borderRadius: "8px", cursor: "pointer" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "60px 20px", textAlign: "center" }}>
          <Camera size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: "15px" }} />
          <h3 style={{ margin: 0, fontSize: "1.3rem" }}>No Mood Snapshots Yet</h3>
          <p style={{ color: "var(--text-secondary)", margin: "8px 0 0 0", fontSize: "0.95rem" }}>
            Click the "Capture Snapshot" button on the Studio live feed to save memory cards!
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default SnapshotGallery;
