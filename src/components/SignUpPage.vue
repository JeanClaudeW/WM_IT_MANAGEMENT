<template>
    <div>
      <!-- You can add a navbar or other layout elements here if needed -->
      <SignUpView />
    </div>
  </template>
  
  <script>
  import SignUpView from '@/components/SignUpView.vue'; // Adjust the import path as needed
  
  export default {
    name: 'SignUpPage',
    components: {
      SignUpView,
    },
  };
  </script>
  
  <style scoped>
  /* Add any custom styles for the page here */
  </style>