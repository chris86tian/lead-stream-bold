import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign, CampaignInsert } from "@/services/campaignsService";
import { useListNames } from "@/hooks/useCampaigns";

interface CampaignFormProps {
  campaign?: Campaign;
  onSave: (campaign: CampaignInsert | Campaign) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CampaignForm({ campaign, onSave, onCancel, isLoading = false }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    subject: campaign?.subject || '',
    content: campaign?.content || '',
    from_name: campaign?.from_name || '',
    from_email: campaign?.from_email || '',
    status: campaign?.status || 'draft',
    scheduled_at: campaign?.scheduled_at ? new Date(campaign.scheduled_at).toISOString().slice(0, 16) : '',
  });

  const { data: listNames = [] } = useListNames();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaignData = {
      ...formData,
      scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : null,
    };

    if (campaign) {
      onSave({ ...campaign, ...campaignData });
    } else {
      onSave(campaignData as CampaignInsert);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Kampagnen-Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Kampagnen-Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="subject" className="text-gray-300">Betreff</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-gray-300">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="draft" className="text-white">Entwurf</SelectItem>
                  <SelectItem value="active" className="text-white">Aktiv</SelectItem>
                  <SelectItem value="paused" className="text-white">Pausiert</SelectItem>
                  <SelectItem value="completed" className="text-white">Abgeschlossen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scheduledAt" className="text-gray-300">Geplant für</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Absender-Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fromName" className="text-gray-300">Absender Name</Label>
              <Input
                id="fromName"
                value={formData.from_name}
                onChange={(e) => handleInputChange('from_name', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                placeholder="Ihr Name"
              />
            </div>
            <div>
              <Label htmlFor="fromEmail" className="text-gray-300">Absender E-Mail</Label>
              <Input
                id="fromEmail"
                type="email"
                value={formData.from_email}
                onChange={(e) => handleInputChange('from_email', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                placeholder="ihre@email.com"
              />
            </div>
            {listNames.length > 0 && (
              <div>
                <Label className="text-gray-300">Verfügbare Listen</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {listNames.map((listName) => (
                    <span key={listName} className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-sm">
                      {listName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-700 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">E-Mail Inhalt</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="bg-gray-600 border-gray-500 text-white min-h-[300px]"
            placeholder="Schreiben Sie hier Ihre E-Mail..."
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isLoading ? 'Speichern...' : 'Speichern'}
        </Button>
      </div>
    </form>
  );
}
