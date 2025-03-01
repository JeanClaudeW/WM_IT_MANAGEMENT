<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- Top Bar -->
    <header class="bg-gray-800 shadow-2xl border-b-2 border-gray-900 p-4 flex justify-between items-center">
      <!-- Left Side: Navigation Buttons -->
      <div class="flex items-center space-x-4">
        <router-link to="/" class="btn-nav">Dashboard</router-link>
        <router-link to="/tickets" class="btn-nav">Tickets</router-link>
        <router-link to="/role-management" class="btn-nav">Roles</router-link>
      </div>

      <!-- Right Side: Optional Content (e.g., Search Bar, User Info) -->
      <div class="flex items-center space-x-4">
        <!-- Add additional content here if needed -->
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="bg-gray-800 shadow-lg rounded-lg p-8 transform transition-transform hover:scale-105 w-full max-w-2xl">
        <h1 class="text-3xl font-bold mb-4">Asset Management</h1>

        <!-- Create/Edit Asset Form -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Asset' : 'Create New Asset' }}</h2>
          <div class="grid grid-cols-1 gap-4">
            <input
              v-model="newAsset.serialNumber"
              type="text"
              placeholder="Serial Number"
              class="p-2 border rounded bg-gray-700 text-white"
            />
            <input
              v-model="newAsset.name"
              type="text"
              placeholder="Name"
              class="p-2 border rounded bg-gray-700 text-white"
            />
            <select
              v-model="newAsset.type"
              class="p-2 border rounded bg-gray-700 text-white"
            >
              <option value="" disabled>Select Type</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Server">Server</option>
              <option value="Printer">Printer</option>
              <option value="Desktop">Desktop</option>
            </select>
            <input
              v-model="newAsset.value"
              type="number"
              placeholder="Value"
              class="p-2 border rounded bg-gray-700 text-white"
            />
            <select
              v-model="newAsset.status"
              class="p-2 border rounded bg-gray-700 text-white"
            >
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
            <select
              v-model="newAsset.assignedTo"
              class="p-2 border rounded bg-gray-700 text-white"
            >
              <option value="" disabled>Assign To</option>
              <option v-for="user in users" :key="user.id" :value="user.name">{{ user.name }}</option>
            </select>
          </div>
          <button @click="isEditing ? updateAsset() : createAsset()" class="btn mt-4">
            {{ isEditing ? 'Update Asset' : 'Create Asset' }}
          </button>
          <button v-if="isEditing" @click="cancelEdit" class="btn bg-gray-500 ml-2">Cancel</button>
        </div>

        <!-- List All Assets -->
        <div>
          <button @click="fetchAssets" class="btn mb-4">List All</button>
          <ul v-if="showList" class="space-y-4">
            <li v-for="asset in assets" :key="asset.id" class="bg-gray-700 p-4 rounded-lg shadow-sm">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-bold">{{ asset.name }}</p>
                  <p class="text-sm text-gray-300">Serial Number: {{ asset.serialNumber }}</p>
                  <p class="text-sm text-gray-300">Type: {{ asset.type }}</p>
                  <p class="text-sm text-gray-300">Value: ${{ asset.value }}</p>
                  <p class="text-sm text-gray-300">Status: {{ asset.status }}</p>
                  <p class="text-sm text-gray-300">Assigned To: {{ asset.assignedTo }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="editAsset(asset)" class="btn-edit">Edit</button>
                  <button @click="deleteAsset(asset.id)" class="btn-delete">Delete</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase'; // Import Supabase client

export default {
  name: 'AssetView',
  data() {
    return {
      showList: false,
      isEditing: false, // Track whether we're editing an asset
      newAsset: {
        serialNumber: '',
        name: '',
        type: '',
        value: '',
        status: 'Operational',
        assignedTo: '',
      },
      users: [
        { id: 1, name: 'Office 1', role: 'Admin' },
        { id: 2, name: 'Office 2', role: 'Tech' },
        { id: 3, name: 'Office 3', role: 'Tech' },
      ],
      assets: [], // Remove static assets
    };
  },
  methods: {
    async fetchAssets() {
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        this.assets = data;
        this.showList = true;
      } catch (error) {
        console.error('Error fetching assets:', error.message);
        alert('Failed to fetch assets.');
      }
    },
    async createAsset() {
      if (
        !this.newAsset.serialNumber ||
        !this.newAsset.name ||
        !this.newAsset.type ||
        !this.newAsset.value ||
        !this.newAsset.assignedTo
      ) {
        alert('Please fill all required fields.');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('assets')
          .insert([this.newAsset])
          .select();

        if (error) throw error;

        this.assets.push(data[0]); // Add the new asset to the list
        this.resetForm();
        alert('Asset created successfully!');
      } catch (error) {
        console.error('Error creating asset:', error.message);
        alert('Failed to create asset.');
      }
    },
    async updateAsset() {
      if (
        !this.newAsset.serialNumber ||
        !this.newAsset.name ||
        !this.newAsset.type ||
        !this.newAsset.value ||
        !this.newAsset.assignedTo
      ) {
        alert('Please fill all required fields.');
        return;
      }

      try {
        const { id, ...assetData } = this.newAsset; // Exclude `id` from the update

        const { error } = await supabase
          .from('assets')
          .update(assetData)
          .eq('id', id);

        if (error) throw error;

        // Update the asset in the local list
        const index = this.assets.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.assets[index] = { ...this.newAsset };
        }

        this.resetForm();
        alert('Asset updated successfully!');
      } catch (error) {
        console.error('Error updating asset:', error.message);
        alert('Failed to update asset.');
      }
    },
    editAsset(asset) {
      this.isEditing = true;
      this.newAsset = { ...asset }; // Populate form with asset data
    },
    cancelEdit() {
      this.isEditing = false;
      this.resetForm();
    },
    async deleteAsset(assetId) {
      if (confirm('Are you sure you want to delete this asset?')) {
        try {
          const { error } = await supabase
            .from('assets')
            .delete()
            .eq('id', assetId);

          if (error) throw error;

          this.assets = this.assets.filter((a) => a.id !== assetId);
          alert('Asset deleted successfully!');
        } catch (error) {
          console.error('Error deleting asset:', error.message);
          alert('Failed to delete asset.');
        }
      }
    },
    resetForm() {
      this.newAsset = {
        serialNumber: '',
        name: '',
        type: '',
        value: '',
        status: 'Operational',
        assignedTo: '',
      };
      this.isEditing = false;
    },
  },
};
</script>

<style scoped>
.btn {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200;
}

.btn-nav {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200;
}

.btn-edit {
  @apply bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition duration-200;
}

.btn-delete {
  @apply bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-200;
}
</style>