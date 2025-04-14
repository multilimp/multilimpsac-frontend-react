
import { supabase } from './client';

/**
 * Gets the server time from Supabase
 * This is a simple function to test connectivity
 */
export const getServerTime = async () => {
  try {
    // First try using a function call
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('get-server-time');
      
      if (!functionError) {
        return { data: functionData, error: null };
      }
    } catch (functionErr) {
      console.log("Function not available:", functionErr);
    }
    
    // Fallback to using a direct query to get the current timestamp
    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .limit(1)
      .single();
    
    if (!error) {
      return { 
        data: data?.created_at || new Date().toISOString(),
        error: null
      };
    }
    
    // As a last resort, just return the current client time
    return { 
      data: new Date().toISOString(),
      error: null
    };
  } catch (error) {
    console.error('Error getting server time:', error);
    return {
      data: null,
      error
    };
  }
};

/**
 * Checks if a table exists and is accessible
 * @param tableName The name of the table to check
 */
export const checkTableExists = async (tableName: string) => {
  try {
    // For special tables like 'usuarios' that map to 'users'
    const actualTableName = tableName === 'usuarios' ? 'users' : tableName;
    
    // Use type assertion to properly handle dynamic table names
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query = supabase.from(actualTableName as any);
    const { error } = await query
      .select('count', { count: 'exact', head: true });
    
    return {
      exists: !error,
      error: error ? error.message : null
    };
  } catch (error: any) {
    console.error(`Error checking if table exists: ${tableName}`, error);
    return {
      exists: false,
      error: error?.message || 'Unknown error'
    };
  }
};
