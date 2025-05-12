import * as optionApi from './options';

export const apiConfig = {
  facilities: {
    getAll: optionApi.getJobFacilities,
    create: optionApi.createJobFacilities,
  },
  classifications: {
    getAll: optionApi.getJobClassifications,
    create: optionApi.createJobClassifications,
  },
  'education-levels': {
    getAll: optionApi.getEducationLevels,
    create: optionApi.createEducationLevels,
  },
  'company-type': {
    getAll: optionApi.getCompanyTypes,
    create: optionApi.createCompanyTypes,
  },
  'cities': {
    getAll: optionApi.getCity,
    create: optionApi.createCompanyTypes,
  },
};
