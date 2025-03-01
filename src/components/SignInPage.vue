<template>
  <div>
    <h1>Sign In Page</h1>
    <button @click="goHome">Return to Home</button>
    <SignInView />
  </div>
</template>

<script>
import SignInView from '@/components/SignInView.vue';

export default {
  components: {
    SignInView,
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
/* Add any specific styles for the SignInPage here */
</style>