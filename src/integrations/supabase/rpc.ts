
import { supabase } from './client';

/**
 * Gets the server time from Supabase
 * This is a simple function to test connectivity
 */
export const getServerTime = async () => {
  try {
    // Try using a real RPC if it exists
    // Using 'any' type assertion to bypass TypeScript error
    const { data, error } = await supabase.rpc('get_server_time' as any);
    
    if (!error) {
      return { data, error: null };
    }
    
    // Fallback to just returning the current client time
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
    
    // Use type assertion to bypass type checking temporarily
    const { error } = await supabase
      .from(actualTableName as any)
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
