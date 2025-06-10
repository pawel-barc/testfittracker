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
  Filler, // Import du plugin Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Enregistrement du plugin Filler
);

const ActivityChart = ({ activities }) => {
  const processActivityData = () => {
    const activityByDate = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.date).toLocaleDateString();
      if (!activityByDate[date]) {
        activityByDate[date] = 0;
      }
      if (activity.type === "session") {
        activityByDate[date] += 1.5;
      } else {
        activityByDate[date] += 1;
      }
    });

    const sortedDates = Object.keys(activityByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    const scores = Object.values(activityByDate);
    const average = scores.reduce((sum, val) => sum + val, 0) / scores.length;

    return sortedDates.map(date => {
      const score = activityByDate[date];
      if (score < average * 0.7) return 0;
      if (score > average * 1.3) return 2;
      return 1;
    });
  };

  const activityLevels = processActivityData();
  const labels = Object.keys(
    activities.reduce((acc, activity) => {
      const date = new Date(activity.date).toLocaleDateString();
      acc[date] = true;
      return acc;
    }, {})
  ).sort((a, b) => new Date(a) - new Date(b));

  const data = {
    labels,
    datasets: [
      {
        label: "Niveau d'activité",
        data: activityLevels,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          if (value === 2) return "green";
          if (value === 1) return "orange";
          return "red";
        },
        pointRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            if (value === 0) return "Activité: Basse";
            if (value === 1) return "Activité: Moyenne";
            return "Activité: Élevée";
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 2,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            if (value === 0) return "Basse";
            if (value === 1) return "Moyenne";
            return "Élevée";
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: "300px", marginBottom: "2rem" }}>
      <h2 style={{ color: "black", margin: "0 0 1rem 0" }}>
        Évolution de l'activité
      </h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default ActivityChart;
