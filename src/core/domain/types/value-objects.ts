
// Value Objects for common concepts across the domain
export type Money = {
  amount: number;
  currency: string;
};

export type DateVO = {
  value: string;
  isValid(): boolean;
};

export type Status = {
  value: string;
  isValid(): boolean;
};

export type EntityId = {
  value: string;
  isValid(): boolean;
};

export const createEntityId = (value: string): EntityId => ({
  value,
  isValid: () => value.length > 0
});

export const createDateVO = (value: string): DateVO => ({
  value,
  isValid: () => !isNaN(Date.parse(value))
});

export const createStatus = (value: string): Status => ({
  value,
  isValid: () => value.length > 0
});

export const createMoney = (amount: number, currency = 'PEN'): Money => ({
  amount,
  currency
});
