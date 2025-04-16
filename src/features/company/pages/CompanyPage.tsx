
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { Company } from "@/features/company/models/company.model";
import { companyService } from "../services/company.service";
import CompanyDataTable from "../components/CompanyDataTable";
import CompanyDetailPanel from "../components/CompanyDetailPanel";
import CompanyForm from "../components/CompanyForm";

const CompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: companies = [], isLoading, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: companyService.fetchCompanies,
  });

  const breadcrumbItems = [
    {
      label: "Empresas",
      path: "/empresas",
      isCurrentPage: true
    }
  ];

  const handleViewCatalogs = (company: Company) => {
    navigate(`/empresas/${company.id}/catalogos`);
  };

  const handleSaveCompany = async (data: Partial<Company>): Promise<void> => {
    await companyService.saveCompany(data);
  };

  const renderDetailPanel = (company: Company) => {
    return <CompanyDetailPanel company={company} onViewCatalogs={handleViewCatalogs} />;
  };

  const renderFormContent = (data: Partial<Company>, onChange: (field: string, value: any) => void) => {
    return <CompanyForm data={data} onChange={onChange} />;
  };

  return (
    <div>
      <BreadcrumbNav items={breadcrumbItems} />
      <CompanyDataTable
        companies={companies}
        isLoading={isLoading}
        onReload={refetch}
        onSave={handleSaveCompany}
        onDelete={companyService.deleteCompany}
        renderDetailPanel={renderDetailPanel}
        renderFormContent={renderFormContent}
      />
    </div>
  );
};

export default CompanyPage;
