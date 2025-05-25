import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Server, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendTestEmail } from "@/services/emailService";

interface SmtpSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmtpSettingsModal({ isOpen, onClose }: SmtpSettingsModalProps) {
  const { toast } = useToast();
  const [smtpData, setSmtpData] = useState({
    host: '',
    port: '587',
    username: '',
    password: '',
    encryption: 'tls',
    fromEmail: '',
    fromName: '',
    testEmail: '',
    useAuthentication: true
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving SMTP settings:', smtpData);
    toast({
      title: "Einstellungen gespeichert",
      description: "Die SMTP-Einstellungen wurden erfolgreich gespeichert.",
    });
    onClose();
  };

  const testConnection = async () => {
    if (!smtpData.testEmail) {
      toast({
        title: "Fehler", 
        description: "Bitte geben Sie eine Test E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    if (!smtpData.fromEmail || !smtpData.fromName) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie Absender-E-Mail und Namen ein.",
        variant: "destructive",
      });
      return;
    }

    setTestStatus('testing');
    console.log('Testing SMTP connection via backend API');

    try {
      const result = await sendTestEmail({
        fromEmail: smtpData.fromEmail,
        fromName: smtpData.fromName,
        testEmail: smtpData.testEmail,
        method: 'smtp'
      });

      if (result.success) {
        setTestStatus('success');
        toast({
          title: "Test erfolgreich!",
          description: result.message || "Die Test-E-Mail wurde erfolgreich über SMTP versendet.",
        });
      } else {
        throw new Error(result.error || 'SMTP-Test fehlgeschlagen');
      }
    } catch (error: any) {
      console.error("Error testing SMTP:", error);
      setTestStatus('error');
      toast({
        title: "Test fehlgeschlagen",
        description: error.message || "Der SMTP-Test konnte nicht durchgeführt werden. Prüfen Sie Ihre Einstellungen.",
        variant: "destructive",
      });
    }

    // Reset status after 5 seconds
    setTimeout(() => setTestStatus('idle'), 5000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center">
            <Server className="w-5 h-5 mr-2" />
            SMTP Server Einstellungen
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Server className="w-4 h-4 mr-2" />
                Server Konfiguration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="host" className="text-gray-300">SMTP Host</Label>
                  <Input
                    id="host"
                    value={smtpData.host}
                    onChange={(e) => setSmtpData({ ...smtpData, host: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="bg-gray-600 border-gray-500 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="port" className="text-gray-300">Port</Label>
                  <Input
                    id="port"
                    value={smtpData.port}
                    onChange={(e) => setSmtpData({ ...smtpData, port: e.target.value })}
                    placeholder="587"
                    className="bg-gray-600 border-gray-500 text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300">Verschlüsselung</Label>
                <Select value={smtpData.encryption} onValueChange={(value) => setSmtpData({ ...smtpData, encryption: value })}>
                  <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-600 border-gray-500">
                    <SelectItem value="none">Keine</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Authentifizierung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="useAuth"
                  checked={smtpData.useAuthentication}
                  onCheckedChange={(checked) => setSmtpData({ ...smtpData, useAuthentication: checked })}
                />
                <Label htmlFor="useAuth" className="text-gray-300">
                  Authentifizierung verwenden
                </Label>
              </div>
              
              {smtpData.useAuthentication && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username" className="text-gray-300">Benutzername</Label>
                    <Input
                      id="username"
                      value={smtpData.username}
                      onChange={(e) => setSmtpData({ ...smtpData, username: e.target.value })}
                      placeholder="ihr@email.de"
                      className="bg-gray-600 border-gray-500 text-white"
                      required={smtpData.useAuthentication}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-gray-300">Passwort</Label>
                    <Input
                      id="password"
                      type="password"
                      value={smtpData.password}
                      onChange={(e) => setSmtpData({ ...smtpData, password: e.target.value })}
                      placeholder="••••••••"
                      className="bg-gray-600 border-gray-500 text-white"
                      required={smtpData.useAuthentication}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Standard Absender
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName" className="text-gray-300">Absender Name</Label>
                  <Input
                    id="fromName"
                    value={smtpData.fromName}
                    onChange={(e) => setSmtpData({ ...smtpData, fromName: e.target.value })}
                    placeholder="Ihr Unternehmen"
                    className="bg-gray-600 border-gray-500 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail" className="text-gray-300">Absender E-Mail</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={smtpData.fromEmail}
                    onChange={(e) => setSmtpData({ ...smtpData, fromEmail: e.target.value })}
                    placeholder="noreply@ihrewebsite.de"
                    className="bg-gray-600 border-gray-500 text-white"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">Verbindung testen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testEmail" className="text-gray-300">Test E-Mail senden an</Label>
                <div className="flex space-x-2">
                  <Input
                    id="testEmail"
                    type="email"
                    value={smtpData.testEmail}
                    onChange={(e) => setSmtpData({ ...smtpData, testEmail: e.target.value })}
                    placeholder="test@example.com"
                    className="bg-gray-600 border-gray-500 text-white flex-1"
                  />
                  <Button
                    type="button"
                    onClick={testConnection}
                    disabled={testStatus === 'testing' || !smtpData.testEmail || !smtpData.fromEmail}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {testStatus === 'testing' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Teste...
                      </>
                    ) : (
                      'Test senden'
                    )}
                  </Button>
                </div>
              </div>
              
              {testStatus === 'success' && (
                <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400">
                  Test erfolgreich! E-Mail wurde über SMTP versendet.
                </div>
              )}
              
              {testStatus === 'error' && (
                <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Test fehlgeschlagen. Bitte überprüfen Sie Ihre SMTP-Einstellungen.
                </div>
              )}
            </CardContent>
          </Card>

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
              Einstellungen speichern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
