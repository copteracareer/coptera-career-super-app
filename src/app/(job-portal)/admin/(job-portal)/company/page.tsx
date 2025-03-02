import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import CompanyListingPage from '@/features/companies/components/company-listing';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminCompanyPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Companies" description="Manage your companies here" />
          <Link
            href="/admin/company/new"
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <CompanyListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default AdminCompanyPage;
