import type { JobVacancyResponse, JobVacancy } from '../types/job-vacancy';

const API_URL = 'https://cooperative-pewter-paw.glitch.me/api/job-vacancy';

export async function getJobVacancies(): Promise<JobVacancy[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json: JobVacancyResponse = await res.json();

  if (!json.status) {
    throw new Error(json.message);
  }

  return json.data.data;
}

export async function getJobVacancyById(id: number): Promise<JobVacancy> {
  const vacancies = await getJobVacancies();
  const vacancy = vacancies.find((job) => job.id === id);

  if (!vacancy) {
    throw new Error(`Job vacancy dengan ID ${id} tidak ditemukan`);
  }
  return vacancy;
}
