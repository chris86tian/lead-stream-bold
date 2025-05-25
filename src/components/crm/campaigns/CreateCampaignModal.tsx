import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Users, Calendar, Settings } from "lucide-react";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    fromName: '',
    fromEmail: '',
    recipients: 'all',
    content: '',
    scheduleType: 'immediate'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating campaign:', campaignData);
    // Hier würde die Kampagne erstellt und an n8n gesendet werden
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Neue E-Mail Kampagne erstellen
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700">
              <TabsTrigger value="basic" className="data-[state=active]:bg-gray-600">
                <Settings className="w-4 h-4 mr-2" />
                Grundlagen
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                Inhalt
              </TabsTrigger>
              <TabsTrigger value="recipients" className="data-[state=active]:bg-gray-600">
                <Users className="w-4 h-4 mr-2" />
                Empfänger
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Zeitplan
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Kampagnen-Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="campaignName" className="text-gray-300">Kampagnenname</Label>
                    <Input
                      id="campaignName"
                      value={campaignData.name}
                      onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                      placeholder="z.B. Willkommens-E-Mail"
                      className="bg-gray-600 border-gray-500 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-gray-300">Betreffzeile</Label>
                    <Input
                      id="subject"
                      value={campaignData.subject}
                      onChange={(e) => setCampaignData({ ...campaignData, subject: e.target.value })}
                      placeholder="Betreff der E-Mail"
                      className="bg-gray-600 border-gray-500 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromName" className="text-gray-300">Absender Name</Label>
                      <Input
                        id="fromName"
                        value={campaignData.fromName}
                        onChange={(e) => setCampaignData({ ...campaignData, fromName: e.target.value })}
                        placeholder="Ihr Name"
                        className="bg-gray-600 border-gray-500 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fromEmail" className="text-gray-300">Absender E-Mail</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={campaignData.fromEmail}
                        onChange={(e) => setCampaignData({ ...campaignData, fromEmail: e.target.value })}
                        placeholder="ihre@email.de"
                        className="bg-gray-600 border-gray-500 text-white"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">E-Mail Inhalt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="content" className="text-gray-300">E-Mail Text</Label>
                    <Textarea
                      id="content"
                      value={campaignData.content}
                      onChange={(e) => setCampaignData({ ...campaignData, content: e.target.value })}
                      placeholder="Schreiben Sie hier Ihre E-Mail..."
                      className="bg-gray-600 border-gray-500 text-white min-h-[200px]"
                      required
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>Verfügbare Platzhalter:</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <code className="bg-gray-600 px-2 py-1 rounded">{"{{name}}"}</code>
                      <code className="bg-gray-600 px-2 py-1 rounded">{"{{email}}"}</code>
                      <code className="bg-gray-600 px-2 py-1 rounded">{"{{company}}"}</code>
                      <code className="bg-gray-600 px-2 py-1 rounded">{"{{first_name}}"}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recipients" className="space-y-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Empfänger auswählen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Zielgruppe</Label>
                    <Select value={campaignData.recipients} onValueChange={(value) => setCampaignData({ ...campaignData, recipients: value })}>
                      <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-600 border-gray-500">
                        <SelectItem value="all">Alle Leads</SelectItem>
                        <SelectItem value="new">Neue Leads</SelectItem>
                        <SelectItem value="qualified">Qualifizierte Leads</SelectItem>
                        <SelectItem value="customers">Bestehende Kunden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 bg-gray-600 rounded-lg">
                    <p className="text-gray-300 mb-2">Vorschau der Empfänger:</p>
                    <p className="text-white font-semibold">~250 Empfänger basierend auf der Auswahl</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Versand planen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Versand-Zeitpunkt</Label>
                    <Select value={campaignData.scheduleType} onValueChange={(value) => setCampaignData({ ...campaignData, scheduleType: value })}>
                      <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-600 border-gray-500">
                        <SelectItem value="immediate">Sofort senden</SelectItem>
                        <SelectItem value="scheduled">Für später planen</SelectItem>
                        <SelectItem value="trigger">Trigger-basiert (n8n)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {campaignData.scheduleType === 'scheduled' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Datum</Label>
                        <Input type="date" className="bg-gray-600 border-gray-500 text-white" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Uhrzeit</Label>
                        <Input type="time" className="bg-gray-600 border-gray-500 text-white" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Kampagne erstellen
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
