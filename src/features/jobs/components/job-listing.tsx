import { DataTable as JobVacancyTable } from '@/components/ui/table/data-table';
import { columns } from './tables/columns';
import { getJobVacancies } from '@/api/job-vacancy-api';
import type { JobVacancy } from '@/types/job-vacancy';

type JobListingPage = object;

export default async function JobListingPage({}: JobListingPage) {
  const vacancies: JobVacancy[] = await getJobVacancies();
  const totalVacancies = vacancies.length;

  return (
    <JobVacancyTable
      columns={columns}
      data={vacancies}
      totalItems={totalVacancies}
    />
  );
}
