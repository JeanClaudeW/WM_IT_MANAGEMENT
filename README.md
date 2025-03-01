# WM_IT_Management

![WM_IT Logo](./src/assets/wm_logo.ico)

WMLIT Management is a web application designed to manage assets, roles, and tickets within an organization. It provides a user-friendly interface for administrators and users to interact with the system efficiently.

## Features

- **Asset Management**: Track and manage organizational assets.
- **Role Management**: Assign and manage user roles and permissions.
- **Ticket Management**: Create, update, and resolve support tickets.
- **User Authentication**: Secure sign-in and sign-up functionality.
- **Responsive Design**: Built with modern frameworks for a seamless experience.

## Technologies Used

- **Frontend**: Vue.js, Tailwind CSS
- **Backend**: Supabase (for authentication and database)
- **Build Tool**: Vite
- **Package Manager**: npm / pnpm

## Project Structure

WM_IT_MANAGEMENT/
├── assets/ # Static assets (images, icons, etc.)
├── index.html # Main HTML file
├── node_modules/ # Node.js dependencies
├── src/ # Source code
│ ├── assets/ # Frontend assets (CSS, icons)
│ ├── components/ # Vue components
│ ├── router/ # Vue Router configuration
│ ├── store/ # Vuex store for state management
│ ├── utils/ # Utility functions
│ ├── views/ # Vue views/pages
│ ├── App.vue # Main Vue component
│ ├── main.js # Entry point for the Vue app
│ ├── supabase.js # Supabase configuration
├── package.json # Project dependencies and scripts
├── package-lock.json # Lock file for npm
├── pnpm-lock.yaml # Lock file for pnpm
├── postcss.config.js # PostCSS configuration
├── README.md # Project documentation (you are here)
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js # Vite configuration


## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JeanClaudeW/WM_IT_Management.git
   cd WM_IT_Management

   ```
2. **Install dependencies**
   ```
   npm install or pnpm install
   ```
3. **Set up environment variables**
   ```
   Modify the supabase.js file and enter your Supabase credentials:
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```
4. **Run the development server**
   ```
   npm run dev or pnpm dev
   ```

Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

    Fork the repository.

    Create a new branch (git checkout -b feature/YourFeatureName).

    Commit your changes (git commit -m 'Add some feature').

    Push to the branch (git push origin feature/YourFeatureName).

    Open a pull request.

Acknowledgments

    Vue.js for the frontend framework.

    Tailwind CSS for styling.

    Supabase for backend services.

## License
This project is licensed under the MIT License.