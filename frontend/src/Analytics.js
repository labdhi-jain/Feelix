import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function Analytics() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/analytics")
      .then(res => {
        const emotions = res.data.data.map(e => e[0]);

        const counts = {};
        emotions.forEach(e => {
          counts[e] = (counts[e] || 0) + 1;
        });

        setChartData({
          labels: Object.keys(counts),
          datasets: [{
            label: "Emotion Frequency",
            data: Object.values(counts)
          }]
        });
      });
  }, []);

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      <h2>Emotion Analytics</h2>
      {chartData.labels && <Bar data={chartData} />}
    </div>
  );
}

export default Analytics;