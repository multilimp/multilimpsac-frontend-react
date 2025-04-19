
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
