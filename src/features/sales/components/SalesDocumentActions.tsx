
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SalesDocumentActionsProps {
  documentOce?: string;
  documentOcf?: string;
}

export const SalesDocumentActions: React.FC<SalesDocumentActionsProps> = ({
  documentOce,
  documentOcf,
}) => {
  const { toast } = useToast();

  const openDocument = (url: string | undefined) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Documento no disponible",
        description: "No se ha cargado el documento aún",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDocument(documentOce)}
      >
        <FileText className="h-4 w-4 mr-1" />
        OCE
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDocument(documentOcf)}
      >
        <FileText className="h-4 w-4 mr-1" />
        OCF
      </Button>
    </div>
  );
};
