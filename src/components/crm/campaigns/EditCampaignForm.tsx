import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CampaignForm } from "./CampaignForm";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Campaign } from "@/services/campaignsService";

interface EditCampaignFormProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCampaignForm({ campaign, isOpen, onClose }: EditCampaignFormProps) {
  const { updateCampaign, isUpdating } = useCampaigns();

  const handleSave = (updatedCampaign: Campaign) => {
    const { id, created_at, updated_at, user_id, ...updates } = updatedCampaign;
    updateCampaign({ id: campaign.id, updates });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">Kampagne bearbeiten</DialogTitle>
        </DialogHeader>
        <CampaignForm
          campaign={campaign}
          onSave={handleSave}
          onCancel={onClose}
          isLoading={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}
