
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0';

serve(async (req) => {
  try {
    const { table_name } = await req.json();
    
    // Create a new Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    
    // Check if the table exists by trying to count rows
    const { data, error } = await supabaseClient
      .from(table_name)
      .select('count', { head: true, count: 'exact' });
    
    if (error) {
      return new Response(
        JSON.stringify({ exists: false, error: error.message }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    return new Response(
      JSON.stringify({ exists: true }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ exists: false, error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
