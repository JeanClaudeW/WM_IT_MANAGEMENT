<template>
  <div class="min-h-screen flex bg-gray-800 text-white">
    <!-- Sidebar -->
    <aside class="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col shadow-2xl border-r-2 border-gray-900">
      <div class="p-4 flex items-center space-x-2">
        <img src="../assets/wm_logo.ico" alt="WM Logo" class="w-8 h-8" />
        <div class="text-lg font-bold">IT Management</div>
      </div>
      <nav class="flex-1">
        <ul>
         
          <li>
            <router-link
              to="/tickets"
              class="block p-4 hover:bg-blue-700 hover:shadow-lg transform hover:translate-y-1 transition-all"
            >
              Tickets
            </router-link>
          </li>
          <li>
            <router-link
              to="/assets"
              class="block p-4 hover:bg-blue-700 hover:shadow-lg transform hover:translate-y-1 transition-all"
            >
              Assets
            </router-link>
          </li>
          <li>
            <router-link
              to="/role-management"
              class="block p-4 hover:bg-blue-700 hover:shadow-lg transform hover:translate-y-1 transition-all"
            >
              Roles
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl border-b-2 border-gray-900 p-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div class="text-lg font-bold">Dashboard</div>
          
        </div>

        <!-- Account Dropdown and Logout Button -->
        <div class="relative">
          <button
            @click="toggleDropdown"
            class="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg hover:bg-gray-600 shadow-lg transform hover:scale-105 transition-all"
          >
            <span class="material-icons">account_circle</span>
            <span>{{ userEmail }}</span>
            <span class="material-icons">arrow_drop_down</span>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-2xl border-2 border-gray-600"
          >
            <div class="p-4 border-b border-gray-600">
              <p class="text-xs text-gray-400">{{ userRole }}</p>
            </div>
            <button
              @click="logout"
              class="w-full text-center p-4 hover:bg-gray-600 rounded-b-lg transform hover:translate-x-2 transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <!-- Widgets and Recent Activity -->
      <main class="p-4 flex-1 overflow-y-auto">
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Ticket Widget -->
          <TicketChart :ticketData="ticketData" />
          <!-- Asset Widget -->
          <AssetChart :assetData="assetData" />
          <!-- Role Widget -->
          <RoleChart :roleData="roleData" />
        </div>

        <!-- Recent Activity -->
        <div class="mt-8 bg-gray-800 shadow-lg rounded-lg p-4 border-2 border-gray-700 transform hover:scale-102 transition-all">
          <h2 class="text-xl font-bold mb-2">Recent Activity</h2>
          <ul class="list-disc pl-5">
            <li v-for="activity in recentActivity" :key="activity.id">
              {{ activity.description }}
            </li>
          </ul>
        </div>
      </main>
    </div>

    <!-- Floating Action Button -->
    <button class="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:bg-blue-700 transform hover:scale-110 transition-all">
      <span class="material-icons">add</span>
    </button>
  </div>
</template>

<script>
import TicketChart from '../components/TicketChart.vue';
import AssetChart from '../components/AssetChart.vue';
import RoleChart from '../components/RoleChart.vue';
import { supabase } from '@/supabase'; // Import Supabase client

export default {
  name: 'HomeView',
  components: {
    TicketChart,
    AssetChart,
    RoleChart,
  },
  data() {
    return {
      ticketData: [], // Stores ticket data for the chart
      assetData: [], // Stores asset data for the chart
      roleData: [], // Stores role data for the chart
      recentActivity: [], // Stores recent activity data
      isDropdownOpen: false, // Controls the dropdown visibility
      userEmail: '', // Stores the current user's email
      userRole: '', // Stores the current user's role
    };
  },
  async created() {
    await this.fetchUserProfile(); // Fetch user profile
    await this.fetchTicketData(); // Fetch ticket data
    await this.fetchAssetData(); // Fetch asset data
    await this.fetchRoleData(); // Fetch role data
    await this.fetchRecentActivity(); // Fetch recent activity
  },
  methods: {
    // Fetch the current user's profile (email and role)
    async fetchUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          this.userEmail = user.email;

          // Fetch the user's role from the profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          this.userRole = profile.role;
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },

    // Toggle the dropdown menu
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    // Log out the user
    async logout() {
      try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        // Redirect to the SignIn page after logout
        this.$router.push('/signin');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    },

    // Fetch ticket data from Supabase
    async fetchTicketData() {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*');

        if (error) throw error;

        this.ticketData = data;
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      }
    },

    // Fetch asset data from Supabase
    async fetchAssetData() {
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*');

        if (error) throw error;

        this.assetData = data;
      } catch (error) {
        console.error('Error fetching asset data:', error);
      }
    },

    // Fetch role data from the profiles table
    async fetchRoleData() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role');

        if (error) throw error;

        // Count the number of users for each role
        const roleCounts = data.reduce((acc, profile) => {
          acc[profile.role] = (acc[profile.role] || 0) + 1;
          return acc;
        }, {});

        // Format data for the chart
        this.roleData = {
          labels: Object.keys(roleCounts),
          datasets: [
            {
              data: Object.values(roleCounts),
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)',
              ],
              borderColor: '#fff',
              borderWidth: 1,
            },
          ],
        };
      } catch (error) {
        console.error('Error fetching role data:', error);
      }
    },

    // Fetch recent activity from tickets, assets, and profiles
    async fetchRecentActivity() {
      try {
        // Fetch recent tickets
        const { data: tickets, error: ticketsError } = await supabase
          .from('tickets')
          .select('id, created_at, status')
          .order('created_at', { ascending: false })
          .limit(5);

        if (ticketsError) throw ticketsError;

        // Fetch recent assets
        const { data: assets, error: assetsError } = await supabase
          .from('assets')
          .select('id, created_at, name')
          .order('created_at', { ascending: false })
          .limit(5);

        if (assetsError) throw assetsError;

        // Fetch recent profile updates
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, updated_at, role')
          .order('updated_at', { ascending: false })
          .limit(5);

        if (profilesError) throw profilesError;

        // Combine all activity into one array
        const activity = [
          ...tickets.map((ticket) => ({
            id: ticket.id,
            type: 'ticket',
            description: `Ticket #${ticket.id} created with status "${ticket.status}"`,
            timestamp: ticket.created_at,
          })),
          ...assets.map((asset) => ({
            id: asset.id,
            type: 'asset',
            description: `Asset "${asset.name}" created`,
            timestamp: asset.created_at,
          })),
          ...profiles.map((profile) => ({
            id: profile.id,
            type: 'profile',
            description: `Profile updated with role "${profile.role}"`,
            timestamp: profile.updated_at,
          })),
        ];

        // Sort activity by timestamp (most recent first)
        activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Limit to 5 most recent activities
        this.recentActivity = activity.slice(0, 5);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>