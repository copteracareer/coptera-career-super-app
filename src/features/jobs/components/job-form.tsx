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
import { getJobExperiences, getJobTypes, getCompanies } from '@/api/options';
import { createJobVacancy, updateJobVacancy } from '@/api/job-vacancy-api';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import ComboBox from '@/components/ui/combobox';

// Schema validasi menggunakan zod
const jobFormSchema = z.object({
  company_id: z.coerce
    .number({ invalid_type_error: 'Company is required' })
    .min(1, 'Company is required'),
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
  facilities: z.union([z.number(), z.array(z.number())]),
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
    city_id: initialData?.city_id || 0,
    job_experience_id: initialData?.job_experience_id || 0,
    job_classification_id: initialData?.job_classification_id || 0,
    job_type_id: initialData?.job_type_id || 0,
    education_level_id: initialData?.education_level_id || 0,
    work_type: initialData?.work_type || 'hybrid',
    title: initialData?.title || '',
    due_date: initialData?.due_date || '',
    description: initialData?.description || '',
    link: initialData?.link || '',
    facilities: initialData?.facilities || 0,
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
  const { data: experiences = [] } = useQuery({
    queryKey: ['jobExperiences'],
    queryFn: getJobExperiences,
  });
  const { data: jobTypes = [] } = useQuery({
    queryKey: ['jobTypes'],
    queryFn: getJobTypes,
  });

  async function onSubmit(values: JobVacancyFormValues) {
    const facilitiesArray = Array.isArray(values.facilities)
      ? values.facilities
      : [values.facilities];

    const dataJob = {
      ...values,
      facilities: facilitiesArray,
    };

    try {
      let response;
      if (values.id) {
        response = await updateJobVacancy(values.id, dataJob);
      } else {
        response = await createJobVacancy(dataJob);
      }
      toast.success('Job saved successfully!');
      router.push('/admin/job');
    } catch (error) {
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
                name="city_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <ComboBox
                        type="cities"
                        value={field.value}
                        onChange={field.onChange}
                        multiple={true}
                      />
                    </FormControl>
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
                    <FormControl>
                      <ComboBox
                        type="facilities"
                        value={field.value}
                        onChange={field.onChange}
                        multiple={true}
                      />
                    </FormControl>
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
                    <ComboBox
                      type="classifications"
                      value={field.value}
                      onChange={field.onChange}
                    />
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
                    <ComboBox
                      type="education-levels"
                      value={field.value}
                      onChange={field.onChange}
                    />
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
