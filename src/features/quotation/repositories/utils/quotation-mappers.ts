
// Map domain status to database status
export const mapDomainStatusToDb = (status: string): "Aprobado" | "Rechazado" | "Enviado" => {
  switch (status) {
    case 'approved':
      return "Aprobado";
    case 'rejected':
      return "Rechazado";
    case 'sent':
    default:
      return "Enviado";
  }
};

// Map database status to domain status
export const mapDbToDomainStatus = (dbStatus: "Aprobado" | "Rechazado" | "Enviado"): string => {
  switch (dbStatus) {
    case "Aprobado":
      return 'approved';
    case "Rechazado":
      return 'rejected';
    case "Enviado":
    default:
      return 'sent';
  }
};
