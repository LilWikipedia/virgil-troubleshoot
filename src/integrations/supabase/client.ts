// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mvwvdkwqqdklvkorqrwm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3Zka3dxcWRrbHZrb3JxcndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjY2NjMsImV4cCI6MjA0ODc0MjY2M30.BGAfaGlr2MVGxSfogtCs64cWTWCpua7V4opJgmYXaJs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);