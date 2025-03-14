'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { useQuery } from '@tanstack/react-query';
import {
  getJobExperiences,
  getJobClassifications,
  getJobTypes,
  getEducationLevels,
  getCompanies,
  getJobFacilities,
} from '@/api/options';
import { createJobVacancy, updateJobVacancy } from '@/api/job-vacancy-api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

// Schema validasi menggunakan zod
const jobFormSchema = z.object({
  company_id: z.coerce
    .number({ invalid_type_error: 'Company is required' })
    .min(1, 'Company is required'),
  // Hapus city_id dari form input, sehingga tidak ditampilkan
  city_id: z.coerce.number().nullable().optional(),
  job_experience_id: z.coerce
    .number({ invalid_type_error: 'Job experience is required' })
    .min(1, 'Job experience is required'),
  job_classification_id: z.coerce
    .number({ invalid_type_error: 'Job classification is required' })
    .min(1, 'Job classification is required'),
  job_type_id: z.coerce
    .number({ invalid_type_error: 'Job type is required' })
    .min(1, 'Job type is required'),
  education_level_id: z.coerce
    .number({ invalid_type_error: 'Education level is required' })
    .min(1, 'Education level is required'),
  work_type: z.enum(['hybrid', 'remote', 'onsite']),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  due_date: z.string().min(10, 'Due date is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  link: z.string().nullable().optional(),
  facilities: z
    .array(z.coerce.number())
    .min(1, 'At least one facility is required'),
  country_id: z.coerce
    .number({ invalid_type_error: 'Country is required' })
    .min(1, 'Country is required'),
  minimum: z.coerce
    .number({ invalid_type_error: 'Minimum salary is required' })
    .min(0, 'Minimum salary must be >= 0'),
  maximum: z.coerce
    .number({ invalid_type_error: 'Maximum salary is required' })
    .min(0, 'Maximum salary must be >= 0'),
  frequency: z.enum(['month', 'year']),
});

// Extend type with optional id for update
export type JobVacancyFormValues = z.infer<typeof jobFormSchema> & {
  id?: number;
};

type JobFormProps = {
  initialData: JobVacancyFormValues | null;
  pageTitle: string;
};

export default function JobForm({ initialData, pageTitle }: JobFormProps) {
  const defaultValues: JobVacancyFormValues = {
    company_id: initialData?.company_id || 0,
    city_id: null,
    job_experience_id: initialData?.job_experience_id || 0,
    job_classification_id: initialData?.job_classification_id || 0,
    job_type_id: initialData?.job_type_id || 0,
    education_level_id: initialData?.education_level_id || 0,
    work_type: initialData?.work_type || 'hybrid',
    title: initialData?.title || '',
    due_date: initialData?.due_date || '',
    description: initialData?.description || '',
    link: initialData?.link || '',
    facilities: initialData?.facilities || [],
    country_id: 1,
    minimum: initialData?.minimum || 0,
    maximum: initialData?.maximum || 0,
    frequency: initialData?.frequency || 'month',
    id: initialData?.id,
  };

  const form = useForm<JobVacancyFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  // Ambil opsi dari API menggunakan TanStack Query
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });
  const { data: jobFacilities = [] } = useQuery({
    queryKey: ['jobFacilities'],
    queryFn: getJobFacilities,
  });
  const { data: experiences = [] } = useQuery({
    queryKey: ['jobExperiences'],
    queryFn: getJobExperiences,
  });
  const { data: classifications = [] } = useQuery({
    queryKey: ['jobClassifications'],
    queryFn: getJobClassifications,
  });
  const { data: jobTypes = [] } = useQuery({
    queryKey: ['jobTypes'],
    queryFn: getJobTypes,
  });
  const { data: educationLevels = [] } = useQuery({
    queryKey: ['educationLevels'],
    queryFn: getEducationLevels,
  });

  const router = useRouter();
  async function onSubmit(values: JobVacancyFormValues) {
    try {
      let response;
      if (values.id) {
        response = await updateJobVacancy(values.id, values);
      } else {
        response = await createJobVacancy(values);
      }
      console.log('Response:', response);
      toast.success('Job saved successfully!');
      router.push('/admin/job');
    } catch (error) {
      console.error('Error submitting form', error);
      toast.error('Error submitting job. Please try again.');
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Group 1: Job Title */}
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 2: Company & Facilities */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value === 0 ? '' : String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((comp) => (
                          <SelectItem key={comp.id} value={String(comp.id)}>
                            {comp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facilities</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange([Number(value)])}
                      value={
                        field.value && field.value.length > 0
                          ? String(field.value[0])
                          : ''
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Facility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobFacilities.map((fac) => (
                          <SelectItem key={fac.id} value={String(fac.id)}>
                            {fac.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 3: Job Description */}
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 4: Experience, Classification, Job Type, Education Level */}
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="job_experience_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Experience</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value === 0 ? '' : String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experiences.map((exp) => (
                          <SelectItem key={exp.id} value={String(exp.id)}>
                            {exp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job_classification_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Classification</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value === 0 ? '' : String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Classification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classifications.map((cl) => (
                          <SelectItem key={cl.id} value={String(cl.id)}>
                            {cl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value === 0 ? '' : String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Job Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobTypes.map((jt) => (
                          <SelectItem key={jt.id} value={String(jt.id)}>
                            {jt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="education_level_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value === 0 ? '' : String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Education Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {educationLevels.map((el) => (
                          <SelectItem key={el.id} value={String(el.id)}>
                            {el.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 5: Due Date & Link */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter job link (optional)"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 6: Salary & Frequency */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex gap-4 md:col-span-2">
                <FormField
                  control={form.control}
                  name="minimum"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Salary</FormLabel>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                          Rp
                        </span>
                        <FormControl>
                          <Input
                            placeholder="Minimum"
                            {...field}
                            value={formatCurrency(field.value)}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(
                                /\D/g,
                                '',
                              );
                              field.onChange(rawValue);
                            }}
                            className="rounded-l-none"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maximum"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum Salary</FormLabel>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                          Rp
                        </span>
                        <FormControl>
                          <Input
                            placeholder="Maximum"
                            {...field}
                            value={formatCurrency(field.value)}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(
                                /\D/g,
                                '',
                              );
                              field.onChange(rawValue);
                            }}
                            className="rounded-l-none"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
