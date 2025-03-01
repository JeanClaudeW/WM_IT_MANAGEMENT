<template>
  <div>
    <h1>Asset Page</h1>
    <button @click="goHome">Return to Home</button>
    <ul>
      <li v-for="asset in assets" :key="asset.id">{{ asset.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assets: [
        { id: 1, name: 'Asset 1' },
        { id: 2, name: 'Asset 2' },
        { id: 3, name: 'Asset 3' }
      ]
    };
  },
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* Add any specific styles for the AssetPage here */
</style>