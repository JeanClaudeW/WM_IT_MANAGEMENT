// src/store/index.js
import { createStore } from 'vuex';
import { supabase } from '@/supabase'; // Import Supabase client

export default createStore({
  state: {
    user: null, // Store the authenticated user
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async fetchUser({ commit }) {
      const { data: { user } } = await supabase.auth.getUser();
      commit('setUser', user);
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
  },
});