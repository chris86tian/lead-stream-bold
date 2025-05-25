import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, X, Eye, Users, BarChart, Settings } from "lucide-react";
import { Campaign } from "@/services/campaignsService";
import { useListNames } from "@/hooks/useCampaigns";

interface CampaignEditorProps {
  campaign: Campaign;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
}

export function CampaignEditor({ campaign, onClose, onSave }: CampaignEditorProps) {
  const [editedCampaign, setEditedCampaign] = useState<Campaign>(campaign);
  const [hasChanges, setHasChanges] = useState(false);
  const { data: listNames = [] } = useListNames();

  const handleInputChange = (field: keyof Campaign, value: string | number | null) => {
    setEditedCampaign(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(editedCampaign);
    setHasChanges(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Entwurf';
      case 'active': return 'Aktiv';
      case 'paused': return 'Pausiert';
      case 'completed': return 'Abgeschlossen';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">Kampagne bearbeiten</h2>
            <Badge variant="outline" className={getStatusColor(editedCampaign.status)}>
              {getStatusLabel(editedCampaign.status)}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <Eye className="w-4 h-4 mr-2" />
              Vorschau
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="bg-gray-700 border-b border-gray-600">
              <TabsTrigger value="content" className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white">
                Inhalt
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Einstellungen
              </TabsTrigger>
              <TabsTrigger value="recipients" className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Empfänger
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white">
                <BarChart className="w-4 h-4 mr-2" />
                Statistiken
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto p-6">
              <TabsContent value="content" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">E-Mail Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-300">Kampagnen-Name</Label>
                        <Input
                          id="name"
                          value={editedCampaign.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-gray-300">Betreff</Label>
                        <Input
                          id="subject"
                          value={editedCampaign.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fromName" className="text-gray-300">Absender Name</Label>
                        <Input
                          id="fromName"
                          value={editedCampaign.from_name || ''}
                          onChange={(e) => handleInputChange('from_name', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white"
                          placeholder="Ihr Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fromEmail" className="text-gray-300">Absender E-Mail</Label>
                        <Input
                          id="fromEmail"
                          value={editedCampaign.from_email || ''}
                          onChange={(e) => handleInputChange('from_email', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white"
                          placeholder="ihre@email.com"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">E-Mail Inhalt</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={editedCampaign.content || ''}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white min-h-[300px]"
                        placeholder="Schreiben Sie hier Ihre E-Mail..."
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Kampagnen-Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="status" className="text-gray-300">Status</Label>
                        <Select
                          value={editedCampaign.status}
                          onValueChange={(value) => handleInputChange('status', value)}
                        >
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
                          value={editedCampaign.scheduled_at ? new Date(editedCampaign.scheduled_at).toISOString().slice(0, 16) : ''}
                          onChange={(e) => handleInputChange('scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : null)}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Erweiterte Optionen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackOpens" className="text-gray-300">Öffnungen verfolgen</Label>
                        <Switch id="trackOpens" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackClicks" className="text-gray-300">Klicks verfolgen</Label>
                        <Switch id="trackClicks" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoResend" className="text-gray-300">Automatisch wiedersenden</Label>
                        <Switch id="autoResend" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recipients" className="space-y-6 mt-0">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">Empfänger verwalten</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{editedCampaign.recipients_count || 0}</div>
                        <div className="text-gray-400">Gesamt Empfänger</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{editedCampaign.sent_count || 0}</div>
                        <div className="text-gray-400">Bereits gesendet</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{(editedCampaign.recipients_count || 0) - (editedCampaign.sent_count || 0)}</div>
                        <div className="text-gray-400">Ausstehend</div>
                      </div>
                    </div>

                    {listNames.length > 0 && (
                      <div className="mb-4">
                        <Label className="text-gray-300">Verfügbare Listen</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {listNames.map((listName) => (
                            <Badge key={listName} variant="outline" className="bg-gray-600 text-gray-300">
                              {listName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Users className="w-4 h-4 mr-2" />
                      Empfänger verwalten
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-400">{editedCampaign.opened_count || 0}</div>
                      <div className="text-gray-400">Geöffnet</div>
                      <div className="text-sm text-green-400">
                        {(editedCampaign.sent_count || 0) > 0 ? Math.round(((editedCampaign.opened_count || 0) / (editedCampaign.sent_count || 1)) * 100) : 0}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-400">{editedCampaign.clicked_count || 0}</div>
                      <div className="text-gray-400">Geklickt</div>
                      <div className="text-sm text-blue-400">
                        {(editedCampaign.sent_count || 0) > 0 ? Math.round(((editedCampaign.clicked_count || 0) / (editedCampaign.sent_count || 1)) * 100) : 0}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-yellow-400">
                        {(editedCampaign.opened_count || 0) > 0 ? Math.round(((editedCampaign.clicked_count || 0) / (editedCampaign.opened_count || 1)) * 100) : 0}%
                      </div>
                      <div className="text-gray-400">Click-through-Rate</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-400">0</div>
                      <div className="text-gray-400">Abmeldungen</div>
                      <div className="text-sm text-purple-400">0%</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
