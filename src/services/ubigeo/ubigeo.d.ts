export interface RegionProps {
  id: string;
  name: string;
}

export interface ProvinceProps {
  id: string;
  name: string;
  department_id: string;
}

export interface DistrictProps {
  id: string;
  name: string;
  province_id: string;
  department_id: string;
}
