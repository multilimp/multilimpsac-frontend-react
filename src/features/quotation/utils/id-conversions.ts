
/**
 * Converts a number ID from database to string for domain models
 */
export const numberToStringId = (id: number): string => {
  return id.toString();
};

/**
 * Converts a string ID from domain models to number for database
 */
export const stringToNumberId = (id: string): number => {
  return parseInt(id, 10);
};
