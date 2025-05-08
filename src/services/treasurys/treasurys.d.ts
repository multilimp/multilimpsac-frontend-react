// src/services/treasurys/treasurys.d.ts
export interface TreasurysProps {
  id: number;
  saleCode: string;
  clientBusinessName: string;
  clientRuc: string;
  companyRuc: string;
  companyBusinessName: string;
  contact: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
}

export const getTreasurys = async (): Promise<Array<TreasurysProps>> => {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const res = await apiClient.get('/treasurys');
  return res.data;
};

export const postTreasury = () => {
  console.log('CREAR');
};