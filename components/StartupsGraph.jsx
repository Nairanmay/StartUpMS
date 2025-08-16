"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StartupsGraph() {
  const data = {
    labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Number of Startups (India)",
        data: [4500, 5200, 6100, 7200, 8500, 12000, 15000, 19000], // sample values
        backgroundColor: "#FF6B1A",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: "Growth of Startups in India (2016 - 2023)",
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="w-full md:w-3/4 mx-auto p-6 bg-white rounded-xl shadow-lg mt-12">
      <Bar data={data} options={options} />
    </div>
  );
}
