import { getCompanyById } from '@/api/company-api';
import { notFound } from 'next/navigation';
import CompanyForm from './company-form';
import type { Company } from '@/types/company';
import type { CompanyFormValues } from './company-form';

type TCompanyViewPageProps = {
  companyId: string;
};

function mapCompanyToFormValues(company: Company): CompanyFormValues {
  return {
    id: company.id,
    name: company.name,
    image: company.image,
    company_type_id: company.companyType.id,
    city_id: company.city ? company.city.id : null,
    brand: company.brand,
    description: company.description,
    address: company.address,
    web: company.web,
    company_size: company.company_size,
  };
}

export default async function CompanyViewPage({
  companyId,
}: TCompanyViewPageProps) {
  let initialData: CompanyFormValues | null = null;
  let pageTitle = 'Create New Company';

  console.log('COMPANY ID', companyId);
  if (companyId !== 'new') {
    try {
      const company: Company = await getCompanyById(Number(companyId));
      if (!company) {
        notFound();
      }
      initialData = mapCompanyToFormValues(company);
      pageTitle = 'Edit Company';
      console.log('initialData', initialData, pageTitle);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notFound();
    }
  }

  return <CompanyForm initialData={initialData} pageTitle={pageTitle} />;
}
