import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Sparkles } from "lucide-react";

function SessionHistory({ history = [] }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <History size={20} color="var(--accent-secondary)" />
        <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: "600" }}>Live Session Feed</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "220px", overflowY: "auto", paddingRight: "4px" }}>
        <AnimatePresence initial={false}>
          {history.length > 0 ? (
            history.slice(0, 6).map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  justify: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  fontSize: "0.85rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={14} color="var(--accent-secondary)" />
                  <span style={{ textTransform: "capitalize", fontWeight: "600", color: "var(--text-primary)" }}>
                    {item.emotion}
                  </span>
                  {item.song && (
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                      — {item.song.song}
                    </span>
                  )}
                </div>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                  {item.time}
                </span>
              </motion.div>
            ))
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>No session logs recorded yet.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SessionHistory;
