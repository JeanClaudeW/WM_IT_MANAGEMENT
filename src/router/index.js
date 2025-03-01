import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TicketView from '../views/TicketView.vue';
import AssetView from '../views/AssetView.vue';
import RoleManagementView from '../views/RoleManagementView.vue';
import SignInView from '../views/SignInView.vue';
import SignUpView from '../views/SignUpView.vue';
import { supabase } from '@/supabase';

const routes = [
  { path: '/', component: HomeView },
  { path: '/tickets', component: TicketView },
  { path: '/assets', component: AssetView },
  { path: '/role-management', component: RoleManagementView },
  { path: '/signin', component: SignInView },
  { path: '/signup', component: SignUpView }, // Ensure this route exists
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  // Exclude the /signin and /signup routes from the guard
  if (to.path === '/signin' || to.path === '/signup') {
    return next(); // Allow access to the sign-in and sign-up pages
  }

  // Fetch the current session
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    console.error('❌ Error fetching session:', error?.message || 'No session found');
    return next('/signin'); // Redirect to sign-in page if session is missing
  }

  const user = session.user;

  // Fetch the user's role from the profiles table
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    const userRole = profile?.role || 'user'; // Default to 'user' if role is missing

    console.log('✅ User:', user.id, '| Role:', userRole);

    // Restrict access to /role-management for non-admin users
    if (to.path.startsWith('/role-management') && userRole !== 'admin') {
      console.log('⛔ Access denied: Admins only.');
      return next('/'); // Redirect to home page if user is not an admin
    }

    next(); // Allow access to the requested route
  } catch (error) {
    console.error('❌ Error fetching user role:', error.message);
    return next('/signin'); // Redirect to sign-in page if there's an error
  }
});

export default router;