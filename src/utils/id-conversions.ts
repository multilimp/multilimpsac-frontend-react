
export function toUUID(id: number | string): string {
  if (typeof id === 'string' && id.includes('-')) {
    return id; // Already a UUID
  }
  
  // Simple conversion for demo purposes - in production use a proper UUID generator
  const idStr = id.toString().padStart(8, '0');
  return `00000000-0000-0000-0000-${idStr}`;
}

export function fromUUID(uuid: string): number {
  if (!uuid.includes('-')) {
    return parseInt(uuid, 10);
  }
  
  const lastPart = uuid.split('-').pop() || '0';
  return parseInt(lastPart, 10);
}
