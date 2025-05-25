import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiCallsService } from "@/services/aiCallsService";
import { AiCall } from "@/types/aiCalls";
import { useToast } from "@/hooks/use-toast";

export const useAiCalls = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const aiCallsQuery = useQuery({
    queryKey: ['aiCalls'],
    queryFn: aiCallsService.getAiCalls,
  });

  const createAiCallMutation = useMutation({
    mutationFn: aiCallsService.createAiCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiCalls'] });
      toast({
        title: "AI-Call erstellt",
        description: "Der neue AI-Call wurde erfolgreich erstellt.",
      });
    },
    onError: (error) => {
      console.error('Error creating AI call:', error);
      toast({
        title: "Fehler",
        description: "AI-Call konnte nicht erstellt werden.",
        variant: "destructive",
      });
    },
  });

  const updateAiCallMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AiCall> }) =>
      aiCallsService.updateAiCall(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiCalls'] });
      toast({
        title: "AI-Call aktualisiert",
        description: "Der AI-Call wurde erfolgreich aktualisiert.",
      });
    },
    onError: (error) => {
      console.error('Error updating AI call:', error);
      toast({
        title: "Fehler",
        description: "AI-Call konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  const deleteAiCallMutation = useMutation({
    mutationFn: aiCallsService.deleteAiCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiCalls'] });
      toast({
        title: "AI-Call gelöscht",
        description: "Der AI-Call wurde erfolgreich gelöscht.",
      });
    },
    onError: (error) => {
      console.error('Error deleting AI call:', error);
      toast({
        title: "Fehler",
        description: "AI-Call konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    },
  });

  return {
    aiCalls: aiCallsQuery.data || [],
    isLoading: aiCallsQuery.isLoading,
    error: aiCallsQuery.error,
    createAiCall: createAiCallMutation.mutate,
    updateAiCall: updateAiCallMutation.mutate,
    deleteAiCall: deleteAiCallMutation.mutate,
    isCreating: createAiCallMutation.isPending,
    isUpdating: updateAiCallMutation.isPending,
    isDeleting: deleteAiCallMutation.isPending,
  };
};
