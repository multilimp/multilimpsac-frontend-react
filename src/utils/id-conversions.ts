
/**
 * Converts a string ID to a number
 * @param id String ID to convert
 * @returns The numeric ID
 */
export const stringToNumberId = (id: string): number => {
  return parseInt(id, 10);
};

/**
 * Converts a number ID to a string
 * @param id Numeric ID to convert
 * @returns The string ID
 */
export const numberToStringId = (id: number): string => {
  return id.toString();
};
