import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Edit, Trash2, BarChart, Users, Copy } from "lucide-react";
import { CampaignEditor } from "./CampaignEditor";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Campaign } from "@/services/campaignsService";

const statusConfig = {
  draft: { label: 'Entwurf', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  active: { label: 'Aktiv', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  paused: { label: 'Pausiert', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  completed: { label: 'Abgeschlossen', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
};

export function CampaignsList() {
  const { campaigns, isLoading, updateCampaign, deleteCampaign, duplicateCampaign, isUpdating, isDeleting, isDuplicating } = useCampaigns();
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const getOpenRate = (opened: number, sent: number) => {
    if (sent === 0) return 0;
    return Math.round((opened / sent) * 100);
  };

  const getClickRate = (clicked: number, sent: number) => {
    if (sent === 0) return 0;
    return Math.round((clicked / sent) * 100);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleSaveCampaign = (updatedCampaign: Campaign) => {
    const { id, created_at, updated_at, user_id, ...updates } = updatedCampaign;
    updateCampaign({ id: updatedCampaign.id, updates });
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm('Sind Sie sicher, dass Sie diese Kampagne löschen möchten?')) {
      deleteCampaign(campaignId);
    }
  };

  const handleToggleStatus = (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    updateCampaign({ id: campaign.id, updates: { status: newStatus } });
  };

  const handleDuplicateCampaign = (campaignId: string) => {
    duplicateCampaign(campaignId);
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Kampagnen werden geladen...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Alle Kampagnen</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>Noch keine Kampagnen vorhanden.</p>
              <p className="text-sm mt-2">Erstellen Sie Ihre erste Kampagne mit dem Button oben rechts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const statusInfo = statusConfig[campaign.status as keyof typeof statusConfig];
                const openRate = getOpenRate(campaign.opened_count || 0, campaign.sent_count || 0);
                const clickRate = getClickRate(campaign.clicked_count || 0, campaign.sent_count || 0);

                return (
                  <div
                    key={campaign.id}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white cursor-pointer hover:text-blue-400" 
                            onClick={() => handleEditCampaign(campaign)}>
                          {campaign.name}
                        </h3>
                        <Badge variant="outline" className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                          onClick={() => handleDuplicateCampaign(campaign.id)}
                          disabled={isDuplicating}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        {campaign.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                            onClick={() => handleToggleStatus(campaign)}
                            disabled={isUpdating}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        {campaign.status === 'paused' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                            onClick={() => handleToggleStatus(campaign)}
                            disabled={isUpdating}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                        >
                          <BarChart className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-red-600 border-red-500 text-red-300 hover:bg-red-500"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-3 cursor-pointer hover:text-blue-400" 
                       onClick={() => handleEditCampaign(campaign)}>
                      {campaign.subject}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-400">Empfänger</p>
                          <p className="font-semibold text-white">{campaign.recipients_count || 0}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400">Gesendet</p>
                        <p className="font-semibold text-white">{campaign.sent_count || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Geöffnet</p>
                        <p className="font-semibold text-green-400">{campaign.opened_count || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Geklickt</p>
                        <p className="font-semibold text-blue-400">{campaign.clicked_count || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Öffnungsrate</p>
                        <p className="font-semibold text-green-400">{openRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Klickrate</p>
                        <p className="font-semibold text-blue-400">{clickRate}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {editingCampaign && (
        <CampaignEditor
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSave={handleSaveCampaign}
        />
      )}
    </>
  );
}
