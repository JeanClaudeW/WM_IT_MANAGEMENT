<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <!-- Logo -->
    <div class="mb-8">
      <img src="../assets/wm_logo.ico" alt="WM Logo" class="w-16 h-16" />
    </div>

    <!-- Big Title -->
    <h1 class="text-5xl font-bold mb-8">WT IT MANAGEMENT</h1>

    <!-- Sign In Form -->
    <div class="bg-gray-800 shadow-lg rounded-lg p-8 transform transition-transform hover:scale-105 w-full max-w-md">
      <h2 class="text-3xl font-bold mb-4 text-center">Sign In</h2>
      <div class="grid grid-cols-1 gap-4">
        <input
          v-model="credentials.email"
          placeholder="Email"
          class="p-2 border rounded bg-gray-700 text-white"
        />
        <input
          v-model="credentials.password"
          type="password"
          placeholder="Password"
          class="p-2 border rounded bg-gray-700 text-white"
        />
        <button @click="signIn" class="btn">Sign In</button>
      </div>

      <!-- Sign Up Button -->
      <div class="mt-6 text-center">
        <p class="text-gray-400">Don't have an account?</p>
        <button @click="goToSignUp" class="btn-secondary">Sign Up</button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'; // Ensure this import is correct

export default {
  name: 'SignInView',
  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async signIn() {
      if (!this.credentials.email || !this.credentials.password) {
        alert('Please fill all required fields.');
        return;
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.credentials.email,
          password: this.credentials.password,
        });

        if (error) {
          console.error('Sign-in error:', error);
          alert('Sign-in failed: ' + error.message);
          return;
        }

        // Commit the user to the Vuex store
        this.$store.commit('setUser', data.user);

        console.log('Sign-in successful:', data);
        this.$router.push('/');
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    },

    // Redirect to the signup page
    goToSignUp() {
      this.$router.push('/signup'); // Ensure this matches the route in index.js
    },
  },
};
</script>

<style scoped>
.btn {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 w-full;
}

.btn-secondary {
  @apply bg-transparent text-blue-500 font-bold py-2 px-4 rounded hover:bg-blue-500 hover:text-white transition duration-200 w-full border border-blue-500;
}
</style>