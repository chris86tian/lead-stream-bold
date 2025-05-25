import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CampaignForm } from "./CampaignForm";
import { useCampaigns } from "@/hooks/useCampaigns";
import { CampaignInsert } from "@/services/campaignsService";

interface CreateCampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCampaignForm({ isOpen, onClose }: CreateCampaignFormProps) {
  const { createCampaign, isCreating } = useCampaigns();

  const handleSave = (campaignData: CampaignInsert) => {
    createCampaign(campaignData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">Neue Kampagne erstellen</DialogTitle>
        </DialogHeader>
        <CampaignForm
          onSave={handleSave}
          onCancel={onClose}
          isLoading={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
}
