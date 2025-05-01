import apiClient from '../apiClient';
import { DistrictProps, ProvinceProps, RegionProps } from './ubigeo';

export const getRegions = async (): Promise<Array<RegionProps>> => {
  const res = await apiClient.get('/ubigeo/regions');
  return res.data;
};

export const getProvinces = async (region?: string): Promise<Array<ProvinceProps>> => {
  const res = await apiClient.get('/ubigeo/provinces', { params: { region } });
  return res.data;
};

export const getDistricts = async (province?: string): Promise<Array<DistrictProps>> => {
  const res = await apiClient.get('/ubigeo/districts', { params: { province } });
  return res.data;
};
