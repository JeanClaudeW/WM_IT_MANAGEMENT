<template>
  <div>
    <h1>Ticket Page</h1>
    <button @click="goHome">Return to Home</button>
    <ul>
      <li v-for="ticket in tickets" :key="ticket.id">{{ ticket.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tickets: [
        { id: 1, title: 'Ticket 1' },
        { id: 2, title: 'Ticket 2' },
        { id: 3, title: 'Ticket 3' }
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
/* Add any specific styles for the TicketPage here */
</style>