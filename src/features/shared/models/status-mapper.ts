
export const mapStatusToBoolean = (status?: 'active' | 'inactive'): boolean => {
  return status === 'active';
};

export const mapBooleanToStatus = (value: boolean): 'active' | 'inactive' => {
  return value ? 'active' : 'inactive';
};
