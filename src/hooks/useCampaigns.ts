import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsService, Campaign, CampaignInsert, CampaignUpdate } from "@/services/campaignsService";
import { useToast } from "@/hooks/use-toast";

export const useCampaigns = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const campaignsQuery = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsService.getCampaigns,
  });

  const createCampaignMutation = useMutation({
    mutationFn: campaignsService.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Kampagne erstellt",
        description: "Die neue Kampagne wurde erfolgreich erstellt.",
      });
    },
    onError: (error) => {
      console.error('Error creating campaign:', error);
      toast({
        title: "Fehler",
        description: "Kampagne konnte nicht erstellt werden.",
        variant: "destructive",
      });
    },
  });

  const updateCampaignMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CampaignUpdate }) =>
      campaignsService.updateCampaign(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Kampagne aktualisiert",
        description: "Die Kampagne wurde erfolgreich aktualisiert.",
      });
    },
    onError: (error) => {
      console.error('Error updating campaign:', error);
      toast({
        title: "Fehler",
        description: "Kampagne konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: campaignsService.deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Kampagne gelöscht",
        description: "Die Kampagne wurde erfolgreich gelöscht.",
      });
    },
    onError: (error) => {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Fehler",
        description: "Kampagne konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    },
  });

  const duplicateCampaignMutation = useMutation({
    mutationFn: campaignsService.duplicateCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Kampagne dupliziert",
        description: "Die Kampagne wurde erfolgreich dupliziert.",
      });
    },
    onError: (error) => {
      console.error('Error duplicating campaign:', error);
      toast({
        title: "Fehler",
        description: "Kampagne konnte nicht dupliziert werden.",
        variant: "destructive",
      });
    },
  });

  return {
    campaigns: campaignsQuery.data || [],
    isLoading: campaignsQuery.isLoading,
    error: campaignsQuery.error,
    createCampaign: createCampaignMutation.mutate,
    updateCampaign: updateCampaignMutation.mutate,
    deleteCampaign: deleteCampaignMutation.mutate,
    duplicateCampaign: duplicateCampaignMutation.mutate,
    isCreating: createCampaignMutation.isPending,
    isUpdating: updateCampaignMutation.isPending,
    isDeleting: deleteCampaignMutation.isPending,
    isDuplicating: duplicateCampaignMutation.isPending,
  };
};

export const useTemplates = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const templatesQuery = useQuery({
    queryKey: ['campaign-templates'],
    queryFn: campaignsService.getTemplates,
  });

  const createTemplateMutation = useMutation({
    mutationFn: campaignsService.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-templates'] });
      toast({
        title: "Vorlage erstellt",
        description: "Die neue Vorlage wurde erfolgreich erstellt.",
      });
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast({
        title: "Fehler",
        description: "Vorlage konnte nicht erstellt werden.",
        variant: "destructive",
      });
    },
  });

  return {
    templates: templatesQuery.data || [],
    isLoading: templatesQuery.isLoading,
    error: templatesQuery.error,
    createTemplate: createTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
  };
};

export const useListNames = () => {
  return useQuery({
    queryKey: ['list-names'],
    queryFn: campaignsService.getListNames,
  });
};
