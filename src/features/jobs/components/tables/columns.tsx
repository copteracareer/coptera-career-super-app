'use client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import type { JobVacancy } from '@/types/job-vacancy';

export const columns: ColumnDef<JobVacancy>[] = [
  {
    id: 'companyLogo',
    header: 'Logo',
    cell: ({ row }) => {
      const baseUrl = 'https://api.career.coptera.id';
      const relativePath = row.original.company?.image;
      const imageUrl = relativePath ? `${baseUrl}/${relativePath}` : null;
      const companyName = row.original.company?.name || '';

      return (
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={companyName}
              fill
              className="object-cover object-center"
            />
          ) : (
            <span className="text-lg font-bold text-gray-600">
              {companyName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Job Title',
  },
  {
    accessorKey: 'work_type',
    header: 'Work Type',
    cell: ({ row }) => {
      const jobType = row.original.jobType;
      return jobType && typeof jobType === 'object' && 'name' in jobType ? jobType.name : '-';
    },
  },
  // {
  //   accessorKey: 'due_date',
  //   header: 'Due Date',
  //   cell: ({ getValue }) => {
  //     const value = getValue<string | null>();
  //     return value ? new Date(value).toLocaleDateString() : '-';
  //   },
  // },
  {
    id: 'companyName',
    header: 'Company',
    cell: ({ row }) => row.original.company?.name || '-',
  },
  {
    accessorKey: 'city',
    header: 'City',
    cell: ({ row }) => row.original.city?.name || '-',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ getValue }) => {
      const rawDescription = getValue<string>();
      // Menghapus tag HTML dan memotong teks jika terlalu panjang
      const stripped = rawDescription.replace(/<[^>]+>/g, '');
      return stripped.length > 100 ? stripped.slice(0, 100) + '...' : stripped;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
