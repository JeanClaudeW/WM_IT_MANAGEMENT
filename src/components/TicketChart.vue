<template>
  <div class="bg-blue-1500 shadow rounded-lg p-4">
    <h2 class="text-xl font-bold mb-2">Tickets</h2>
    <div class="chart-container">
      <canvas id="ticketChart"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'TicketChart',
  props: {
    ticketData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    let ticketChart = null;
    const chartInstance = ref(null);

    // Function to transform ticket data for Chart.js
    const transformTicketData = (tickets) => {
      const counts = {
        Open: 0,
        'In-Progress': 0,
        Closed: 0,
      };

      tickets.forEach((ticket) => {
        if (ticket.status in counts) {
          counts[ticket.status]++;
        }
      });

      return {
        labels: Object.keys(counts),
        datasets: [
          {
            data: Object.values(counts),
            backgroundColor: 'rgba(30, 58, 138, 0.5)', // Same as bg-blue-900 with 50% opacity
            borderColor: '#fff', // White border
            borderWidth: 1,
          },
        ],
      };
    };

    // Function to initialize or update the chart
    const initializeOrUpdateChart = (data) => {
      const canvas = document.getElementById('ticketChart');
      if (!canvas) {
        console.error('Canvas element not found!');
        return;
      }

      const ctx = canvas.getContext('2d');

      if (chartInstance.value) {
        // Update existing chart data
        chartInstance.value.data = data;
        chartInstance.value.update();
      } else {
        // Create new chart
        chartInstance.value = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false, // Hide the legend
              },
              tooltip: {
                enabled: true,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#fff', // White font color for x-axis
                },
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
                },
                ticks: {
                  color: '#fff', // White font color for y-axis
                },
              },
            },
          },
        });
      }
    };

    // Watch for changes in ticketData prop
    watch(
      () => props.ticketData,
      (newData) => {
        const chartData = transformTicketData(newData);
        initializeOrUpdateChart(chartData);
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      if (chartInstance.value) chartInstance.value.destroy();
    });
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 200px; /* Adjust as needed */
}
</style>