import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import CompanyViewPage from '@/features/companies/components/company-view-page';

export const metadata = {
  title: 'Dashboard : Company View',
};

type PageProps = { params: Promise<{ companyId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <CompanyViewPage companyId={params.companyId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
