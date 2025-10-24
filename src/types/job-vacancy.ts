export type Company = {
  id: number;
  name: string;
  brand: string;
  description: string;
  address: string;
  image: string;
  web: string;
  company_size: string;
  is_verified: boolean;
  is_partner: boolean;
};

export type Province = {
  id: number;
  name: string;
};

export type City = {
  id: number;
  name: string;
  province: Province;
};

export type JobFacility = {
  id: number;
  name: string;
  image: string;
};

export type JobVacancyFacility = {
  id: number;
  jobFacility: JobFacility;
};

export type JobType = {
  id: number;
  name: string;
};

export type JobExperience = {
  id: number;
  name: string;
  description: string;
};

export type JobClassification = {
  id: number;
  name: string;
};

export type EducationLevel = {
  id: number;
  name: string;
};

export type JobVacancy = {
  id: number;
  work_type: string | null;
  title: string;
  due_date: string | null;
  description: string;
  is_send_email: boolean;
  link: string;
  is_closed: boolean;
  company: Company;
  city: City;
  jobVacancyFacilities: JobVacancyFacility[];
  jobVacancySalary: unknown;
  jobType: JobType;
  jobExperience: JobExperience;
  jobClassification: JobClassification;
  educationLevel: EducationLevel;
};

export type JobVacancyResponse = {
  status: boolean;
  message: string;
  data: {
    page: number;
    limit: number | null;
    totalRecord: number;
    totalPage: number;
    filterRecord: number;
    data: JobVacancy[];
  };
};
