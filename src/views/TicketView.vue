<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- Top Bar -->
    <header class="bg-gray-800 shadow-2xl border-b-2 border-gray-900 p-4 flex justify-between items-center">
      <!-- Left Side: Navigation Buttons -->
      <div class="flex items-center space-x-4">
        <router-link to="/" class="btn-nav">Dashboard</router-link>
        <router-link to="/role-management" class="btn-nav">Roles</router-link>
        <router-link to="/assets" class="btn-nav">Assets</router-link>
      </div>

      <!-- Right Side: Optional Content (e.g., Search Bar, User Info) -->
      <div class="flex items-center space-x-4">
        <!-- Add additional content here if needed -->
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="bg-gray-800 shadow-lg rounded-lg p-8 transform transition-transform hover:scale-105 w-full max-w-2xl">
        <h1 class="text-3xl font-bold mb-4">Ticket Management</h1>

        <!-- Create/Edit Ticket Form -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Ticket' : 'Create New Ticket' }}</h2>
          <div class="grid grid-cols-1 gap-4">
            <select
              v-model="newTicket.category"
              class="p-2 border rounded bg-gray-700 text-white"
            >
              <option value="" disabled>Select Category</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Access">Access</option>
              <option value="Other">Other</option>
            </select>
            <select
              v-model="newTicket.subject"
              class="p-2 border rounded bg-gray-700 text-white"
            >
              <option value="" disabled>Select Subject</option>
              <option value="Printer Not Working">Printer Not Working</option>
              <option value="Internet Issue">Internet Issue</option>
              <option value="Equipment Replacement">Equipment Replacement</option>
              <option value="Password Issue">Password Issue</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              v-model="newTicket.description"
              placeholder="Description"
              class="p-2 border rounded bg-gray-700 text-white"
            ></textarea>
            <select
              v-model="newTicket.status"
              class="p-2 border rounded bg-gray-700 text-white"
            >
              <option value="Open">Open</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              v-model="newTicket.assignedTo"
              class="p-2 border rounded bg-gray-700 text-white"
            >
              <option value="" disabled>Assign To</option>
              <option v-for="user in users" :key="user.id" :value="user.name">{{ user.name }}</option>
            </select>
          </div>
          <button @click="isEditing ? updateTicket() : createTicket()" class="btn mt-4">
            {{ isEditing ? 'Update Ticket' : 'Create Ticket' }}
          </button>
          <button v-if="isEditing" @click="cancelEdit" class="btn bg-gray-500 ml-2">Cancel</button>
        </div>

        <!-- List All Tickets -->
        <div>
          <button @click="fetchTickets" class="btn mb-4">List All</button>
          <ul v-if="showList" class="space-y-4">
            <li v-for="ticket in tickets" :key="ticket.id" class="bg-gray-700 p-4 rounded-lg shadow-sm">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-bold">{{ ticket.subject }}</p>
                  <p class="text-sm text-gray-300">Category: {{ ticket.category }}</p>
                  <p class="text-sm text-gray-300">Description: {{ ticket.description }}</p>
                  <p class="text-sm text-gray-300">Status: {{ ticket.status }}</p>
                  <p class="text-sm text-gray-300">Assigned To: {{ ticket.assignedTo }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="editTicket(ticket)" class="btn-edit">Edit</button>
                  <button @click="deleteTicket(ticket.id)" class="btn-delete">Delete</button>
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
  name: 'TicketView',
  data() {
    return {
      showList: false,
      isEditing: false, // Track whether we're editing a ticket
      newTicket: {
        id: null, // Add ID for editing
        category: '',
        subject: '',
        description: '',
        status: 'Open',
        assignedTo: '',
      },
      users: [
        { id: 1, name: 'Admin', role: 'Admin' },
        { id: 2, name: 'Tech 1', role: 'Tech' },
        { id: 3, name: 'Tech 2', role: 'Tech' },
      ],
      tickets: [], // Remove static tickets
    };
  },
  methods: {
    async fetchTickets() {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        this.tickets = data;
        this.showList = true;
      } catch (error) {
        console.error('Error fetching tickets:', error.message);
        alert('Failed to fetch tickets.');
      }
    },
    async createTicket() {
      if (!this.newTicket.category || !this.newTicket.subject || !this.newTicket.description || !this.newTicket.assignedTo) {
        alert('Please fill all required fields.');
        return;
      }

      try {
        // Remove the `id` field from the newTicket object
        const { id, ...ticketData } = this.newTicket;

        const { data, error } = await supabase
          .from('tickets')
          .insert([ticketData]) // Insert the ticket without the `id`
          .select();

        if (error) throw error;

        this.tickets.push(data[0]); // Add the new ticket to the list
        this.resetForm();
        alert('Ticket created successfully!');
      } catch (error) {
        console.error('Error creating ticket:', error.message);
        alert('Failed to create ticket.');
      }
    },
    async updateTicket() {
      if (!this.newTicket.category || !this.newTicket.subject || !this.newTicket.description || !this.newTicket.assignedTo) {
        alert('Please fill all required fields.');
        return;
      }

      try {
        // Extract the `id` and other fields from `newTicket`
        const { id, ...ticketData } = this.newTicket;

        // Send the updated data (excluding `id`) to Supabase
        const { error } = await supabase
          .from('tickets')
          .update(ticketData) // Update only the non-ID fields
          .eq('id', id); // Use the `id` to find the correct ticket

        if (error) throw error;

        // Update the ticket in the local list
        const index = this.tickets.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.tickets[index] = { ...this.newTicket };
        }

        this.resetForm(); // Reset the form after updating
        alert('Ticket updated successfully!');
      } catch (error) {
        console.error('Error updating ticket:', error.message);
        alert('Failed to update ticket.');
      }
    },
    editTicket(ticket) {
      this.isEditing = true; // Switch to "edit mode"
      this.newTicket = { ...ticket }; // Populate the form with the selected ticket's data
    },
    cancelEdit() {
      this.isEditing = false;
      this.resetForm();
    },
    async deleteTicket(ticketId) {
      if (confirm('Are you sure you want to delete this ticket?')) {
        try {
          const { error } = await supabase
            .from('tickets')
            .delete()
            .eq('id', ticketId);

          if (error) throw error;

          this.tickets = this.tickets.filter((t) => t.id !== ticketId);
          alert('Ticket deleted successfully!');
        } catch (error) {
          console.error('Error deleting ticket:', error.message);
          alert('Failed to delete ticket.');
        }
      }
    },
    resetForm() {
      this.newTicket = {
        category: '',
        subject: '',
        description: '',
        status: 'Open',
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