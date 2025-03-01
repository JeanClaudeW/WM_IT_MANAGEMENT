import { supabase } from '@/supabase';

export default async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to SignIn page if the user is not authenticated
    next('/signin');
  } else {
    // Fetch the user's role from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      next('/'); // Redirect to home if there's an error
    } else if (profile.role === 'admin') {
      next(); // Allow access for admin users
    } else {
      next('/'); // Redirect to home if the user is not an admin
    }
  }
};