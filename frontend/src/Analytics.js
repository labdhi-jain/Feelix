import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

function Analytics() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:5000/analytics")
        .then(res => {
          // Flatten data if it's coming as arrays (e.g. SQLite fetchall)
          // Based on original code: res.data.data.map(e => e[0])
          let emotions = [];
          if (res.data && res.data.data) {
             emotions = res.data.data.map(e => e[0]);
          } else if (res.data) {
             emotions = res.data; 
          }

          const counts = {};
          emotions.forEach(e => {
            if(e) counts[e] = (counts[e] || 0) + 1;
          });

          setChartData({
            labels: Object.keys(counts),
            datasets: [{
              label: "Emotion Frequency",
              data: Object.values(counts),
              backgroundColor: "rgba(121, 40, 202, 0.8)",
              hoverBackgroundColor: "rgba(255, 0, 128, 0.8)",
              borderRadius: 8,
              borderSkipped: false,
            }]
          });
        }).catch(err => console.log("Analytics fetch error", err));
    };

    fetchData(); // initial load
    const interval = setInterval(fetchData, 5000); // every 5 sec
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#a1a1aa", font: { family: "Inter", size: 12 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#a1a1aa", font: { family: "Inter", size: 12 } }
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(10, 10, 11, 0.9)",
        titleFont: { family: "Inter", size: 14 },
        bodyFont: { family: "Inter", size: 14 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    }
  };

  return (
    <motion.div 
      className="glass-panel" 
      style={{ padding: "30px", width: "100%", maxWidth: "800px", margin: "0 auto", marginTop: "30px" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <BarChart3 color="var(--accent-secondary)" size={28} />
        <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Emotion Trends</h2>
      </div>
      
      <div style={{ height: "300px", width: "100%" }}>
        {chartData.labels && chartData.labels.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p style={{ color: "var(--text-secondary)", textAlign: "center", marginTop: "100px" }}>No data yet. Start detecting!</p>
        )}
      </div>
    </motion.div>
  );
}

export default Analytics;