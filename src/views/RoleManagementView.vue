<template>
  <div class="min-h-screen flex bg-gray-900 text-white">
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="bg-gray-800 shadow-2xl border-b-2 border-gray-900 p-4 flex justify-between items-center">
        <!-- Left Side: Navigation Buttons -->
        <div class="flex items-center space-x-4">
          <router-link to="/" class="btn-nav">Dashboard</router-link>
          <router-link to="/tickets" class="btn-nav">Tickets</router-link>
          <router-link to="/assets" class="btn-nav">Assets</router-link>
        </div>

        <!-- Right Side: Search Bar -->
        <div class="flex items-center space-x-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by role..."
            class="border rounded p-2 bg-gray-700 text-white placeholder-gray-300 shadow-inner"
          />
          <button @click="searchUsers" class="btn-search">
            Search
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="p-4 flex-1 overflow-y-auto">
        <div v-if="filteredUsers.length > 0" class="overflow-x-auto">
          <table class="min-w-full bg-gray-700 rounded-lg">
            <thead>
              <tr>
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Current Role</th>
                <th class="px-4 py-2">Update Role</th>
                <th class="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="border-t border-gray-600">
                <td class="px-4 py-2 text-center">{{ user.email }}</td>
                <td class="px-4 py-2 text-center">{{ user.role }}</td>
                <td class="px-4 py-2 text-center">
                  <select v-model="user.newRole" class="p-2 border rounded bg-gray-600 text-white">
                    <option value="admin">Admin</option>
                    <option value="tech">Tech</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td class="px-4 py-2 text-center">
                  <button @click="updateRole(user)" class="btn-update">
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center text-gray-400">
          No users found. Try searching for a role (e.g., admin, tech, user).
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase';

export default {
  name: 'RoleManagementView',
  data() {
    return {
      users: [],
      searchQuery: '',
      filteredUsers: [],
      currentUserRole: null,
    };
  },
  async created() {
    await this.getCurrentUserRole();
    if (this.currentUserRole === 'admin') {
      await this.searchUsers(); // Fetch users only if the current user is an admin
    } else {
      alert("⛔ You don't have permission to access this page.");
      this.$router.push('/signin'); // Redirect to sign-in page if not admin
    }
  },
  methods: {
    async getCurrentUserRole() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('❌ Error fetching user:', error?.message || 'No user found');
        return;
      }

      // Fetch the user's role from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching user role:', profileError.message);
        return;
      }

      this.currentUserRole = profile?.role || 'user';
      console.log('✅ Current User Role:', this.currentUserRole);
    },

    async searchUsers() {
      if (this.currentUserRole !== 'admin') {
        console.warn("⛔ Access denied: Only admins can search users.");
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles') // Query the profiles table
          .select('id, email, role')
          .ilike('role', `%${this.searchQuery.trim()}%`); // Case-insensitive search

        if (error) throw error;

        this.filteredUsers = data.map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          newRole: user.role,
        }));
      } catch (error) {
        console.error('❌ Error fetching users:', error.message);
      }
    },

    async updateRole(user) {
      if (this.currentUserRole !== 'admin') {
        alert("⛔ You don't have permission to update roles.");
        return;
      }

      try {
        // Update the role in the profiles table
        const { error } = await supabase
          .from('profiles')
          .update({ role: user.newRole })
          .eq('id', user.id);

        if (error) throw error;

        alert('✅ Role updated successfully!');
        await this.searchUsers(); // Refresh the user list
      } catch (error) {
        console.error('❌ Error updating role:', error.message);
      }
    },
  },
};
</script>

<style scoped>
.btn-nav {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200;
}

.btn-search {
  @apply bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200;
}

.btn-update {
  @apply bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200;
}
</style>