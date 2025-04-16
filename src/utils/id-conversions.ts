
/**
 * Helper utility for handling ID conversions in services
 * 
 * Many of our API endpoints expect numeric IDs but our app uses string IDs,
 * this utility provides functions to handle the conversion safely.
 */

/**
 * Converts a string ID to a number for database operations
 * @param id String ID to convert
 * @returns Numeric ID
 */
export const stringIdToNumber = (id: string): number => {
  return parseInt(id, 10);
};

/**
 * Converts a numeric ID to a string for frontend usage
 * @param id Numeric ID to convert
 * @returns String ID
 */
export const numberIdToString = (id: number): string => {
  return id.toString();
};
