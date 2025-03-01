<template>
  <div class="bg-blue-1500 shadow rounded-lg p-4">
    <h2 class="text-xl font-bold mb-2">Roles</h2>
    <div class="chart-container">
      <canvas id="roleChart"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'RoleChart',
  props: {
    roleData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    let roleChart = null;
    const chartInstance = ref(null);

    // Function to initialize or update the chart
    const initializeOrUpdateChart = (data) => {
      const canvas = document.getElementById('roleChart');
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
          type: 'pie', // Use a pie chart for roles
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true, // Show the legend
                position: 'bottom',
              },
              tooltip: {
                enabled: true,
              },
            },
          },
        });
      }
    };

    // Watch for changes in roleData prop
    watch(
      () => props.roleData,
      (newData) => {
        initializeOrUpdateChart(newData);
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