import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import './assets/tailwind.css';
import store from './store/index.js'; // Import the store

const app = createApp(App);
app.use(router);
app.use(store); // Use the store
app.mount('#app');

