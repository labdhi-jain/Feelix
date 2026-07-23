import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Sliders, Moon, Cpu } from "lucide-react";

function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          zIndex: 999,
          display: "flex",
          justify: "center",
          alignItems: "center",
          padding: "20px"
        }}
        onClick={onClose}
      >
        <motion.div
          className="glass-panel"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{ width: "100%", maxWidth: "500px", padding: "30px", position: "relative" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer"
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
            <Settings color="var(--accent-primary)" size={24} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Studio Settings</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Speed Setting */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px" }}>
                <Cpu size={16} color="var(--accent-secondary)" />
                AI Detection Speed
              </label>
              <select className="input-glass">
                <option value="1500">Fast (1.5 seconds)</option>
                <option value="3500" selected>Balanced (3.5 seconds)</option>
                <option value="5000">Battery Saver (5.0 seconds)</option>
              </select>
            </div>

            {/* Ambient Lighting */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px" }}>
                <Moon size={16} color="#ffb703" />
                Mood Ambient Lighting Intensity
              </label>
              <select className="input-glass">
                <option value="high" selected>High Vibe (Vibrant)</option>
                <option value="medium">Medium</option>
                <option value="off">Off (Pure Dark)</option>
              </select>
            </div>

            {/* AI Model Backend */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px" }}>
                <Sliders size={16} color="#00f5d4" />
                Detector Backend
              </label>
              <select className="input-glass" disabled>
                <option value="opencv">OpenCV (Haar Cascade)</option>
              </select>
            </div>

            <button className="btn-primary" onClick={onClose} style={{ marginTop: "10px" }}>
              Save & Close Settings
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SettingsModal;
