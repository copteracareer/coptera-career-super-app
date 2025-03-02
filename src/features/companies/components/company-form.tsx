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
import RichTextEditor from '@/components/ui/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileUploader } from '@/components/file-uploader';
import { createCompany, updateCompany } from '@/api/company-api';
import { useQuery } from '@tanstack/react-query';
import { getCompanyTypes } from '@/api/options';

// Schema validasi untuk company
const companyFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  telephone: z.string().min(5, 'Telephone is required'),
  image: z.any(), // gunakan file uploader atau biarkan kosong untuk update
  company_type_id: z.coerce
    .number({ invalid_type_error: 'Company type is required' })
    .min(1, 'Company type is required'),
  city_id: z.coerce.number().nullable().optional(),
  brand: z.string().min(1, 'Brand is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  web: z.string().url('Invalid website URL'),
  company_size: z.string().min(1, 'Company size is required'),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema> & {
  id?: number;
};

type CompanyFormProps = {
  initialData: CompanyFormValues | null;
  pageTitle: string;
};

export default function CompanyForm({
  initialData,
  pageTitle,
}: CompanyFormProps) {
  const defaultValues: CompanyFormValues = {
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    telephone: initialData?.telephone || '',
    image: initialData?.image || null,
    company_type_id: initialData?.company_type_id || 0,
    city_id: 1,
    brand: initialData?.brand || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    web: initialData?.web || '',
    company_size: initialData?.company_size || '',
    id: initialData?.id,
  };

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  });

  // Ambil opsi Company Types dari API
  const { data: companyTypes = [] } = useQuery({
    queryKey: ['companyTypes'],
    queryFn: getCompanyTypes,
  });

  const router = useRouter();

  async function onSubmit(values: CompanyFormValues) {
    try {
      // Pastikan city_id selalu null
      values.city_id = null;

      // Siapkan FormData untuk mendukung upload file
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('telephone', values.telephone);
      if (values.image.length > 0) {
        formData.append('image', values.image[0]);
      }
      formData.append('company_type_id', String(values.company_type_id));
      formData.append('brand', values.brand);
      formData.append('description', values.description);
      formData.append('address', values.address);
      formData.append('web', values.web);
      formData.append('company_size', values.company_size);
      formData.append('city_id', `${1}`);

      let response;
      if (values.id) {
        response = await updateCompany(values.id, formData);
      } else {
        response = await createCompany(formData);
      }
      console.log('Response:', response);
      toast.success('Company saved successfully!');
      router.push('/admin/company');
    } catch (error) {
      console.error('Error submitting form', error);
      toast.error('Error submitting company. Please try again.');
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
            {/* Group 1: Company Name */}
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 2: Email, Password, Telephone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter telephone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 3: Company Type */}
            <div>
              <FormField
                control={form.control}
                name="company_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={String(field.value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Company Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyTypes.map((ct) => (
                            <SelectItem key={ct.id} value={String(ct.id)}>
                              {ct.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 4: Brand & Company Size */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 5: Description */}
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
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

            {/* Group 6: Address & Web */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="web"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter website URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group 7: Image Upload */}
            <div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="space-y-6">
                    <FormItem className="w-full">
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          maxFiles={4}
                          maxSize={4 * 1024 * 1024}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
