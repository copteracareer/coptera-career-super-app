import type { CompanyResponse, Company } from '../types/company';

const API_URL = 'https://api.career.coptera.id/api/company';
const API_URL_v2 = 'https://api.career.coptera.id/api/company/v2';

export async function getCompanies(): Promise<Company[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const json: CompanyResponse = await res.json();

  if (!json.status) {
    throw new Error(json.message);
  }

  return json.data.data;
}

export async function getCompanyById(id: number): Promise<Company> {
  const companies = await getCompanies();
  const company = companies.find((company) => company.id === id);

  if (!company) {
    throw new Error(`Company dengan ID ${id} tidak ditemukan`);
  }
  return company;
}

export async function deleteCompany(id: number): Promise<unknown> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete company');
  }
  return await res.json();
}

export async function createCompany(
  payload: FormData | Record<string, unknown>,
): Promise<CompanyResponse> {
  let body: BodyInit;
  const headers: Record<string, string> = {};

  if (payload instanceof FormData) {
    body = payload;
  } else {
    console.log('test2');
    body = JSON.stringify({
      ...payload,
      telephone: '000000',
    });
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body,
  });

  if (!res.ok) {
    throw new Error('Failed to create company');
  }
  return await res.json();
}

export async function updateCompany(
  id: number,
  payload: FormData,
): Promise<unknown> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    body: payload,
  });
  if (!res.ok) {
    throw new Error('Failed to update company');
  }
  return await res.json();
}
