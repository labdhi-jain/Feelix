import React from "react";
import { motion } from "framer-motion";
import { Sliders } from "lucide-react";

const emotionColors = {
  happy: "#ffb703",
  sad: "#3a86ff",
  angry: "#ff0054",
  neutral: "#00f5d4",
  surprise: "#9d4edd",
  fear: "#70e000",
  disgust: "#fb5607"
};

function EmotionBreakdown({ scores = {} }) {
  const sortedEmotions = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Sliders size={20} color="var(--accent-primary)" />
        <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>Emotion Breakdown</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sortedEmotions.length > 0 ? (
          sortedEmotions.map(([emotion, percentage]) => {
            const color = emotionColors[emotion.toLowerCase()] || "var(--accent-primary)";
            return (
              <div key={emotion} style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
                  <span style={{ textTransform: "capitalize", color: "var(--text-primary)", fontWeight: "500" }}>
                    {emotion}
                  </span>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
                    {percentage}%
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "4px", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: color,
                      borderRadius: "4px",
                      boxShadow: `0 0 8px ${color}`
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>Waiting for face analysis...</p>
        )}
      </div>
    </div>
  );
}

export default EmotionBreakdown;
