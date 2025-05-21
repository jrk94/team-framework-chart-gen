import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  RadarController
} from 'chart.js';

// Register all required components
Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  RadarController
);

// Get the canvas context
const ctx = document.getElementById('radarChart') as HTMLCanvasElement;

// Store the labels (though not strictly needed for this fix, good for clarity)
const labels = ['Performance', 'Potential', 'Impact', 'Cohesion'];

let chart: Chart<'radar'>; // Declare chart variable to be accessible later

// Create the radar chart
// We'll put this inside a function or event listener if needed,
// or ensure it's rendered before export.
chart = new Chart(ctx, {
  type: 'radar',
  data: {
    labels: labels,
    datasets: [{
      data: [15, 60, 70, 40],
      backgroundColor: 'rgba(31, 119, 180, 0.4)',
      borderColor: 'rgba(31, 119, 180, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(5, 6, 7)'
    }]
  },
  options: {
    responsive: false,
    animation: { // Crucial: Add an animation `onComplete` callback
      onComplete: () => {
        // You can put export logic here if you want it to trigger automatically
        // after the *initial* render/animation is done.
        // For a button click, we'll rely on the button's event listener later.
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#555'
        },
        pointLabels: {
          display: true,
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#222'
        },
        grid: {
          color: '#ccc'
        },
        angleLines: {
          color: '#ddd'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      },
      // Adding a background color plugin for export clarity
      customCanvasBackgroundColor: {
        color: 'white',
      }
    } as any
  },
  plugins: [{ // Register the custom background plugin
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#FFFFFF'; // Default to white
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  }]
});


// Handle the export functionality
const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
exportBtn.addEventListener('click', () => {
  // Use Chart.js's built-in export method directly on the chart instance
  // This will capture everything Chart.js has drawn to its canvas.
  try {
    const dataUrl = chart.toBase64Image('image/png', 1); // 1 = 100% quality
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'radar-chart.png';
    link.click();
  } catch (error) {
    console.error('Error exporting chart:', error);
    // This error often happens if the chart isn't fully rendered yet.
    // Ensure the chart is visible and rendered before clicking export.
  }
});