// src/WeatherChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function WeatherChart({ forecast = [] }) {
  if (!forecast || forecast.length === 0) return null;

  const labels = forecast.map((d) =>
    new Date(d.date * 1000).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
  );
  const temps = forecast.map((d) => d.temp);

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temps,
        fill: true,
        tension: 0.3,
        backgroundColor: "rgba(59,130,246,0.12)",
        borderColor: "rgba(59,130,246,1)",
        pointBackgroundColor: "rgba(59,130,246,1)",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "5-Day Temperature" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        ticks: { callback: (v) => `${v}°` },
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ height: 260, width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
}
