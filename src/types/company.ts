// src/types/company.ts
export type Company = {
  id: number;
  name: string;
  brand: string;
  description: string;
  address: string;
  email?: string;
  image: string;
  web: string;
  company_size: string;
  is_verified: boolean;
  is_partner: boolean;
  user: {
    id: number;
    email: string;
    telephone: string;
    userLevel: { id: number; name: string };
  };
  companyType: { id: number; name: string };
  city: {
    id: number;
    name: string;
    province: { id: number; name: string };
  };
};

export type CompanyResponse = {
  status: boolean;
  message: string;
  data: {
    page: number;
    limit: number | null;
    totalRecord: number;
    totalPage: number;
    filterRecord: number;
    data: Company[];
  };
};
