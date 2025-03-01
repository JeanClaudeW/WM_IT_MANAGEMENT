<template>
  <div class="bg-blue-1500 shadow rounded-lg p-4">
    <h2 class="text-xl font-bold mb-2">Assets</h2>
    <div class="chart-container">
      <canvas id="assetChart"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'AssetChart',
  props: {
    assetData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    let assetChart = null;
    const chartInstance = ref(null);

    // Function to transform asset data for Chart.js
    const transformAssetData = (assets) => {
      const counts = {
        Operational: 0,
        Maintenance: 0,
        Retired: 0,
      };

      assets.forEach((asset) => {
        if (asset.status in counts) {
          counts[asset.status]++;
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
      const canvas = document.getElementById('assetChart');
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
            devicePixelRatio: 1, // Disable retina scaling
            plugins: {
              tooltip: {
                enabled: true,
              },
              legend: {
                display: false, // Disable the legend
              },
            },
            scales: {
              x: {
                grid: {
                  display: false, // Hide x-axis grid lines
                },
                ticks: {
                  color: '#fff', // Customize x-axis tick color
                },
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)', // Customize y-axis grid line color
                },
                ticks: {
                  color: '#fff', // Customize y-axis tick color
                },
              },
            },
          },
        });
      }
    };

    // Watch for changes in assetData prop
    watch(
      () => props.assetData,
      (newData) => {
        const chartData = transformAssetData(newData);
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