import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wgtmarckggcyigdofgvi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndG1hcmNrZ2djeWlnZG9mZ3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MTI0OTYsImV4cCI6MjA5MTE4ODQ5Nn0.muCsrUmgv2BtGuSV1wZwB5HHRqDJac_gU3D2OFGTqzo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);