import React from "react";

function AudioVisualizer() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "24px", padding: "0 4px" }}>
      <div className="equalizer-bar" />
      <div className="equalizer-bar" />
      <div className="equalizer-bar" />
      <div className="equalizer-bar" />
      <div className="equalizer-bar" />
    </div>
  );
}

export default AudioVisualizer;
