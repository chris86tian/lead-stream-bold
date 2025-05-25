import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, AlertCircle, CheckCircle, Globe, Loader2, Settings, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendTestEmail, getEmailServiceStatus } from "@/services/emailService";

interface ResendSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResendSettingsModal({ isOpen, onClose }: ResendSettingsModalProps) {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    fromEmail: '',
    fromName: '',
    testEmail: '',
    domain: ''
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<any>(null);

  // Check service status on modal open
  useEffect(() => {
    if (isOpen) {
      checkServiceStatus();
      loadEmailSettings();
    }
  }, [isOpen]);

  const checkServiceStatus = async () => {
    try {
      const status = await getEmailServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error('Error checking service status:', error);
    }
  };

  const loadEmailSettings = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Fehler",
          description: "Sie müssen angemeldet sein, um E-Mail-Einstellungen zu verwalten.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading email settings:', error);
        toast({
          title: "Fehler",
          description: "Fehler beim Laden der E-Mail-Einstellungen.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setEmailSettings({
          fromEmail: data.from_email,
          fromName: data.from_name,
          testEmail: '',
          domain: data.domain || ''
        });
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmailSettings = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Fehler",
          description: "Sie müssen angemeldet sein, um E-Mail-Einstellungen zu speichern.",
          variant: "destructive",
        });
        return false;
      }

      const settingsData = {
        user_id: user.id,
        from_email: emailSettings.fromEmail,
        from_name: emailSettings.fromName,
        domain: emailSettings.domain || null
      };

      const { error } = await supabase
        .from('email_settings')
        .upsert(settingsData, { 
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving email settings:', error);
        toast({
          title: "Fehler",
          description: "Fehler beim Speichern der E-Mail-Einstellungen.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: "Fehler",
        description: "Fehler beim Speichern der E-Mail-Einstellungen.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving email settings:', emailSettings);
    
    const success = await saveEmailSettings();
    if (success) {
      toast({
        title: "Einstellungen gespeichert",
        description: "Die E-Mail-Einstellungen wurden erfolgreich gespeichert.",
      });
      onClose();
    }
  };

  const testEmailSending = async () => {
    if (!emailSettings.testEmail) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine Test E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    if (!emailSettings.fromEmail || !emailSettings.fromName) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie Absender-E-Mail und Namen ein.",
        variant: "destructive",
      });
      return;
    }

    setTestStatus('testing');
    console.log('Testing email sending with settings:', emailSettings);

    try {
      const result = await sendTestEmail({
        fromEmail: emailSettings.fromEmail,
        fromName: emailSettings.fromName,
        testEmail: emailSettings.testEmail,
        domain: emailSettings.domain,
        method: 'resend'
      });

      if (result.success) {
        console.log('Test email sent successfully:', result.id);
        setTestStatus('success');
        toast({
          title: "Test erfolgreich!",
          description: result.message || `Test-E-Mail wurde erfolgreich an ${emailSettings.testEmail} gesendet.`,
        });
      } else {
        throw new Error(result.error || 'Unbekannter Fehler');
      }
    } catch (error: any) {
      console.error("Error testing email:", error);
      setTestStatus('error');
      toast({
        title: "Test fehlgeschlagen",
        description: error.message || "Der E-Mail-Test konnte nicht durchgeführt werden. Prüfen Sie Ihre Einstellungen.",
        variant: "destructive",
      });
    }

    setTimeout(() => setTestStatus('idle'), 5000);
  };

  const extractDomainFromEmail = (email: string) => {
    const domain = email.split('@')[1];
    if (domain && domain !== emailSettings.domain) {
      setEmailSettings({ ...emailSettings, domain });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            E-Mail Einstellungen (Resend)
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Lade Einstellungen...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  API-Konfiguration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceStatus?.resend.configured ? (
                  <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center text-green-400 mb-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="font-medium">Resend API konfiguriert</span>
                    </div>
                    <p className="text-sm text-green-300">
                      Der Resend API-Key ist verfügbar und einsatzbereit.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center text-red-400 mb-2">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="font-medium">Resend API nicht verfügbar</span>
                    </div>
                    <p className="text-sm text-red-300 mb-2">
                      Der Resend API-Key ist nicht konfiguriert. Bitte setzen Sie die Umgebungsvariable:
                    </p>
                    <p className="text-xs text-red-200 font-mono bg-red-900/30 p-2 rounded">
                      RESEND_API_KEY=your_api_key_here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Absender-Konfiguration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromName" className="text-gray-300">Absender Name</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
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
                      value={emailSettings.fromEmail}
                      onChange={(e) => {
                        setEmailSettings({ ...emailSettings, fromEmail: e.target.value });
                        extractDomainFromEmail(e.target.value);
                      }}
                      placeholder="noreply@ihredomain.de"
                      className="bg-gray-600 border-gray-500 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="domain" className="text-gray-300">Domain (optional)</Label>
                  <Input
                    id="domain"
                    value={emailSettings.domain}
                    onChange={(e) => setEmailSettings({ ...emailSettings, domain: e.target.value })}
                    placeholder="ihredomain.de"
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>
                
                {emailSettings.domain && (
                  <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center text-yellow-400 mb-2">
                      <Globe className="w-4 h-4 mr-2" />
                      <span className="font-medium">Domain-Verifizierung erforderlich</span>
                    </div>
                    <p className="text-sm text-yellow-300">
                      Die Domain <strong>{emailSettings.domain}</strong> muss in Resend verifiziert werden, bevor E-Mails gesendet werden können.
                    </p>
                    <p className="text-xs text-yellow-200 mt-2">
                      Besuchen Sie{' '}
                      <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="underline">
                        resend.com/domains
                      </a>{' '}
                      um Ihre Domain zu verifizieren.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">E-Mail-Versand testen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="testEmail" className="text-gray-300">Test E-Mail senden an</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="testEmail"
                      type="email"
                      value={emailSettings.testEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, testEmail: e.target.value })}
                      placeholder="test@example.com"
                      className="bg-gray-600 border-gray-500 text-white flex-1"
                    />
                    <Button
                      type="button"
                      onClick={testEmailSending}
                      disabled={testStatus === 'testing' || !emailSettings.testEmail || !emailSettings.fromEmail || !serviceStatus?.resend.configured}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {testStatus === 'testing' ? 'Teste...' : 'Test senden'}
                    </Button>
                  </div>
                </div>
                
                {testStatus === 'success' && (
                  <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Test erfolgreich! E-Mail wurde über Resend versendet.
                  </div>
                )}
                
                {testStatus === 'error' && (
                  <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Test fehlgeschlagen. Bitte überprüfen Sie Ihre Einstellungen.
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
                disabled={isSaving}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={isSaving || !emailSettings.fromEmail || !emailSettings.fromName}
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Einstellungen speichern
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
