import { DataTable as CompaniesTable } from '@/components/ui/table/data-table';
import { companyColumns as columns } from './tables/columns';
import { getCompanies } from '@/api/company-api';
import type { Company } from '@/types/company';

type CompanyListingPageProps = object;

export default async function CompanyListingPage({}: CompanyListingPageProps) {
  const companiesData: Company[] = await getCompanies();
  const totalCompanies = companiesData.length;

  return (
    <CompaniesTable
      columns={columns}
      data={companiesData}
      totalItems={totalCompanies}
    />
  );
}
