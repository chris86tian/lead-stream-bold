import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactsService } from "@/services/contactsService";
import { Lead } from "@/types/crm";
import { useToast } from "@/hooks/use-toast";

export const useContacts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const contactsQuery = useQuery({
    queryKey: ['contacts'],
    queryFn: contactsService.getContacts,
  });

  const createContactMutation = useMutation({
    mutationFn: contactsService.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: "Kontakt erstellt",
        description: "Der neue Kontakt wurde erfolgreich erstellt.",
      });
    },
    onError: (error) => {
      console.error('Error creating contact:', error);
      toast({
        title: "Fehler",
        description: "Kontakt konnte nicht erstellt werden.",
        variant: "destructive",
      });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Lead> }) =>
      contactsService.updateContact(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: "Kontakt aktualisiert",
        description: "Der Kontakt wurde erfolgreich aktualisiert.",
      });
    },
    onError: (error) => {
      console.error('Error updating contact:', error);
      toast({
        title: "Fehler",
        description: "Kontakt konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: contactsService.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: "Kontakt gelöscht",
        description: "Der Kontakt wurde erfolgreich gelöscht.",
      });
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast({
        title: "Fehler",
        description: "Kontakt konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    },
  });

  return {
    contacts: contactsQuery.data || [],
    isLoading: contactsQuery.isLoading,
    error: contactsQuery.error,
    createContact: createContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    isCreating: createContactMutation.isPending,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
  };
};
