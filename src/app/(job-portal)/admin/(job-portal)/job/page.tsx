import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';

const AdminJobPage = () => {
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
        {/* <ProductTableAction /> */}
        {/* <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ProductListingPage />
        </Suspense> */}
      </div>
    </PageContainer>
  );
};

export default AdminJobPage;
