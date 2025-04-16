
import React, { useEffect, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { QuotationFormValues } from "../../models/quotationForm.model";
import { Client, ClientContact, clientService } from "../../services/clientService";

interface QuotationClientSectionProps {
  form: UseFormReturn<QuotationFormValues>;
}

const QuotationClientSection: React.FC<QuotationClientSectionProps> = ({ form }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [contacts, setContacts] = useState<ClientContact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const selectedClientId = form.watch("clientId");

  // Load clients
  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
      setLoading(false);
    };
    
    loadClients();
  }, []);

  // Load contacts when client changes
  useEffect(() => {
    if (!selectedClientId) {
      setContacts([]);
      return;
    }
    
    const loadContacts = async () => {
      setLoading(true);
      const data = await clientService.getClientContacts(selectedClientId);
      setContacts(data);
      setLoading(false);
    };
    
    loadContacts();
  }, [selectedClientId]);

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
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.razonSocial} - {client.ruc}
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
          name="contactId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contacto</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""} 
                disabled={!selectedClientId || loading}
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
    </div>
  );
};

export default QuotationClientSection;
