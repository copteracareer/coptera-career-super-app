export async function getOptions(
  endpoint: string,
): Promise<{ id: number; name: string }[]> {
  const API_BASE = 'https://cooperative-pewter-paw.glitch.me/api';
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
