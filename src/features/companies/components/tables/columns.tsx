'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import type { Company } from '@/types/company';

export const companyColumns: ColumnDef<Company>[] = [
  {
    id: 'logo',
    header: 'Logo',
    cell: ({ row }) => {
      const baseUrl = 'https://cooperative-pewter-paw.glitch.me';
      const relativePath = row.original.image;
      const imageUrl = relativePath ? `${baseUrl}/${relativePath}` : null;
      return (
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.original.name}
              fill
              className="object-cover object-center"
            />
          ) : (
            <span className="text-lg font-bold text-gray-600">
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
  },
  {
    id: 'companyType',
    header: 'Type',
    cell: ({ row }) => row.original.companyType?.name || '-',
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ getValue }) => {
      const address = getValue<string>();
      return address.length > 50 ? address.slice(0, 50) + '...' : address;
    },
  },
  {
    accessorKey: 'web',
    header: 'Website',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
