import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import JobTableAction from '@/features/jobs/components/tables/job-table-action';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import JobListingPage from '@/features/jobs/components/job-listing';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminJobPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Jobs" description="Manage your jobs here" />
          <Link
            href="/dashboard/product/new"
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <JobTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <JobListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default AdminJobPage;
