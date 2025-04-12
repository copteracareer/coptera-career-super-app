export async function getOptions(
  endpoint: string,
): Promise<{ id: number; name: string }[]> {
  const API_BASE = 'https://api.career.coptera.id/api';
  const res = await fetch(`${API_BASE}/${endpoint}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  const json = await res.json();
  if (!json.status) {
    throw new Error(json.message);
  }
  return json.data.data;
}

export async function createOption(
  endpoint: string,
  data: Record<string, unknown>,
) {
  const API_BASE = 'https://api.career.coptera.id/api';

  const formattedData = {
    name: typeof data.name === 'object' ? data.name.name : data.name,
  };

  console.log('Data yang dikirim:', formattedData); // Debugging

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedData),
  });

  if (!res.ok) {
    throw new Error(`Failed to create ${endpoint}`);
  }

  const json = await res.json();
  if (!json.status) {
    throw new Error(json.message);
  }

  return json.data;
}

export function getJobExperiences() {
  return getOptions('job-experience');
}

export function getJobClassifications() {
  return getOptions('job-classification');
}

export function getJobTypes() {
  return getOptions('job-type');
}

export function getEducationLevels() {
  return getOptions('education-level');
}

export function getCompanies() {
  return getOptions('company');
}

export function getJobFacilities() {
  return getOptions('job-facility');
}

export function getCompanyTypes() {
  return getOptions('company-type');
}

// CREATE
export function createJobExperiences(name: string) {
  return createOption('job-experience', { name });
}

export function createJobClassifications(name: string) {
  return createOption('job-classification', { name });
}

export function createJobTypes(name: string) {
  return createOption('job-type', { name });
}

export function createEducationLevels(name: string) {
  return createOption('education-level', { name });
}

export function createJobFacilities(name: string) {
  return createOption('job-facility', { name });
}

export function createCompanyTypes(name: string) {
  return createOption('company-type', { name });
}
