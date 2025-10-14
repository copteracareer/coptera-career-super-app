// app/job/[jobId]/page.tsx
import { getJobVacancyById } from '@/api/job-vacancy-api';
import { notFound } from 'next/navigation';
import JobForm from './job-form';
import type { JobVacancy } from '@/types/job-vacancy';
import type { JobVacancyFormValues } from './job-form';

type TJobViewPageProps = {
  jobId: string;
};

function mapJobToFormValues(job: JobVacancy): JobVacancyFormValues {
  return {
    id: job.id,
    company_id: job.company.id,
    city_id: job.city ? job.city.id : null,
    job_experience_id: 0,
    job_classification_id: 0,
    job_type_id: 0,
    education_level_id: 0,
    work_type: job.work_type as 'hybrid' | 'remote' | 'onsite' | null,
    title: job.title,
    due_date: job.due_date || '',
    description: job.description,
    is_send_email: job.is_send_email,
    link: job.link || null,
    facilities: job.jobVacancyFacilities
      ? job.jobVacancyFacilities.map((f) => f.id)
      : 0,
    country_id: 0,
    minimum: 0,
    maximum: 0,
    frequency: 'month',
  };
}

export default async function JobViewPage({ jobId }: TJobViewPageProps) {
  let initialData: JobVacancyFormValues | null = null;
  let pageTitle = 'Create New Job Vacancy';

  if (jobId !== 'new') {
    try {
      const job: JobVacancy = await getJobVacancyById(Number(jobId));
      if (!job) {
        notFound();
      }
      initialData = mapJobToFormValues(job);
      pageTitle = 'Edit Job Vacancy';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notFound();
    }
  }

  return <JobForm initialData={initialData} pageTitle={pageTitle} />;
}
