import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvagpzlvzvblpnewgtof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2YWdwemx2enZibHBuZXdndG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNjczMzgsImV4cCI6MjA1NDY0MzMzOH0.HaRzcY93RDr2dUFzERfhakarBgFpsOilQNh0xC5npU4';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };