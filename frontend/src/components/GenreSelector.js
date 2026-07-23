import React from "react";
import { Music2 } from "lucide-react";

const genres = [
  { id: "pop", label: "Pop & Hits" },
  { id: "lofi", label: "Chill Lofi" },
  { id: "rock", label: "Energy Rock" },
  { id: "ambient", label: "Zen Ambient" },
  { id: "edm", label: "High EDM" }
];

function GenreSelector({ selectedGenre = "pop", onSelectGenre }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <Music2 size={18} color="var(--accent-primary)" />
        <h4 style={{ fontSize: "0.95rem", margin: 0, fontWeight: "600" }}>Music Vibe Preset</h4>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {genres.map(g => {
          const isActive = selectedGenre === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onSelectGenre && onSelectGenre(g.id)}
              style={{
                background: isActive ? "var(--gradient-main)" : "rgba(255, 255, 255, 0.05)",
                color: isActive ? "#fff" : "var(--text-secondary)",
                border: isActive ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              {g.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GenreSelector;
