import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { QuotationFormValues } from "../../models/quotationForm.model";
import { Cliente } from "@/features/client/models/client.model";
import { ClientSelectionModal } from "./ClientSelectionModal";

interface QuotationClientSectionProps {
  form: UseFormReturn<QuotationFormValues>;
  clients: Cliente[];
}

const QuotationClientSection: React.FC<QuotationClientSectionProps> = ({ form, clients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedClient = clients.find(c => c.id === form.watch("clientId"));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Información del Cliente</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    value={selectedClient ? `${selectedClient.razonSocial} - ${selectedClient.ruc}` : ''}
                    readOnly
                    placeholder="Seleccionar cliente"
                    className="bg-muted"
                  />
                </FormControl>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contacto</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""} 
                disabled={!selectedClient || loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contacto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.nombre} - {contact.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Vencimiento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <ClientSelectionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={(client) => {
          form.setValue("clientId", client.id);
          form.setValue("contactId", ""); // Reset contact when client changes
        }}
        clients={clients}
      />
    </div>
  );
};

export default QuotationClientSection;
