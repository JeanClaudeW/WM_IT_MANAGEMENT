<template>
    <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div class="bg-gray-800 shadow-lg rounded-lg p-8 transform transition-transform hover:scale-105 w-full max-w-md">
        <!-- Big Title -->
        <h1 class="text-5xl font-bold mb-8 text-center">WT IT MANAGEMENT</h1>
  
        <!-- Sign Up Form -->
        <h2 class="text-3xl font-bold mb-4 text-center">Sign Up</h2>
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
          <input
            v-model="credentials.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="p-2 border rounded bg-gray-700 text-white"
          />
          <button @click="signUp" class="btn">Sign Up</button>
        </div>
  
        <!-- Sign In Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-400">Already have an account?</p>
          <button @click="goToSignIn" class="btn-secondary">Sign In</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase'; // Ensure this import is correct
  
  export default {
    name: 'SignUpView',
    data() {
      return {
        credentials: {
          email: '',
          password: '',
          confirmPassword: '',
        },
      };
    },
    methods: {
      async signUp() {
        // Validate inputs
        if (!this.credentials.email || !this.credentials.password || !this.credentials.confirmPassword) {
          alert('Please fill all required fields.');
          return;
        }
  
        if (this.credentials.password !== this.credentials.confirmPassword) {
          alert('Passwords do not match.');
          return;
        }
  
        try {
          // Sign up the user using Supabase
          const { data, error } = await supabase.auth.signUp({
            email: this.credentials.email,
            password: this.credentials.password,
          });
  
          if (error) {
            console.error('Sign-up error:', error);
            alert('Sign-up failed: ' + error.message);
            return;
          }
  
          console.log('Sign-up successful:', data);
          alert('Sign-up successful! Please check your email to confirm your account.');
          this.$router.push('/signin'); // Redirect to the sign-in page
        } catch (error) {
          console.error('Unexpected error:', error);
          alert('An unexpected error occurred. Please try again.');
        }
      },
  
      // Redirect to the sign-in page
      goToSignIn() {
        this.$router.push('/signin'); // Replace with your sign-in route
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