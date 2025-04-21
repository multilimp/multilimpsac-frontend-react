
/**
 * Converts a string ID to a number ID for database usage
 */
export function stringIdToNumber(id: string): number {
  // Remove any non-digit characters and convert to number
  return Number(id.replace(/\D/g, ''));
}

/**
 * Converts a number ID to a string ID for frontend usage
 */
export function numberToStringId(id: number): string {
  return id.toString();
}

/**
 * Convert a string ID to a number ID
 */
export function stringToNumberId(id: string): number {
  if (!id) return 0;
  return parseInt(id.replace(/\D/g, ''), 10);
}

/**
 * Convert a number ID to a string ID
 */
export const toStringId = numberToStringId;
