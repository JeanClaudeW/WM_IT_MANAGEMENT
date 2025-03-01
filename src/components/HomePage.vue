<template>
  <div>
    <h1>Welcome to WM IT Management</h1>
    <button @click="goToTicketPage">Go to Ticket Page</button>
    <button @click="goToAssetPage">Go to Asset Page</button>
    <button @click="goToRolePage">Go to Role Page</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToTicketPage() {
      this.$router.push('/tickets');
    },
    goToAssetPage() {
      this.$router.push('/assets');
    },
    goToRolePage() {
      this.$router.push('/roles');
    }
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
}
button {
  display: block;
  margin: 10px auto;
}
</style>