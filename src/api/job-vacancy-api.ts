import type { JobVacancyResponse, JobVacancy } from '../types/job-vacancy';

const API_URL = 'https://api.career.coptera.id/api/job-vacancy';

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

export async function createJobVacancy(
  payload: unknown,
): Promise<JobVacancyResponse> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create job vacancy');
  }
  return await res.json();
}

export async function updateJobVacancy(
  id: number,
  payload: unknown,
): Promise<JobVacancyResponse> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update job vacancy');
  }
  return await res.json();
}

export async function deleteJobVacancy(id: number): Promise<unknown> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete job vacancy');
  }
  return await res.json();
}
