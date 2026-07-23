import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Camera, BarChart2, Disc, Settings, Headphones, Sparkles } from "lucide-react";

const navItems = [
  { id: "studio", label: "Studio", icon: LayoutDashboard },
  { id: "gallery", label: "Gallery", icon: Camera },
  { id: "insights", label: "Insights", icon: BarChart2 },
  { id: "playlists", label: "Playlists", icon: Disc }
];

function Navbar({ activeTab = "studio", onSelectTab, isConnected, onConnectSpotify, onOpenSettings }) {
  return (
    <motion.header
      className="glass-panel"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        width: "100%",
        maxWidth: "1250px",
        padding: "14px 24px",
        display: "flex",
        justify: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "15px"
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => onSelectTab("studio")}>
        <div style={{ background: "var(--gradient-main)", padding: "8px", borderRadius: "12px", display: "flex" }}>
          <Sparkles size={20} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: "1.4rem", margin: 0, lineHeight: 1 }}>
            <span className="text-gradient">Feelix</span>
          </h1>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", letterSpacing: "0.5px" }}>AI MOOD ECOSYSTEM</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.03)", padding: "4px 6px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                background: isActive ? "var(--gradient-main)" : "transparent",
                color: isActive ? "#fff" : "var(--text-secondary)",
                fontWeight: isActive ? "600" : "500",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="btn-secondary"
          onClick={onConnectSpotify}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", fontSize: "0.85rem" }}
        >
          <Headphones size={18} color={isConnected ? "#1DB954" : "currentColor"} />
          <span>{isConnected ? "Spotify Sync ✅" : "Connect Spotify"}</span>
        </button>

        <button
          onClick={onOpenSettings}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "var(--text-primary)",
            borderRadius: "10px",
            padding: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Settings size={18} />
        </button>
      </div>
    </motion.header>
  );
}

export default Navbar;
